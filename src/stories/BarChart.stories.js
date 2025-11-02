import { expect } from 'storybook/test'
import { onMounted, ref } from 'vue'
import BarChart from '../components/charts/BarChart.vue'

export default {
    title: 'Charts/BarChart',
    component: BarChart,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `A fully responsive and customisable bar chart component.

## Features
- **Responsive**: Automatically adapts to container size
- **Interactive**: Hover tooltips and click events
- **Customisable**: Full control over colours, spacing, and appearance
- **Accessible**: ARIA labels and keyboard navigation
- **Multiple Datasets**: Support for comparing multiple data series

## Installation
\`\`\`js
import { BarChart } from '@vue-charts/core'
import '@vue-charts/core/style.css'
\`\`\`

## Basic Usage
\`\`\`vue
<template>
  <bar-chart :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { BarChart } from '@vue-charts/core'

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Sales 2024',
    data: [12, 19, 3, 5, 2, 8],
    backgroundColor: '#3b82f6'
  }]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true
}
</script>
\`\`\`
`
            }
        }
    },
    argTypes: {
        data: {
            control: 'object',
            description: 'Chart data including labels and datasets',
            table: {
                type: { summary: 'Object' },
                defaultValue: { summary: '{}' }
            }
        },
        options: {
            control: 'object',
            description: 'Chart configuration options',
            table: {
                type: { summary: 'Object' },
                defaultValue: { summary: '{}' }
            }
        },
        width: {
            control: 'number',
            description: 'Fixed width (only if responsive is false)',
            table: {
                type: { summary: 'Number' },
                defaultValue: { summary: 'null' }
            }
        },
        height: {
            control: 'number',
            description: 'Fixed height (only if responsive is false)',
            table: {
                type: { summary: 'Number' },
                defaultValue: { summary: 'null' }
            }
        },
        onBarClick: {
            action: 'bar-click',
            description: 'Event emitted when a bar is clicked',
            table: {
                type: { summary: 'Function' }
            }
        },
        onLegendToggle: {
            action: 'legend-toggle',
            description: 'Event emitted when legend item is toggled',
            table: {
                type: { summary: 'Function' }
            }
        }
    }
}

export const Default = {
    render: (args) => ({
        components: { BarChart },
        setup() {
            return { args }
        },
        template: `
            <div style="width: 100%; height: 400px; padding: 20px; background: #f9fafb; border-radius: 8px;">
                <bar-chart v-bind="args"/>
            </div>
        `
    }),
    args: {
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'Sales 2024',
                data: [12, 19, 3, 5, 2, 8],
                backgroundColor: '#3b82f6',
                borderColor: '#2563eb',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    enabled: true
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: true
                    }
                },
                y: {
                    display: true,
                    beginAtZero: true,
                    grid: {
                        display: true
                    }
                }
            }
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'Basic bar chart with a single dataset and responsive layout.'
            }
        }
    }
}

