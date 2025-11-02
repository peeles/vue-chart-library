import AreaChart from '../components/charts/AreaChart.vue'

export default {
    title: 'Charts/AreaChart',
    component: AreaChart,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `An advanced area chart component with range selector and flush x-axis labels.
Perfect for time series data visualization with interactive zoom and pan capabilities.

## Features
- **Range Selector**: Interactive slider to zoom into specific date ranges
- **Flush Labels**: X-axis labels aligned at edges for time series data
- **Smooth Animations**: Chart.js-style grow-from-zero animations
- **Multiple Series**: Compare multiple datasets with area fills

## Installation
\`\`\`js
import { AreaChart } from '@vue-charts/core'
import '@vue-charts/core/style.css'
\`\`\`
`
            }
        }
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
        showRangeSelector: {
            control: 'boolean',
            description: 'Show or hide the range selector'
        }
    }
}

export const Default = {
    render: (args) => ({
        components: { AreaChart },
        setup() {
            return { args }
        },
        template: `
            <div style="width: 100%; height: 500px; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <area-chart v-bind="args" />
            </div>
        `
    }),
    args: {
        data: {
            labels: [
                '12 Nov', '14 Nov', '16 Nov', '18 Nov', '20 Nov',
                '22 Nov', '24 Nov', '26 Nov', '28 Nov', '30 Nov',
                '02 Dec', '04 Dec', '06 Dec', '08 Dec', '10 Dec'
            ],
            datasets: [
                {
                    label: 'Total Views',
                    data: [15, 28, 38, 32, 41, 35, 48, 42, 36, 45, 40, 50, 45, 52, 48],
                    borderColor: '#10b981',
                    backgroundColor: '#10b981',
                    borderWidth: 3,
                    fill: true,
                    fillOpacity: 0.3,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Unique Views',
                    data: [8, 18, 25, 20, 28, 22, 32, 28, 24, 30, 26, 35, 30, 38, 33],
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f6',
                    borderWidth: 3,
                    fill: true,
                    fillOpacity: 0.3,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    flush: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        },
        showRangeSelector: true
    },
    parameters: {
        docs: {
            description: {
                story: 'Default ApexCharts-style area chart with range selector for interactive exploration.'
            }
        }
    }
}

export const WithoutRangeSelector = {
    render: (args) => ({
        components: { AreaChart },
        setup() {
            return { args }
        },
        template: `
            <div style="width: 100%; height: 400px; padding: 20px;">
                <area-chart v-bind="args" />
            </div>
        `
    }),
    args: {
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue',
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
                    display: false
                }
            },
            scales: {
                x: {
                    flush: true
                }
            }
        },
        showRangeSelector: false
    },
    parameters: {
        docs: {
            description: {
                story: 'Area chart without the range selector, ideal for static datasets.'
            }
        }
    }
}
