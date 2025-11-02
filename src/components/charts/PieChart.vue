<template>
    <base-chart
        :data="data"
        :height="height"
        :options="options"
        :width="width"
        aria-label="Pie Chart"
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
            <g v-else :transform="`translate(${centerX(chartArea)}, ${centerY(chartArea)})`">
                <!-- Pie Slices -->
                <g class="pie-slices">
                    <g
                        v-for="(slice, index) in visibleSlices(chartArea)"
                        :key="index"
                        :class="`slice-${index}`"
                    >
                        <!-- Slice Path -->
                        <path
                            :aria-label="`${slice.label}: ${slice.value} (${slice.percentage.toFixed(1)}%)`"
                            :class="{
                                'cursor-pointer pie-slice-interactive-hover': isInteractive,
                                'pie-slice-hovered': hoveredIndex === index
                            }"
                            :d="slice.path"
                            :fill="slice.color"
                            :stroke="slice.borderColor"
                            :stroke-width="borderWidth"
                            :transform="getSliceTransform(slice)"
                            class="pie-slice transition-all duration-300 ease-linear cursor-default"
                            role="graphics-symbol"
                            @click="handleSliceClick(index, slice)"
                            @mouseenter="handleSliceHover(index, slice, $event)"
                            @mouseleave="handleSliceLeave"
                        >
                            <title>{{ slice.label }}: {{ slice.value }} ({{ slice.percentage.toFixed(1) }}%)</title>
                        </path>

                        <!-- Inner Labels (on slices) -->
                        <g
                            v-if="showLabels && labelPosition === 'inner'"
                            :transform="getSliceTransform(slice)"
                        >
                            <text
                                :fill="labelColor"
                                :font-size="labelFontSize"
                                :x="slice.labelX"
                                :y="slice.labelY"
                                class="pie-label pointer-events-none select-none"
                                dominant-baseline="middle"
                                font-weight="600"
                                text-anchor="middle"
                            >
                                {{ formatLabel(slice) }}
                            </text>
                        </g>

                        <!-- Outer Labels (with lines) -->
                        <g
                            v-if="showLabels && labelPosition === 'outer'"
                            :transform="getSliceTransform(slice)"
                        >
                            <!-- Label Line -->
                            <line
                                :stroke="slice.color"
                                :x1="slice.lineStartX"
                                :x2="slice.lineEndX"
                                :y1="slice.lineStartY"
                                :y2="slice.lineEndY"
                                class="pie-label-line pointer-events-none"
                                stroke-width="2"
                            />
                            <!-- Label Text -->
                            <text
                                :fill="labelColor"
                                :font-size="labelFontSize"
                                :text-anchor="slice.labelAlign"
                                :x="slice.labelX"
                                :y="slice.labelY"
                                class="pie-label pointer-events-none select-none"
                                dominant-baseline="middle"
                                font-weight="500"
                            >
                                {{ formatLabel(slice) }}
                            </text>
                        </g>
                    </g>
                </g>

                <!-- Center Label (for donut) -->
                <g v-if="isDonut && centerLabel">
                    <text
                        :fill="centerLabelColor"
                        :font-size="centerLabelFontSize"
                        class="center-label-title pointer-events-none select-none"
                        dominant-baseline="middle"
                        font-weight="700"
                        text-anchor="middle"
                        x="0"
                        y="-10"
                    >
                        {{ centerLabel.title }}
                    </text>
                    <text
                        :fill="centerLabelColor"
                        :font-size="centerLabelSubFontSize"
                        class="center-label-subtitle pointer-events-none select-none"
                        dominant-baseline="middle"
                        font-weight="400"
                        text-anchor="middle"
                        x="0"
                        y="15"
                    >
                        {{ centerLabel.subtitle }}
                    </text>
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
import ChartTooltip from '@/components/shared/ChartTooltip.vue'
import { useChartConfig } from '@/composables/useChartConfig.js'
import { useChartData } from '@/composables/useChartData.js'
import { calculatePieSlices, describePieSlice, polarToCartesian } from '@/utils/chartCalculations.js'

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

