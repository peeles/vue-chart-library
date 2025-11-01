<template>
    <div class="area-chart-container">
        <line-chart
            :data="visibleData"
            :height="height"
            :options="chartOptions"
            :width="width"
            aria-label="Area Chart with Range Selector"
            @legend-toggle="$emit('legend-toggle', $event)"
            @point-click="$emit('point-click', $event)"
        />

        <!-- Range Selector -->
        <div v-if="showRangeSelector" class="range-selector-wrapper">
            <div class="range-selector" :style="{ paddingLeft: `${chartPadding.left}px`, paddingRight: `${chartPadding.right}px` }">
                <div class="range-overlay">
                    <div
                        class="range-window"
                        :style="rangeWindowStyle"
                    >
                        <div
                            class="range-handle range-handle-start"
                            @mousedown="startDrag('start', $event)"
                        ></div>
                        <div
                            class="range-handle range-handle-end"
                            @mousedown="startDrag('end', $event)"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, toRef } from 'vue'
import LineChart from './LineChart.vue'
import { useChartConfig } from '@/composables/useChartConfig.js'

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

// Mini chart data (full dataset with simplified styling)
const miniData = computed(() => {
    return {
        labels: props.data.labels,
        datasets: props.data.datasets.map(dataset => ({
            ...dataset,
            borderWidth: 1,
            fill: true,
            fillOpacity: 0.2,
            showPoints: false,
            pointRadius: 0
        }))
    }
})

// Chart options with flush x-axis labels
const chartOptions = computed(() => {
    return {
        ...config.value,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            ...config.value.scales,
            x: {
                ...config.value.scales?.x,
                type: 'category',
                position: 'bottom',
                flush: true // Custom flag for flush labels
            }
        }
    }
})

// Mini chart options
const miniChartOptions = computed(() => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false
            }
        },
        interaction: {
            mode: 'none'
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

    const container = event.target.closest('.range-overlay') || event.target.closest('.range-selector')
    if (!container) return

    const rect = container.getBoundingClientRect()
    const deltaX = event.clientX - dragStartX.value
    const deltaPercent = (deltaX / rect.width) * 100

    if (dragType.value === 'start') {
        const newStart = Math.max(0, Math.min(rangeEnd.value - 5, dragStartValue.value + deltaPercent))
        rangeStart.value = newStart
    } else if (dragType.value === 'end') {
        const newEnd = Math.min(100, Math.max(rangeStart.value + 5, dragStartValue.value + deltaPercent))
        rangeEnd.value = newEnd
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

<style scoped>
.area-chart-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    height: 100%;
}

.range-selector-wrapper {
    width: 100%;
    background: #f9fafb;
    border-radius: 8px;
    padding: 10px 0;
}

.range-selector {
    position: relative;
    width: 100%;
    height: 60px;
}

.mini-chart {
    width: 100%;
    height: 60px;
    opacity: 0.6;
}

.range-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.range-window {
    position: absolute;
    top: 0;
    height: 100%;
    background: rgba(59, 130, 246, 0.1);
    border-left: 2px solid #3b82f6;
    border-right: 2px solid #3b82f6;
    pointer-events: all;
}

.range-handle {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 40px;
    background: #3b82f6;
    border-radius: 6px;
    cursor: ew-resize;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: background 0.2s ease;
}

.range-handle:hover {
    background: #2563eb;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.range-handle-start {
    left: -6px;
}

.range-handle-end {
    right: -6px;
}

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

.range-handle-start::after,
.range-handle-end::after {
    margin-left: -4px;
}
</style>
