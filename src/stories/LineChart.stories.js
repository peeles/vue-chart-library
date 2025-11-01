import { onMounted, ref } from 'vue'
import LineChart from '../components/charts/LineChart.vue'

/**
 * # LineChart Component
 *
 * A fully responsive and customisable line chart component for Vue 3 with optional area fills.
 * Perfect for showing trends, time series data, and continuous data visualization.
 *
 * ## Features
 * - **Smooth Lines**: Configurable tension for curved or straight lines
 * - **Area Fills**: Optional gradient-like fills beneath lines
 * - **Interactive Points**: Hover tooltips and click events
 * - **Multiple Lines**: Compare multiple datasets on the same chart
 * - **Customisable**: Full control over colours, line styles, and point appearance
 *
 * ## Installation
 * ```js
 * import { LineChart } from '@vue-charts/core'
 * import '@vue-charts/core/style.css'
 * ```
 *
 * ## Basic Usage
 * ```vue
 * <template>
 *   <line-chart :data="chartData" :options="chartOptions" />
 * </template>
 *
 * <script setup>
 * import { LineChart } from '@vue-charts/core'
 *
 * const chartData = {
 *   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
 *   datasets: [{
 *     label: 'Sales',
 *     data: [30, 45, 35, 55, 50, 65],
 *     borderColor: '#3b82f6',
 *     backgroundColor: '#3b82f6',
 *     fill: true,
 *     tension: 0.4
 *   }]
 * }
 * </script>
 * ```
 */
export default {
    title: 'Charts/LineChart',
    component: LineChart,
    parameters: {
        layout: 'padded'
    },
    argTypes: {
        data: {
            control: 'object',
            description: 'Chart data including labels and datasets'
        },
        options: {
            control: 'object',
            description: 'Chart configuration options'
        },
        onPointClick: {
            action: 'point-click',
            description: 'Event emitted when a data point is clicked'
        }
    }
}

/**
 * Default Story - Basic line chart with area fill
 */
export const Default = {
    render: (args) => ({
        components: { LineChart },
        setup() {
            return { args }
        },
        template: `
            <div style="width: 100%; height: 400px; padding: 20px; background: #f9fafb; border-radius: 8px;">
                <line-chart v-bind="args"/>
            </div>
        `
    }),
    args: {
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'Sales 2024',
                data: [30, 45, 35, 55, 50, 65],
                borderColor: '#3b82f6',
                backgroundColor: '#3b82f6',
                borderWidth: 3,
                fill: true,
                fillOpacity: 0.2,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }
}

/**
 * Multiple Lines - Compare multiple datasets
 */
export const MultipleLines = {
    render: (args) => ({
        components: { LineChart },
        setup() {
            return { args }
        },
        template: `
            <div style="width: 100%; height: 400px; padding: 20px;">
                <line-chart v-bind="args"/>
            </div>
        `
    }),
    args: {
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Revenue 2024',
                    data: [30, 45, 35, 55, 50, 65, 70, 68, 75, 80, 85, 90],
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f6',
                    borderWidth: 2,
                    fill: true,
                    fillOpacity: 0.1,
                    tension: 0.4
                },
                {
                    label: 'Revenue 2023',
                    data: [25, 35, 30, 45, 42, 52, 58, 55, 60, 65, 68, 72],
                    borderColor: '#8b5cf6',
                    backgroundColor: '#8b5cf6',
                    borderWidth: 2,
                    fill: true,
                    fillOpacity: 0.1,
                    tension: 0.4
                },
                {
                    label: 'Revenue 2022',
                    data: [20, 28, 25, 38, 35, 45, 48, 46, 50, 55, 58, 62],
                    borderColor: '#10b981',
                    backgroundColor: '#10b981',
                    borderWidth: 2,
                    fill: true,
                    fillOpacity: 0.1,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    }
}

/**
 * Straight Lines - No smoothing
 */
export const StraightLines = {
    render: (args) => ({
        components: { LineChart },
        setup() {
            return { args }
        },
        template: `
            <div style="width: 100%; height: 400px; padding: 20px;">
                <line-chart v-bind="args"/>
            </div>
        `
    }),
    args: {
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [{
                label: 'Website Traffic',
                data: [1200, 1900, 1500, 2200, 1800],
                borderColor: '#ef4444',
                backgroundColor: '#ef4444',
                borderWidth: 2,
                fill: false,
                tension: 0,
                smooth: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    }
}

/**
 * With Area Fills - Multiple filled areas
 */
export const WithAreaFills = {
    render: (args) => ({
        components: { LineChart },
        setup() {
            return { args }
        },
        template: `
            <div style="width: 100%; height: 400px; padding: 20px;">
                <line-chart v-bind="args"/>
            </div>
        `
    }),
    args: {
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Page Views',
                    data: [450, 520, 480, 610, 580, 720, 650],
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f6',
                    borderWidth: 3,
                    fill: true,
                    fillOpacity: 0.3,
                    tension: 0.4
                },
                {
                    label: 'Unique Visitors',
                    data: [320, 380, 350, 450, 420, 520, 480],
                    borderColor: '#8b5cf6',
                    backgroundColor: '#8b5cf6',
                    borderWidth: 3,
                    fill: true,
                    fillOpacity: 0.3,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    }
}

/**
 * Dashed Lines - Using borderDash
 */
export const DashedLines = {
    render: (args) => ({
        components: { LineChart },
        setup() {
            return { args }
        },
        template: `
            <div style="width: 100%; height: 400px; padding: 20px;">
                <line-chart v-bind="args"/>
            </div>
        `
    }),
    args: {
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'Actual',
                    data: [40, 55, 48, 72],
                    borderColor: '#10b981',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Projected',
                    data: [40, 50, 60, 70],
                    borderColor: '#6b7280',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    }
}

/**
 * No Points - Hide data points
 */
export const NoPoints = {
    render: (args) => ({
        components: { LineChart },
        setup() {
            return { args }
        },
        template: `
            <div style="width: 100%; height: 400px; padding: 20px;">
                <line-chart v-bind="args"/>
            </div>
        `
    }),
    args: {
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Temperature (°C)',
                data: [5, 7, 12, 18, 22, 25, 27, 26, 22, 16, 10, 6],
                borderColor: '#f59e0b',
                backgroundColor: '#f59e0b',
                borderWidth: 2,
                fill: true,
                fillOpacity: 0.2,
                tension: 0.4,
                showPoints: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    }
}

/**
 * No Grid Lines - Clean minimal look
 */
export const NoGridLines = {
    render: (args) => ({
        components: { LineChart },
        setup() {
            return { args }
        },
        template: `
            <div style="width: 100%; height: 400px; padding: 20px;">
                <line-chart v-bind="args"/>
            </div>
        `
    }),
    args: {
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Growth',
                data: [10, 15, 13, 18, 22, 25],
                borderColor: '#10b981',
                backgroundColor: '#10b981',
                borderWidth: 3,
                fill: true,
                fillOpacity: 0.2,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                }
            }
        }
    }
}