const emit = defineEmits(['slice-click', 'legend-toggle'])

const optionsRef = toRef(props, 'options')
const dataRef = toRef(props, 'data')

const { config } = useChartConfig(optionsRef)
const { normalisedDatasets, labels, isValid, isEmpty } = useChartData(dataRef, optionsRef)

const disabledDatasets = ref(new Set())
const hoveredIndex = ref(null)
const tooltip = ref({
    visible: false,
    data: null,
    x: 0,
    y: 0
})

// Pie-specific configuration
const isDonut = computed(() => config.value.donut === true)
const donutThickness = computed(() => config.value.donutThickness || 0.6)
const borderWidth = computed(() => config.value.borderWidth || 2)
const explode = computed(() => config.value.explode || 0)
const explodedSlices = computed(() => config.value.explodedSlices || [])

// Label configuration
const showLabels = computed(() => config.value.showLabels !== false)
const labelPosition = computed(() => config.value.labelPosition || 'outer') // 'inner', 'outer', 'none'
const labelFormat = computed(() => config.value.labelFormat || 'percentage') // 'percentage', 'value', 'label', 'both'
const labelColor = computed(() => config.value.labelColor || '#374151')
const labelFontSize = computed(() => config.value.labelFontSize || 12)

// Center label (for donut)
const centerLabel = computed(() => config.value.centerLabel || null)
const centerLabelColor = computed(() => config.value.centerLabelColor || '#111827')
const centerLabelFontSize = computed(() => config.value.centerLabelFontSize || 24)
const centerLabelSubFontSize = computed(() => config.value.centerLabelSubFontSize || 14)

const isInteractive = computed(() => {
    return config.value.plugins?.tooltip?.enabled !== false
})

// Get first dataset (pie charts typically use one dataset)
const dataset = computed(() => normalisedDatasets.value[0] || { data: [] })

// Filter visible data points
const visibleData = computed(() => {
    return dataset.value.data.filter((_, index) => !disabledDatasets.value.has(index))
})

const visibleLabels = computed(() => {
    return labels.value.filter((_, index) => !disabledDatasets.value.has(index))
})

const visibleColors = computed(() => {
    const colors = Array.isArray(dataset.value.backgroundColor)
        ? dataset.value.backgroundColor
        : [dataset.value.backgroundColor]

    return colors.filter((_, index) => !disabledDatasets.value.has(index))
})

// Calculate center position
function centerX(chartArea) {
    return chartArea.x + chartArea.width / 2
}

function centerY(chartArea) {
    return chartArea.y + chartArea.height / 2
}

// Calculate radius based on chart area
function getRadius(chartArea) {
    const maxExplode = Math.max(explode.value, 0)
    const labelPadding = showLabels.value && labelPosition.value === 'outer' ? 40 : 10
    const totalPadding = maxExplode + labelPadding
    return Math.min(chartArea.width, chartArea.height) / 2 - totalPadding
}

