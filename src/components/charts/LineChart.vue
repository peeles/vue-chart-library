<template>
    <BaseChart
        :data="data"
        :height="height"
        :options="options"
        :width="width"
        aria-label="Line Chart"
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
            <ChartAxis
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
            <ChartAxis
                v-if="scales.x?.display !== false"
                :chart-area="chartArea"
                :show-grid="scales.x?.grid?.display !== false"
                :show-labels="scales.x?.ticks?.display !== false"
                :show-line="true"
                :show-ticks="scales.x?.ticks?.display !== false"
                :ticks="getXAxisTicks(chartArea)"
                axis="x"
            />

            <!-- Lines with Area Fills -->
            <g class="lines-group">
                <g
                    v-for="(dataset, datasetIndex) in visibleDatasets"
                    :key="datasetIndex"
                    :class="`dataset-${datasetIndex}`"
                >
                    <!-- Area Fill -->
                    <path
                        v-if="dataset.fill"
                        :d="getAreaPath(dataset, datasetIndex, chartArea)"
                        :fill="dataset.backgroundColor || dataset.borderColor"
                        :opacity="dataset.fillOpacity || 0.2"
                        class="line-area transition-opacity duration-200 ease-linear"
                    />

                    <!-- Line Path -->
                    <path
                        :class="{ 'cursor-pointer': isInteractive, 'line-path-interactive-hover': isInteractive }"
                        :d="getLinePath(dataset, datasetIndex, chartArea)"
                        :stroke="dataset.borderColor"
                        :stroke-dasharray="dataset.borderDash?.join(',') || ''"
                        :stroke-width="dataset.borderWidth || 2"
                        class="line-path transition-all duration-200 ease-linear"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />

                    <!-- Data Points -->
                    <g
                        v-if="showPoints(dataset)"
                        class="data-points"
                    >
                        <circle
                            v-for="(point, pointIndex) in getDataPoints(dataset, datasetIndex, chartArea)"
                            :key="pointIndex"
                            :aria-label="`${data.labels[pointIndex]}: ${point.value}`"
                            :class="{ 'cursor-pointer data-point-interactive-hover': isInteractive }"
                            :cx="point.x"
                            :cy="point.y"
                            :fill="dataset.pointBackgroundColor || dataset.backgroundColor || dataset.borderColor"
                            :r="getPointRadius(dataset)"
                            :stroke="dataset.pointBorderColor || dataset.borderColor"
                            :stroke-width="dataset.pointBorderWidth || 2"
                            class="data-point transition-all duration-200 ease-linear"
                            role="graphics-symbol"
                            @click="handlePointClick(pointIndex, datasetIndex, point.value)"
                            @mouseenter="handlePointHover(pointIndex, datasetIndex, point.value, $event)"
                            @mouseleave="handlePointLeave"
                        >
                            <title>{{ data.labels[pointIndex] }}: {{ point.value }}</title>
                        </circle>
                    </g>
                </g>
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
        <template #additional_controls>
            <slot name="additional_controls" />
        </template>
    </BaseChart>
</template>

<script setup>
import { computed, ref, toRef } from 'vue'
import BaseChart from './BaseChart.vue'
import ChartAxis from '@/components/shared/ChartAxis.vue'
import ChartTooltip from '@/components/shared/ChartTooltip.vue'
import { useChartConfig } from '@/composables/useChartConfig.js'
import { useChartData } from '@/composables/useChartData.js'
import { useChartScale } from '@/composables/useChartScale.js'
import { useDatasetVisibility } from '@/composables/useDatasetVisibility.js'

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

const emit = defineEmits(['point-click', 'legend-toggle'])

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
    valueToY
} = useChartScale(visibleDatasets, computed(() => ({})), scales)

const isInteractive = computed(() => {
    return config.value.plugins?.tooltip?.enabled !== false
})

// Generate axis ticks
function getYAxisTicks(chartArea) {
    return generateYAxisTicks(chartArea)
}

function getXAxisTicks(chartArea) {
    const xAxisOptions = {
        flush: scales.value?.x?.flush === true
    }
    return generateXAxisTicks(chartArea, labels.value, xAxisOptions)
}

