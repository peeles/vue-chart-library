<template>
    <base-chart
        :data="data"
        :height="height"
        :options="options"
        :width="width"
        aria-label="Stacked Bar Chart"
        @legend-toggle="handleLegendToggle"
    >
        <template #default="{ chartArea }">
            <!-- Y Axis -->
            <chart-axis
                v-if="scales.y?.display !== false"
                :chart-area="chartArea"
                :show-grid="scales.y?.grid?.display !== false"
                :show-labels="scales.y?.ticks?.display !== false"
                :show-line="true"
                :show-ticks="scales.y?.ticks?.display !== false"
                :ticks="getYAxisTicks(chartArea)"
                axis="y"
            />

            <!-- X Axis -->
            <chart-axis
                v-if="scales.x?.display !== false"
                :chart-area="chartArea"
                :show-grid="scales.x?.grid?.display !== false"
                :show-labels="scales.x?.ticks?.display !== false"
                :show-line="true"
                :show-ticks="scales.x?.ticks?.display !== false"
                :ticks="getXAxisTicks(chartArea)"
                axis="x"
            />

            <!-- Stacked Bars -->
            <g class="stacked-bars-group">
                <g
                    v-for="(labelGroup, labelIndex) in getStackedBarsForRender(chartArea)"
                    :key="labelIndex"
                    :class="`label-group-${labelIndex}`"
                >
                    <rect
                        v-for="(bar, datasetIndex) in labelGroup"
                        :key="datasetIndex"
                        :aria-label="`${data.labels[labelIndex]}: ${bar.dataset.label} - ${bar.value}`"
                        :class="{ 'stacked-bar-interactive': isInteractive }"
                        :fill="bar.color"
                        :height="bar.height"
                        :stroke="bar.borderColor"
                        :stroke-width="bar.borderWidth"
                        :width="bar.width"
                        :x="bar.x"
                        :y="bar.y"
                        class="stacked-bar"
                        role="graphics-symbol"
                        @click="handleBarClick(labelIndex, datasetIndex, bar.value)"
                        @mouseenter="handleBarHover(labelIndex, datasetIndex, bar.value, $event)"
                        @mouseleave="handleBarLeave"
                    >
                        <title>{{ data.labels[labelIndex] }}: {{ bar.dataset.label }} - {{ bar.value }}</title>
                    </rect>
                </g>
            </g>

            <!-- Tooltip -->
            <chart-tooltip
                :tooltip-data="tooltip.data"
                :visible="tooltip.visible"
                :x="tooltip.x"
                :y="tooltip.y"
            />
        </template>
    </base-chart>
</template>

<script setup>
import { computed, ref, toRef } from 'vue'
import BaseChart from './BaseChart.vue'
import ChartAxis from '@/components/shared/ChartAxis.vue'
import ChartTooltip from '@/components/shared/ChartTooltip.vue'
import { useChartConfig } from '@/composables/useChartConfig.js'
import { useChartData } from '@/composables/useChartData.js'
import { useChartScale } from '@/composables/useChartScale.js'
import { calculateBarWidth } from '@/utils/chartCalculations.js'

const props = defineProps({
    /**
     * Chart data
     */
    data: {
        type: Object,
        required: true
    },
    /**
     * Chart options
     */
    options: {
        type: Object,
        default: () => ({})
    },
    /**
     * Chart width
     */
    width: {
        type: Number,
        default: null
    },
    /**
     * Chart height
     */
    height: {
        type: Number,
        default: null
    }
})

const emit = defineEmits(['bar-click', 'legend-toggle'])

const optionsRef = toRef(props, 'options')
const dataRef = toRef(props, 'data')

const { config, scales } = useChartConfig(optionsRef)
const { normalizedDatasets, labels } = useChartData(dataRef, optionsRef)

const disabledDatasets = ref(new Set())
const tooltip = ref({
    visible: false,
    data: null,
    x: 0,
    y: 0
})

