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
            <!-- Empty State -->
            <g v-if="isEmpty">
                <text
                    :x="chartArea.x + chartArea.width / 2"
                    :y="chartArea.y + chartArea.height / 2"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    class="text-gray-500"
                    font-size="14"
                >
                    No data to display
                </text>
            </g>

            <!-- Invalid Data State -->
            <g v-else-if="!isValid">
                <text
                    :x="chartArea.x + chartArea.width / 2"
                    :y="chartArea.y + chartArea.height / 2 - 10"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    class="text-red-500"
                    font-size="14"
                    font-weight="600"
                >
                    Invalid chart data
                </text>
                <text
                    :x="chartArea.x + chartArea.width / 2"
                    :y="chartArea.y + chartArea.height / 2 + 15"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    class="text-gray-500"
                    font-size="12"
                >
                    Please check that data and labels are properly formatted
                </text>
            </g>

            <!-- Chart Content -->
            <g v-else>
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
                            class="bar transition-all duration-300"
                            :class="{ 'cursor-pointer bar-interactive-hover': isInteractive }"
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

/**
 * @fileoverview BarChart component - Vertical bar chart with customizable axes
 * @module components/charts/BarChart
 */

<script setup>
import { computed, ref, toRef } from 'vue'
import BaseChart from './BaseChart.vue'
import ChartAxis from '@/components/shared/ChartAxis.vue'
import ChartTooltip from '@/components/shared/ChartTooltip.vue'
import { useChartConfig } from '@/composables/useChartConfig.js'
import { useChartData } from '@/composables/useChartData.js'
import { useChartScale } from '@/composables/useChartScale.js'
import { useDatasetVisibility } from '@/composables/useDatasetVisibility.js'
import { useBarDimensions } from '@/composables/useBarDimensions.js'

/**
 * Component props
 * @typedef {Object} BarChartProps
 * @property {import('../../types.js').ChartData} data - Chart data with labels and datasets
 * @property {import('../../types.js').ChartOptions} [options] - Chart configuration options
 * @property {number|null} [width] - Fixed chart width (if not responsive)
 * @property {number|null} [height] - Fixed chart height (if not responsive)
 */

const props = defineProps({
    /**
     * Chart data containing labels and datasets
     * @type {import('../../types.js').ChartData}
     */
    data: {
        type: Object,
        required: true
    },
    /**
     * Chart configuration options
     * @type {import('../../types.js').ChartOptions}
     */
    options: {
        type: Object,
        default: () => ({})
    },
    /**
     * Fixed chart width in pixels (overrides responsive)
     * @type {number|null}
     */
    width: {
        type: Number,
        default: null
    },
    /**
     * Fixed chart height in pixels (overrides responsive)
     * @type {number|null}
     */
    height: {
        type: Number,
        default: null
    }
})

/**
 * Component events
 * @typedef {Object} BarChartEmits
 * @property {(event: import('../../types.js').BarClickEvent) => void} bar-click - Emitted when a bar is clicked
 * @property {(event: import('../../types.js').LegendToggleEvent) => void} legend-toggle - Emitted when legend item is toggled
 */

const emit = defineEmits(['bar-click', 'legend-toggle'])

const optionsRef = toRef(props, 'options')
const dataRef = toRef(props, 'data')

const { config, scales } = useChartConfig(optionsRef)
const { normalisedDatasets, labels, isValid, isEmpty } = useChartData(dataRef, optionsRef)

// Dataset visibility management
const { visibleDatasets, handleLegendToggle: toggleDatasetVisibility } = useDatasetVisibility(normalisedDatasets)

const tooltip = ref({
    visible: false,
    data: null,
    x: 0,
    y: 0
})

// Use chart scale composable
const {
    generateYAxisTicks,
    generateXAxisTicks,
    valueToY,
    valueToHeight
} = useChartScale(visibleDatasets, computed(() => ({})), scales)

// Use bar dimensions composable
const { getBarWidth, getBarX } = useBarDimensions({
    labels,
    visibleDatasets,
    gapRatio: 0.2,
    stacked: false
})

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
    toggleDatasetVisibility(event)
    emit('legend-toggle', event)
}
</script>

<style>
/* SVG-specific animations and transforms that can't be replicated with Tailwind */
.bar {
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

.bar-interactive-hover:hover {
    opacity: 0.85;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
    transform: translateY(-2px) scaleY(1);
}

.bar-interactive-hover:active {
    transform: translateY(0) scaleY(1);
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}
</style>