// Calculate X position for a data point
function getXPosition(index, chartArea) {
    const labelCount = labels.value.length
    if (labelCount === 0) return chartArea.x

    const isFlush = scales.value?.x?.flush === true

    if (isFlush) {
        // Flush mode: points at edges
        if (labelCount === 1) {
            return chartArea.x + chartArea.width / 2
        }
        return chartArea.x + (chartArea.width / (labelCount - 1)) * index
    } else {
        // Centered mode: points in segment centers
        return chartArea.x + (chartArea.width / labelCount) * (index + 0.5)
    }
}

// Get data points with coordinates
function getDataPoints(dataset, _datasetIndex, chartArea) {
    return dataset.data.map((value, index) => ({
        x: getXPosition(index, chartArea),
        y: valueToY(value, chartArea),
        value
    }))
}

// Generate line path
function getLinePath(dataset, datasetIndex, chartArea) {
    const points = getDataPoints(dataset, datasetIndex, chartArea)
    if (points.length === 0) return ''

    const tension = dataset.tension || 0.4
    const smooth = dataset.smooth !== false

    if (!smooth || tension === 0) {
        // Straight lines
        return points.map((point, index) => {
            return index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`
        }).join(' ')
    }

    // Smooth curved lines using cardinal spline
    return generateSmoothPath(points, tension)
}

// Generate area fill path
function getAreaPath(dataset, datasetIndex, chartArea) {
    const points = getDataPoints(dataset, datasetIndex, chartArea)
    if (points.length === 0) return ''

    const linePath = getLinePath(dataset, datasetIndex, chartArea)
    const baseY = chartArea.y + chartArea.height

    // Close the path at the bottom
    const firstPoint = points[0]
    const lastPoint = points[points.length - 1]

    return `${linePath} L ${lastPoint.x},${baseY} L ${firstPoint.x},${baseY} Z`
}

// Generate smooth path using cardinal spline interpolation
function generateSmoothPath(points, tension) {
    if (points.length < 2) return ''

    let path = `M ${points[0].x},${points[0].y}`

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i > 0 ? i - 1 : i]
        const p1 = points[i]
        const p2 = points[i + 1]
        const p3 = points[i + 2 < points.length ? i + 2 : i + 1]

        const cp1x = p1.x + (p2.x - p0.x) / 6 * tension
        const cp1y = p1.y + (p2.y - p0.y) / 6 * tension
        const cp2x = p2.x - (p3.x - p1.x) / 6 * tension
        const cp2y = p2.y - (p3.y - p1.y) / 6 * tension

        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
    }

    return path
}

// Check if points should be shown
function showPoints(dataset) {
    return dataset.showPoints !== false
}

// Get point radius
function getPointRadius(dataset) {
    return dataset.pointRadius || 4
}

// Event handlers
function handlePointHover(pointIndex, datasetIndex, value, event) {
    if (!isInteractive.value) return

    const dataset = visibleDatasets.value[datasetIndex]

    tooltip.value = {
        visible: true,
        x: event.clientX + 10,
        y: event.clientY - 10,
        data: {
            title: labels.value[pointIndex],
            items: [{
                label: dataset.label,
                value: value,
                color: dataset.borderColor
            }]
        }
    }
}

function handlePointLeave() {
    tooltip.value.visible = false
}

function handlePointClick(pointIndex, datasetIndex, value) {
    emit('point-click', {
        label: labels.value[pointIndex],
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
/* SVG-specific animations that can't be replicated with Tailwind */
.line-path {
    stroke-dasharray: 3000;
    stroke-dashoffset: 3000;
    animation: lineDraw 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes lineDraw {
    to {
        stroke-dashoffset: 0;
    }
}

.line-path-interactive-hover:hover {
    stroke-width: 3;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.line-area {
    animation: areaFadeIn 0.8s ease-out 0.4s backwards;
}

@keyframes areaFadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.data-point {
    animation: pointFadeIn 0.6s ease-out backwards;
}

@keyframes pointFadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.data-point-interactive-hover:hover {
    r: 6;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.data-point-interactive-hover:active {
    r: 5;
}
</style>
