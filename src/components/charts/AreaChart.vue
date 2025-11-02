<template>
    <div class="relative flex flex-col gap-4 w-full">
        <LineChart
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
                    class="relative w-full h-[60px] bg-gray-50 rounded-lg py-2.5 mt-3"
                >
                    <div
                        id="range-overlay"
                        class="absolute top-0 bottom-0 pointer-events-none"
                        :style="{ left: `${chartPadding.left}px`, right: '0' }"
                    >
                        <div
                            class="absolute top-0 h-full bg-blue-500/10 border-l-2 border-r-2 border-blue-500 pointer-events-auto"
                            :style="rangeWindowStyle"
                        >
                            <div
                                class="range-handle absolute top-1/2 -translate-y-1/2 w-3 h-10 bg-blue-500 rounded-md cursor-ew-resize shadow-md transition-all duration-200 ease-linear hover:bg-blue-600 hover:shadow-lg -left-1.5"
                                @mousedown="startDrag('start', $event)"
                            ></div>
                            <div
                                class="range-handle absolute top-1/2 -translate-y-1/2 w-3 h-10 bg-blue-500 rounded-md cursor-ew-resize shadow-md transition-all duration-200 ease-linear hover:bg-blue-600 hover:shadow-lg -right-1.5"
                                @mousedown="startDrag('end', $event)"
                            ></div>
                        </div>
                    </div>
                </div>
            </template>
        </LineChart>
    </div>
</template>

<script setup>
import {computed, ref, toRef} from 'vue'
import LineChart from './LineChart.vue'
import {useChartConfig} from '@/composables/useChartConfig.js'

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

// Range selector state
const rangeStart = ref(0)
const rangeEnd = ref(100)
const isDragging = ref(false)
const dragType = ref(null)
const dragStartX = ref(0)
const dragStartValue = ref(0)

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
                flush: true,
            }
        }
    }
})

// Range window styling
const rangeWindowStyle = computed(() => {
    return {
        left: `${rangeStart.value}%`,
        width: `${rangeEnd.value - rangeStart.value}%`
    }
})

// Drag handlers
function startDrag(type, event) {
    isDragging.value = true
    dragType.value = type
    dragStartX.value = event.clientX
    dragStartValue.value = type === 'start' ? rangeStart.value : rangeEnd.value

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', stopDrag)

    event.preventDefault()
}

function handleDrag(event) {
    if (!isDragging.value) return

    const container = event.target.closest('#range-overlay') || event.target.closest('#range-selector')
    if (!container) return

    const rect = container.getBoundingClientRect()
    const deltaX = event.clientX - dragStartX.value
    const deltaPercent = (deltaX / rect.width) * 100

    if (dragType.value === 'start') {
        rangeStart.value = Math.max(0, Math.min(rangeEnd.value - 5, dragStartValue.value + deltaPercent))
    } else if (dragType.value === 'end') {
        rangeEnd.value = Math.min(100, Math.max(rangeStart.value + 5, dragStartValue.value + deltaPercent))
    }

    emit('range-change', {
        start: rangeStart.value,
        end: rangeEnd.value,
        startIndex: visibleDataRange.value.startIndex,
        endIndex: visibleDataRange.value.endIndex
    })
}

function stopDrag() {
    isDragging.value = false
    dragType.value = null

    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
}
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
