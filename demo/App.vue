<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-6 py-6">
                <h1 class="text-2xl font-semibold text-gray-900">
                    Vue Charts Library
                </h1>
                <p class="text-sm text-gray-600 mt-1">
                    Professional chart components for Vue 3
                </p>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-6 py-8">
            <!-- Controls -->
            <div class="bg-white rounded-lg border border-gray-200 p-3 mb-6">
                <div class="flex flex-wrap gap-4 items-center">
                    <label class="flex items-center gap-2">
                        <input
                            v-model="showLegend"
                            class="w-4 h-4 text-blue-600 rounded border-gray-300"
                            type="checkbox"
                        >
                        <span class="text-sm text-gray-700">Show Legend</span>
                    </label>

                    <label class="flex items-center gap-2">
                        <input
                            v-model="showGrid"
                            class="w-4 h-4 text-blue-600 rounded border-gray-300"
                            type="checkbox"
                        >
                        <span class="text-sm text-gray-700">Show Grid</span>
                    </label>

                    <button
                        class="ml-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        @click="randomizeData"
                    >
                        Randomize Data
                    </button>
                </div>
            </div>

            <!-- Bar Chart -->
            <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div class="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900">Sales Comparison</h2>
                        <p class="text-sm text-gray-600">Monthly sales data for 2023 vs 2024</p>
                    </div>
                    <div v-if="showLegend" class="flex-shrink-0">
                        <div class="flex gap-4">
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded bg-blue-600"></span>
                                <span class="text-sm text-gray-700">Sales 2024</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded bg-purple-600"></span>
                                <span class="text-sm text-gray-700">Sales 2023</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="h-96">
                    <bar-chart
                        :data="barChartData"
                        :options="updatedChartOptions"
                        @bar-click="handleBarClick"
                    />
                </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="text-sm text-gray-600">Total 2024</div>
                    <div class="text-2xl font-semibold text-gray-900 mt-1">{{ totalSales2024 }}</div>
                </div>
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="text-sm text-gray-600">Total 2023</div>
                    <div class="text-2xl font-semibold text-gray-900 mt-1">{{ totalSales2023 }}</div>
                </div>
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="text-sm text-gray-600">Growth</div>
                    <div class="text-2xl font-semibold text-green-600 mt-1">+{{ growthPercentage }}%</div>
                </div>
            </div>

            <!-- Event Log -->
            <div v-if="events.length > 0" class="bg-white rounded-lg border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-gray-900">Event Log</h3>
                    <button
                        class="text-xs text-gray-600 hover:text-gray-900"
                        @click="events = []"
                    >
                        Clear
                    </button>
                </div>
                <div class="p-6">
                    <div class="space-y-2">
                        <div
                            v-for="(event, index) in events.slice(0, 5)"
                            :key="index"
                            class="text-sm p-3 bg-gray-50 rounded border border-gray-200"
                        >
                            <div class="font-medium text-gray-900">{{ event.type }}</div>
                            <div class="text-gray-600 font-mono text-xs mt-1">{{ formatEventData(event.data) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { BarChart } from '../src/index.js'

const showLegend = ref(true)
const showGrid = ref(true)

const barChartData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Sales 2024',
            data: [12, 19, 3, 5, 2, 8, 9, 14, 11, 6, 10, 15],
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb',
            borderWidth: 2
        },
        {
            label: 'Sales 2023',
            data: [7, 11, 5, 8, 3, 7],
            backgroundColor: '#8b5cf6',
            borderColor: '#7c3aed',
            borderWidth: 2
        }
    ]
})

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: showLegend.value,
            position: 'top'
        },
        tooltip: {
            enabled: true
        }
    },
    scales: {
        x: {
            grid: {
                display: showGrid.value
            }
        },
        y: {
            grid: {
                display: showGrid.value
            },
            beginAtZero: true
        }
    }
}))

const updatedChartOptions = computed(() => ({
    ...chartOptions.value,
    plugins: {
        ...chartOptions.value.plugins,
        legend: {
            display: false // Hide internal legend, using custom one in header
        }
    }
}))

const events = ref([])

const totalSales2024 = computed(() => {
    return barChartData.value.datasets[0].data.reduce((a, b) => a + b, 0)
})

const totalSales2023 = computed(() => {
    return barChartData.value.datasets[1].data.reduce((a, b) => a + b, 0)
})

const growthPercentage = computed(() => {
    const growth = ((totalSales2024.value - totalSales2023.value) / totalSales2023.value) * 100
    return growth.toFixed(1)
})

function handleBarClick(data) {
    events.value.unshift({
        type: 'bar-click',
        data,
        timestamp: Date.now()
    })
}

function randomizeData() {
    barChartData.value = {
        ...barChartData.value,
        datasets: barChartData.value.datasets.map(dataset => ({
            ...dataset,
            data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1)
        }))
    }
}

function formatEventData(data) {
    return `Label: ${data.label}, Dataset: ${data.datasetIndex}, Value: ${data.value}`
}
</script>