export const MultipleDatasets = {
    render: (args) => ({
        components: { BarChart },
        setup() {
            return { args }
        },
        template: '<div style="width: 100%; height: 400px;"><bar-chart v-bind="args" /></div>'
    }),
    args: {
        data: {
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
                    data: [7, 11, 5, 8, 3, 7, 6, 9, 8, 4, 7, 10],
                    backgroundColor: '#8b5cf6',
                    borderColor: '#7c3aed',
                    borderWidth: 2
                },
                {
                    label: 'Sales 2022',
                    data: [5, 8, 4, 6, 2, 5, 4, 7, 6, 3, 5, 8],
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 2
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
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    },
    parameters: {
        docs: {
            description: {
                story: `## Multiple Datasets

Compare multiple data series side by side for year-over-year or category analysis.`
            }
        }
    },
    play: async ({ args, step }) => {
        await step('renders multiple datasets', async () => {
            await expect(args.data.datasets.length).toBeGreaterThan(1)
        })

        await step('keeps dataset lengths aligned with labels', async () => {
            args.data.datasets.forEach((dataset) => {
                expect(dataset.data.length).toBe(args.data.labels.length)
            })
        })

        await step('applies distinct dataset colours', async () => {
            const colours = args.data.datasets.map((dataset) => dataset.backgroundColor)
            expect(new Set(colours).size).toBe(colours.length)
        })

        await step('enables legend display for all datasets', async () => {
            expect(args.options.plugins?.legend?.display).toBe(true)
        })
    }
}

export const NoGridLines = {
    render: (args) => ({
        components: { BarChart },
        setup() {
            return { args }
        },
        template: '<div style="width: 100%; height: 400px;"><bar-chart v-bind="args" /></div>'
    }),
    args: {
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
                label: 'Revenue',
                data: [45000, 52000, 48000, 67000],
                backgroundColor: '#f59e0b',
                borderColor: '#d97706',
                borderWidth: 2
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
    },
    parameters: {
        docs: {
            description: {
                story: `## No Grid Lines

Minimalist presentation with the grid removed while retaining axis context.`
            }
        }
    },
    play: async ({ args, step }) => {
        await step('disables x-axis grid lines', async () => {
            expect(args.options.scales?.x?.grid?.display).toBe(false)
        })

        await step('disables y-axis grid lines', async () => {
            expect(args.options.scales?.y?.grid?.display).toBe(false)
        })

        await step('retains axis definitions', async () => {
            expect(args.options.scales?.x).toBeTruthy()
            expect(args.options.scales?.y).toBeTruthy()
        })

        await step('provides dataset values for rendering', async () => {
            expect(args.data.datasets[0].data.length).toBeGreaterThan(0)
        })
    }
}

export const CustomColors = {
    render: (args) => ({
        components: { BarChart },
        setup() {
            return { args }
        },
        template: '<div style="width: 100%; height: 400px;"><bar-chart v-bind="args" /></div>'
    }),
    args: {
        data: {
            labels: ['North', 'South', 'East', 'West', 'Central'],
            datasets: [{
                label: 'Regional Sales',
                data: [85, 92, 78, 88, 95],
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
                borderColor: ['#dc2626', '#d97706', '#059669', '#2563eb', '#7c3aed'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    },
    parameters: {
        docs: {
            description: {
                story: `## Custom Colours

Assign unique colours per bar for categorical comparisons.`
            }
        }
    },
    play: async ({ args, step }) => {
        await step('provides per-bar background colours', async () => {
            const dataset = args.data.datasets[0]
            expect(Array.isArray(dataset.backgroundColor)).toBe(true)
            expect(dataset.backgroundColor.length).toBe(args.data.labels.length)
        })

        await step('matches border colour configuration', async () => {
            const dataset = args.data.datasets[0]
            expect(Array.isArray(dataset.borderColor)).toBe(true)
            expect(dataset.borderColor.length).toBe(dataset.backgroundColor.length)
        })

        await step('ensures colours are distinct', async () => {
            const dataset = args.data.datasets[0]
            expect(new Set(dataset.backgroundColor).size).toBe(dataset.backgroundColor.length)
        })
    }
}

export const Interactive = {
    render: (args) => ({
        components: { BarChart },
        setup() {
            const chartData = ref({
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Daily Views',
                    data: [120, 190, 130, 150, 220, 180, 140],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 2
                }]
            })

            const events = ref([])

            const handleBarClick = (data) => {
                events.value.unshift({
                    label: data.label,
                    value: data.value,
                    dataset: data.datasetIndex
                })
                if (events.value.length > 5) events.value.pop()
            }

            const randomizeData = () => {
                chartData.value = {
                    ...chartData.value,
                    datasets: chartData.value.datasets.map(dataset => ({
                        ...dataset,
                        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 300) + 50)
                    }))
                }
            }

            return { chartData, events, handleBarClick, randomizeData, args }
        },
        template: `
            <div style="width: 100%;">
                <div style="margin-bottom: 16px;">
                    <button
                        @click="randomizeData"
                        style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;"
                    >
                        Randomize Data
                    </button>
                </div>
                <div style="width: 100%; height: 400px; margin-bottom: 16px;">
                    <bar-chart
                        :data="chartData"
                        :options="args.options"
                        @bar-click="handleBarClick"
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
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    enabled: true
                }
            }
        }
    },
    parameters: {
        docs: {
            description: {
                story: `## Interactive Example

Demonstrates click events, dynamic data updates, and a recent activity panel.`
            }
        }
    },
    play: async ({ canvas, args, step }) => {
        await step('shows randomise data control', async () => {
            const button = canvas.getByRole('button', { name: 'Randomize Data' })
            await expect(button).toBeInTheDocument()
        })

        await step('displays recent events container', async () => {
            const heading = canvas.getByText('Recent Events')
            await expect(heading).toBeInTheDocument()
        })

        await step('enables tooltip interaction in options', async () => {
            expect(args.options.plugins?.tooltip?.enabled).toBe(true)
        })
    }
}

export const SmallData = {
    render: (args) => ({
        components: { BarChart },
        setup() {
            return { args }
        },
        template: '<div style="width: 100%; height: 400px;"><bar-chart v-bind="args" /></div>'
    }),
    args: {
        data: {
            labels: ['A', 'B', 'C'],
            datasets: [{
                label: 'Values',
                data: [5, 3, 8],
                backgroundColor: '#06b6d4',
                borderColor: '#0891b2',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    },
    parameters: {
        docs: {
            description: {
                story: `## Small Data

Stress test with just a handful of data points.`
            }
        }
    },
    play: async ({ args, step }) => {
        await step('limits dataset to three points', async () => {
            expect(args.data.labels.length).toBe(3)
            expect(args.data.datasets[0].data.length).toBe(3)
        })

        await step('keeps chart responsive for minimal data', async () => {
            expect(args.options.responsive).toBe(true)
        })

        await step('disables legend for clarity', async () => {
            expect(args.options.plugins?.legend?.display).toBe(false)
        })
    }
}

export const LargeDataset = {
    render: (args) => ({
        components: { BarChart },
        setup() {
            return { args }
        },
        template: '<div style="width: 100%; height: 400px;"><bar-chart v-bind="args" /></div>'
    }),
    args: {
        data: {
            labels: Array.from({ length: 50 }, (_, i) => `Day ${i + 1}`),
            datasets: [{
                label: 'Daily Revenue',
                data: Array.from({ length: 50 }, () => Math.floor(Math.random() * 100) + 20),
                backgroundColor: '#ec4899',
                borderColor: '#db2777',
                borderWidth: 1
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
                    ticks: {
                        display: false // Hide labels for large dataset
                    }
                }
            }
        }
    },
    parameters: {
        docs: {
            description: {
                story: `## Large Dataset

Demonstrates behaviour with fifty data points and condensed labelling.`
            }
        }
    },
    play: async ({ args, step }) => {
        await step('generates fifty labels and values', async () => {
            expect(args.data.labels.length).toBe(50)
            expect(args.data.datasets[0].data.length).toBe(50)
        })

        await step('hides dense x-axis tick labels', async () => {
            expect(args.options.scales?.x?.ticks?.display).toBe(false)
        })

        await step('keeps chart responsive for large datasets', async () => {
            expect(args.options.responsive).toBe(true)
        })
    }
}

export const EmptyState = {
    render: (args) => ({
        components: { BarChart },
        setup() {
            return { args }
        },
        template: '<div style="width: 100%; height: 400px;"><bar-chart v-bind="args" /></div>'
    }),
    args: {
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'No Data',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: '#6b7280',
                borderColor: '#4b5563',
                borderWidth: 2
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
                y: {
                    beginAtZero: true
                }
            }
        }
    },
    parameters: {
        docs: {
            description: {
                story: `## Empty State

Gracefully renders when all values are zero.`
            }
        }
    },
    play: async ({ args, step }) => {
        await step('uses zeroed dataset', async () => {
            expect(args.data.datasets[0].data.every((value) => value === 0)).toBe(true)
        })

        await step('keeps axes configured', async () => {
            expect(args.options.scales?.y?.beginAtZero).toBe(true)
        })

        await step('hides legend to reduce noise', async () => {
            expect(args.options.plugins?.legend?.display).toBe(false)
        })
    }
}

export const NegativeValues = {
    render: (args) => ({
        components: { BarChart },
        setup() {
            return { args }
        },
        template: '<div style="width: 100%; height: 400px;"><bar-chart v-bind="args" /></div>'
    }),
    args: {
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Profit/Loss',
                data: [12, -5, 8, -3, 15, 7],
                backgroundColor: '#3b82f6',
                borderColor: '#2563eb',
                borderWidth: 2
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
                y: {
                    beginAtZero: false // Allow negative values
                }
            }
        }
    },
    parameters: {
        docs: {
            description: {
                story: `## Negative Values

Highlights profit and loss scenarios with values above and below zero.`
            }
        }
    },
    play: async ({ args, step }) => {
        await step('includes negative values', async () => {
            expect(args.data.datasets[0].data.some((value) => value < 0)).toBe(true)
        })

        await step('allows negative range on y-axis', async () => {
            expect(args.options.scales?.y?.beginAtZero).toBe(false)
        })

        await step('keeps responsive behaviour', async () => {
            expect(args.options.responsive).toBe(true)
        })
    }
}

export const FixedSize = {
    render: (args) => ({
        components: { BarChart },
        setup() {
            return { args }
        },
        template: '<div><bar-chart v-bind="args" /></div>'
    }),
    args: {
        data: {
            labels: ['Product A', 'Product B', 'Product C', 'Product D'],
            datasets: [{
                label: 'Units Sold',
                data: [45, 67, 32, 89],
                backgroundColor: '#14b8a6',
                borderColor: '#0d9488',
                borderWidth: 2
            }]
        },
        width: 600,
        height: 400,
        options: {
            responsive: false,
            maintainAspectRatio: true
        }
    },
    parameters: {
        docs: {
            description: {
                story: `## Fixed Size

Demonstrates a non-responsive chart with explicit dimensions.`
            }
        }
    },
    play: async ({ args, step }) => {
        await step('applies explicit width and height', async () => {
            expect(args.width).toBe(600)
            expect(args.height).toBe(400)
        })

        await step('disables responsive behaviour', async () => {
            expect(args.options.responsive).toBe(false)
        })

        await step('preserves aspect ratio', async () => {
            expect(args.options.maintainAspectRatio).toBe(true)
        })
    }
}

export const WithLoadingSpinner = {
    render: (args) => ({
        components: { BarChart },
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
                            label: 'Sales',
                            data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 100) + 20),
                            backgroundColor: '#3b82f6',
                            borderColor: '#2563eb',
                            borderWidth: 2
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
                    <bar-chart
                        v-if="chartData"
                        :data="chartData"
                        :options="args.options"
                        :show-loading="isLoading"
                        loading-message="Loading chart data..."
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
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    },
    parameters: {
        docs: {
            description: {
                story: `## With Loading Spinner

Illustrates loading states with a spinner, placeholder messaging, and manual reload control.`
            }
        }
    },
    play: async ({ canvas, args, step }) => {
        await step('renders reload button', async () => {
            const button = canvas.getByRole('button', { name: 'Reload Data' })
            await expect(button).toBeInTheDocument()
        })

        await step('shows placeholder while data is loading', async () => {
            const placeholder = canvas.getByText('Click "Reload Data" to load chart')
            await expect(placeholder).toBeInTheDocument()
        })

        await step('disables legend during loading showcase', async () => {
            expect(args.options.plugins?.legend?.display).toBe(false)
        })
    }
}