/**
 * Interactive - Click events and dynamic data
 */
export const Interactive = {
    render: (args) => ({
        components: { LineChart },
        setup() {
            const chartData = ref({
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [{
                    label: 'Daily Sales',
                    data: [45, 52, 48, 65, 58],
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f6',
                    borderWidth: 3,
                    fill: true,
                    fillOpacity: 0.2,
                    tension: 0.4
                }]
            })

            const events = ref([])

            const handlePointClick = (data) => {
                events.value.unshift({
                    label: data.label,
                    value: data.value,
                    dataset: data.datasetIndex
                })
                if (events.value.length > 5) events.value.pop()
            }

            const randomiseData = () => {
                chartData.value = {
                    ...chartData.value,
                    datasets: chartData.value.datasets.map(dataset => ({
                        ...dataset,
                        data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 80) + 20)
                    }))
                }
            }

            return { chartData, events, handlePointClick, randomiseData, args }
        },
        template: `
            <div style="width: 100%;">
                <div style="margin-bottom: 16px;">
                    <button
                        @click="randomiseData"
                        style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;"
                    >
                        Randomise Data
                    </button>
                </div>
                <div style="width: 100%; height: 400px; margin-bottom: 16px;">
                    <line-chart
                        :data="chartData"
                        :options="args.options"
                        @point-click="handlePointClick"
                    />
                </div>
                <div v-if="events.length > 0"
                     style="padding: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #111827;">Recent
                        Events</h4>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div
                            v-for="(event, index) in events"
                            :key="index"
                            style="padding: 8px 12px; background: white; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 13px; font-family: monospace;"
                        >
                            Clicked: <strong>{{ event.label }}</strong> - Value: <strong>{{ event.value }}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `
    }),
    args: {
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    }
}

/**
 * Stock Chart - Time series with many data points
 */
export const StockChart = {
    render: (args) => ({
        components: { LineChart },
        setup() {
            return { args }
        },
        template: `
            <div style="width: 100%; height: 400px; padding: 20px;">
                <line-chart v-bind="args"/>
            </div>
        `
    }),
    args: {
        data: {
            labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
            datasets: [{
                label: 'Stock Price',
                data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 100),
                borderColor: '#3b82f6',
                backgroundColor: '#3b82f6',
                borderWidth: 2,
                fill: true,
                fillOpacity: 0.1,
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        display: false
                    }
                }
            }
        }
    }
}

/**
 * With Loading Spinner
 */
export const WithLoadingSpinner = {
    render: (args) => ({
        components: { LineChart },
        setup() {
            const chartData = ref(null)
            const isLoading = ref(true)

            const loadData = () => {
                isLoading.value = true
                chartData.value = null

                setTimeout(() => {
                    chartData.value = {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Performance',
                            data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 80) + 20),
                            borderColor: '#3b82f6',
                            backgroundColor: '#3b82f6',
                            borderWidth: 3,
                            fill: true,
                            fillOpacity: 0.2,
                            tension: 0.4
                        }]
                    }
                    setTimeout(() => {
                        isLoading.value = false
                    }, 300)
                }, 1500)
            }

            onMounted(() => {
                loadData()
            })

            return { chartData, isLoading, loadData, args }
        },
        template: `
            <div style="width: 100%;">
                <div style="margin-bottom: 16px;">
                    <button
                        @click="loadData"
                        style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;"
                    >
                        Reload Data
                    </button>
                </div>
                <div style="width: 100%; height: 400px; background: #f9fafb; border-radius: 8px; padding: 20px;">
                    <line-chart
                        v-if="chartData"
                        :data="chartData"
                        :options="args.options"
                        :show-loading="isLoading"
                        loading-message="Loading line chart..."
                        :loading-delay="0"
                    />
                    <div
                        v-else
                        style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6b7280;"
                    >
                        Click "Reload Data" to load chart
                    </div>
                </div>
            </div>
        `
    }),
    args: {
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    }
}