// Filter visible datasets
const visibleDatasets = computed(() => {
    return normalizedDatasets.value.filter((_, index) => !disabledDatasets.value.has(index))
})

// Use chart scale composable
const {
    generateYAxisTicks,
    generateXAxisTicks,
    valueToY,
    valueToHeight
} = useChartScale(visibleDatasets, computed(() => ({ stacked: true })), scales)

const isInteractive = computed(() => {
    return config.value.plugins?.tooltip?.enabled !== false
})

// Calculate stacked bars data
const stackedBars = computed(() => {
    const labelCount = labels.value.length

    return Array.from({ length: labelCount }, (_, labelIndex) => {
        const labelBars = []
        let cumulativeValue = 0

        visibleDatasets.value.forEach((dataset, datasetIndex) => {
            const value = dataset.data[labelIndex] || 0

            // Only stack positive values
            if (value > 0) {
                labelBars.push({
                    value,
                    dataset,
                    datasetIndex,
                    cumulativeValue,
                    color: dataset.backgroundColor,
                    borderColor: dataset.borderColor || dataset.backgroundColor,
                    borderWidth: dataset.borderWidth || 0
                })
                cumulativeValue += value
            }
        })

        return labelBars
    })
})

// Generate axis ticks
function getYAxisTicks(chartArea) {
    return generateYAxisTicks(chartArea)
}

function getXAxisTicks(chartArea) {
    return generateXAxisTicks(chartArea, labels.value)
}

// Calculate bar dimensions for a specific segment in the stack
function calculateBarDimensions(labelIndex, bar, chartArea) {
    const labelCount = labels.value.length
    if (labelCount === 0) return { x: 0, y: 0, width: 0, height: 0 }

    const groupWidth = chartArea.width / labelCount
    const barWidth = calculateBarWidth(groupWidth, 1, 0.3) // Single bar per label
    const groupStart = chartArea.x + groupWidth * labelIndex
    const x = groupStart + (groupWidth - barWidth) / 2

    // Calculate Y position based on cumulative value
    const stackTop = bar.cumulativeValue + bar.value
    const y = valueToY(stackTop, chartArea)
    const height = valueToHeight(bar.value, chartArea)

    return {
        x,
        y,
        width: barWidth,
        height,
        ...bar
    }
}

// Recalculate bar positions with actual chart area
function getStackedBarsForRender(chartArea) {
    return stackedBars.value.map((labelBars, labelIndex) => {
        return labelBars.map(bar => calculateBarDimensions(labelIndex, bar, chartArea))
    })
}

// Event handlers
function handleBarHover(labelIndex, datasetIndex, value, event) {
    if (!isInteractive.value) return

    const dataset = visibleDatasets.value[datasetIndex]

    tooltip.value = {
        visible: true,
        x: event.clientX + 10,
        y: event.clientY - 10,
        data: {
            title: labels.value[labelIndex],
            items: [{
                label: dataset.label,
                value: value,
                color: dataset.backgroundColor
            }]
        }
    }
}

function handleBarLeave() {
    tooltip.value.visible = false
}

function handleBarClick(labelIndex, datasetIndex, value) {
    emit('bar-click', {
        label: labels.value[labelIndex],
        datasetIndex,
        value
    })
}

function handleLegendToggle(event) {
    if (disabledDatasets.value.has(event.index)) {
        disabledDatasets.value.delete(event.index)
    } else {
        disabledDatasets.value.add(event.index)
    }
    emit('legend-toggle', event)
}
</script>

<style scoped>
.stacked-bar {
    transition: opacity 0.2s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05));
    animation: barGrowth 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
    transform-origin: bottom;
}

@keyframes barGrowth {
    from {
        transform: scaleY(0);
        opacity: 0;
    }
    to {
        transform: scaleY(1);
        opacity: 1;
    }
}

.stacked-bar-interactive {
    cursor: pointer;
}

.stacked-bar-interactive:hover {
    opacity: 0.85;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.stacked-bar-interactive:active {
    opacity: 1;
}
</style>