// Calculate slices with positions for a given chart area
function calculateSlicesForArea(chartArea) {
    if (visibleData.value.length === 0) return []

    const slices = calculatePieSlices(visibleData.value)
    const radius = getRadius(chartArea)
    const innerRadius = isDonut.value ? radius * (1 - donutThickness.value) : 0

    return slices.map((slice, index) => {
        const midAngle = (slice.startAngle + slice.endAngle) / 2
        const isExploded = explodedSlices.value.includes(index) || explode.value > 0
        const explodeDistance = isExploded ? (explodedSlices.value.includes(index) ? 15 : explode.value) : 0

        // Calculate label positions
        const labelRadius = isDonut.value ? radius - (radius - innerRadius) / 2 : radius * 0.65
        const outerLabelRadius = radius + 20
        const lineStartRadius = radius + 5
        const lineEndRadius = radius + 15

        const labelPoint = polarToCartesian(0, 0, labelRadius, midAngle)
        const outerLabelPoint = polarToCartesian(0, 0, outerLabelRadius, midAngle)
        const lineStart = polarToCartesian(0, 0, lineStartRadius, midAngle)
        const lineEnd = polarToCartesian(0, 0, lineEndRadius, midAngle)

        return {
            ...slice,
            label: visibleLabels.value[index],
            color: visibleColors.value[index] || '#3b82f6',
            borderColor: config.value.borderColor || '#ffffff',
            path: isDonut.value
                ? createDonutPath(radius, innerRadius, slice.startAngle, slice.endAngle)
                : describePieSlice(0, 0, radius, slice.startAngle, slice.endAngle),
            explodeDistance,
            labelX: labelPosition.value === 'outer' ? outerLabelPoint.x : labelPoint.x,
            labelY: labelPosition.value === 'outer' ? outerLabelPoint.y : labelPoint.y,
            labelAlign: midAngle > 0 && midAngle < 180 ? 'start' : 'end',
            lineStartX: lineStart.x,
            lineStartY: lineStart.y,
            lineEndX: lineEnd.x,
            lineEndY: lineEnd.y
        }
    })
}

// Compute visible slices (used in template)
const visibleSlices = computed(() => {
    // Return function that will be called with chartArea in template
    return (chartArea) => calculateSlicesForArea(chartArea)
})

// Create donut path
function createDonutPath(outerRadius, innerRadius, startAngle, endAngle) {
    const outerStart = polarToCartesian(0, 0, outerRadius, endAngle)
    const outerEnd = polarToCartesian(0, 0, outerRadius, startAngle)
    const innerStart = polarToCartesian(0, 0, innerRadius, endAngle)
    const innerEnd = polarToCartesian(0, 0, innerRadius, startAngle)

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    return [
        'M', outerStart.x, outerStart.y,
        'A', outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
        'L', innerEnd.x, innerEnd.y,
        'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        'Z'
    ].join(' ')
}

// Get slice transform for exploded effect
function getSliceTransform(slice) {
    if (slice.explodeDistance === 0) return ''

    const midAngle = (slice.startAngle + slice.endAngle) / 2
    const offset = polarToCartesian(0, 0, slice.explodeDistance, midAngle)

    return `translate(${offset.x}, ${offset.y})`
}

// Format label based on configuration
function formatLabel(slice) {
    switch (labelFormat.value) {
        case 'percentage':
            return `${slice.percentage.toFixed(1)}%`
        case 'value':
            return slice.value.toString()
        case 'label':
            return slice.label
        case 'both':
            return `${slice.label}: ${slice.percentage.toFixed(1)}%`
        default:
            return `${slice.percentage.toFixed(1)}%`
    }
}

// Event handlers
function handleSliceHover(index, slice, event) {
    if (!isInteractive.value) return

    hoveredIndex.value = index

    tooltip.value = {
        visible: true,
        x: event.clientX + 10,
        y: event.clientY - 10,
        data: {
            title: slice.label,
            items: [{
                label: 'Value',
                value: slice.value,
                color: slice.color
            }, {
                label: 'Percentage',
                value: `${slice.percentage.toFixed(1)}%`,
                color: slice.color
            }]
        }
    }
}

function handleSliceLeave() {
    hoveredIndex.value = null
    tooltip.value.visible = false
}

function handleSliceClick(index, slice) {
    emit('slice-click', {
        label: slice.label,
        value: slice.value,
        percentage: slice.percentage,
        index
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

<style>
/* SVG-specific animations and transforms that can't be replicated with Tailwind */
.pie-slice {
    animation: sliceGrow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
    transform-origin: center;
}

@keyframes sliceGrow {
    from {
        transform: scale(0);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

.pie-slice-interactive-hover:hover,
.pie-slice-hovered {
    opacity: 0.9;
    filter: brightness(1.1) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    transform: scale(1.02);
}

.pie-slice-interactive-hover:active {
    transform: scale(0.98);
}
</style>
