<template>
    <div class="relative flex flex-col gap-4 w-full">
        <line-chart
            :data="visibleData"
            :height="height"
            :options="chartOptions"
            :width="width"
            aria-label="Area Chart with Range Selector"
            @legend-toggle="$emit('legend-toggle', $event)"
            @point-click="$emit('point-click', $event)"
        >
            <template
                v-if="showRangeSelector"
                #additional_controls
            >
                <div
                    id="range-selector"
                    role="group"
                    aria-label="Data range selector"
                    class="relative w-full h-[60px] bg-gray-50 rounded-lg py-2.5 mt-3"
                >
                    <button
                        @click="resetRange"
                        class="absolute left-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-1 transition-colors duration-150 z-10"
                        aria-label="Reset range to full view"
                        title="Reset to full range"
                    >
                        <FontAwesomeIcon :icon="'fa-refresh'" class="w-3 h-3" />
                    </button>

                    <div
                        id="range-overlay"
                        data-range-selector
                        class="absolute top-0 bottom-0 pointer-events-none"
                        :style="{ left: `${chartPadding.left}px`, right: '0' }"
                    >
                        <div
                            data-range-overlay
                            class="absolute top-0 h-full bg-stone-500/10 border-l-2 border-r-2 border-stone-500 pointer-events-auto"
                            :style="rangeWindowStyle"
                        >
                            <div
                                class="range-handle absolute top-1/2 -translate-y-1/2 w-3 h-10 bg-stone-500 rounded-md cursor-ew-resize shadow-md transition-all duration-200 ease-linear hover:bg-stone-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-stone-600 focus:ring-offset-2 -left-1.5"
                                role="slider"
                                tabindex="0"
                                aria-label="Start of range"
                                :aria-valuenow="Math.round(rangeStart)"
                                :aria-valuetext="`${visibleData.labels[visibleDataRange.startIndex] || 'Start'}`"
                                aria-valuemin="0"
                                :aria-valuemax="Math.round(rangeEnd - 5)"
                                @mousedown="startDrag('start', $event)"
                                @touchstart="startDrag('start', $event)"
                                @keydown="handleKeydown($event, 'start')"
                            ></div>
                            <div
                                class="range-handle absolute top-1/2 -translate-y-1/2 w-3 h-10 bg-stone-500 rounded-md cursor-ew-resize shadow-md transition-all duration-200 ease-linear hover:bg-stone-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-stone-600 focus:ring-offset-2 -right-1.5"
                                role="slider"
                                tabindex="0"
                                aria-label="End of range"
                                :aria-valuenow="Math.round(rangeEnd)"
                                :aria-valuetext="`${visibleData.labels[visibleDataRange.endIndex - 1] || 'End'}`"
                                :aria-valuemin="Math.round(rangeStart + 5)"
                                aria-valuemax="100"
                                @mousedown="startDrag('end', $event)"
                                @touchstart="startDrag('end', $event)"
                                @keydown="handleKeydown($event, 'end')"
                            ></div>
                        </div>
                    </div>
                </div>
            </template>
        </line-chart>
    </div>
</template>

<script setup>
import { computed, toRef } from 'vue'
import LineChart from './LineChart.vue'
import { useChartConfig } from '@/composables/useChartConfig.js'
import { useRangeSelector } from '@/composables/useRangeSelector.js'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

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
    },
    /**
     * Show range selector
     */
    showRangeSelector: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['point-click', 'legend-toggle', 'range-change'])

const optionsRef = toRef(props, 'options')
const { config, padding: chartPadding } = useChartConfig(optionsRef)

// Range selector with drag, touch, and keyboard support
const {
    rangeStart,
    rangeEnd,
    rangeWindowStyle,
    startDrag,
    handleKeydown,
    resetRange
} = useRangeSelector({
    initialStart: 0,
    initialEnd: 100,
    minWidth: 5,
    onChange: (range) => {
        emit('range-change', {
            start: range.start,
            end: range.end,
            startIndex: visibleDataRange.value.startIndex,
            endIndex: visibleDataRange.value.endIndex
        })
    }
})

// Calculate visible data range
const visibleDataRange = computed(() => {
    const labels = props.data.labels || []
    const totalPoints = labels.length

    const startIndex = Math.floor((rangeStart.value / 100) * totalPoints)
    const endIndex = Math.ceil((rangeEnd.value / 100) * totalPoints)

    return { startIndex, endIndex }
})

// Filter data based on range
const visibleData = computed(() => {
    const { startIndex, endIndex } = visibleDataRange.value

    return {
        labels: props.data.labels.slice(startIndex, endIndex),
        datasets: props.data.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.slice(startIndex, endIndex)
        }))
    }
})

// Chart options with flush x-axis labels
const chartOptions = computed(() => {
    return {
        ...config.value,
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 3,
        padding: {
            ...config.value.padding,
            right: 0
        },
        scales: {
            ...config.value.scales,
            x: {
                ...config.value.scales?.x,
                type: 'category',
                position: 'bottom',
                flush: true
            }
        }
    }
})

</script>

<style>
/* Pseudo-elements for range handle grip indicators */
.range-handle::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 16px;
    background: white;
    border-radius: 1px;
}

.range-handle::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 16px;
    background: white;
    border-radius: 1px;
    margin-left: 4px;
}
</style>
