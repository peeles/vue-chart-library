<template>
    <base-chart
        :data="data"
        :options="options"
        :width="width"
        :height="height"
        aria-label="Bar Chart"
        @legend-toggle="handleLegendToggle"
    >
        <template #default="{ chartArea }">
            <!-- Y Axis -->
            <chart-axis
                v-if="scales.y?.display !== false"
                axis="y"
                :ticks="getYAxisTicks(chartArea)"
                :chart-area="chartArea"
                :show-grid="scales.y?.grid?.display !== false"
                :show-line="true"
                :show-ticks="scales.y?.ticks?.display !== false"
                :show-labels="scales.y?.ticks?.display !== false"
            />

            <!-- X Axis -->
            <chart-axis
                v-if="scales.x?.display !== false"
                axis="x"
                :ticks="getXAxisTicks(chartArea)"
                :chart-area="chartArea"
                :show-grid="scales.x?.grid?.display !== false"
                :show-line="true"
                :show-ticks="scales.x?.ticks?.display !== false"
                :show-labels="scales.x?.ticks?.display !== false"
            />

            <!-- Bars -->
            <g class="bars-group">
                <g
                    v-for="(dataset, datasetIndex) in visibleDatasets"
                    :key="datasetIndex"
                    :class="`dataset-${datasetIndex}`"
                >
                    <rect
                        v-for="(value, index) in dataset.data"
                        :key="index"
                        :x="getBarX(index, datasetIndex, chartArea)"
                        :y="valueToY(value, chartArea)"
                        :width="getBarWidth(chartArea)"
                        :height="valueToHeight(value, chartArea)"
                        :fill="dataset.backgroundColor"
                        :stroke="dataset.borderColor"
                        :stroke-width="dataset.borderWidth"
                        class="bar"
                        :class="{ 'bar-interactive': isInteractive }"
                        @mouseenter="handleBarHover(index, datasetIndex, $event)"
                        @mouseleave="handleBarLeave"
                        @click="handleBarClick(index, datasetIndex, value)"
                        role="graphics-symbol"
                        :aria-label="`${data.labels[index]}: ${value}`"
                    >
                        <title>{{ data.labels[index] }}: {{ value }}</title>
                    </rect>
                </g>
            </g>

            <!-- Tooltip -->
            <chart-tooltip
                :visible="tooltip.visible"
                :tooltip-data="tooltip.data"
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
} = useChartScale(visibleDatasets, computed(() => ({})), scales)

const isInteractive = computed(() => {
    return config.value.plugins?.tooltip?.enabled !== false
})

// Generate axis ticks
function getYAxisTicks(chartArea) {
    return generateYAxisTicks(chartArea)
}

function getXAxisTicks(chartArea) {
    return generateXAxisTicks(chartArea, labels.value)
}

// Calculate bar width
function getBarWidth(chartArea) {
    const datasetCount = visibleDatasets.value.length
    const labelCount = labels.value.length
    if (labelCount === 0) return 0

    const groupWidth = chartArea.width / labelCount
    return calculateBarWidth(groupWidth, datasetCount, 0.2)
}

// Bar positioning
function getBarX(labelIndex, datasetIndex, chartArea) {
    const labelCount = labels.value.length
    const datasetCount = visibleDatasets.value.length
    if (labelCount === 0) return 0

    const groupWidth = chartArea.width / labelCount
    const groupStart = chartArea.x + groupWidth * labelIndex
    const barW = getBarWidth(chartArea)

    return groupStart + (barW * datasetIndex) + (groupWidth - (barW * datasetCount)) / 2
}

// Event handlers
function handleBarHover(labelIndex, datasetIndex, event) {
    if (!isInteractive.value) return

    const dataset = visibleDatasets.value[datasetIndex]
    const value = dataset.data[labelIndex]

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
.bar {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
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

.bar-interactive {
    cursor: pointer;
}

.bar-interactive:hover {
    opacity: 0.85;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
    transform: translateY(-2px) scaleY(1);
}

.bar-interactive:active {
    transform: translateY(0) scaleY(1);
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}
</style>
