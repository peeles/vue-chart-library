import { ref, onMounted } from 'vue'
import StackedChart from './StackedChart.vue'

/**
 * # StackedChart Component
 *
 * A fully responsive and customisable stacked bar chart component for Vue 3.
 * Perfect for showing composition and comparing parts of a whole across categories.
 *
 * ## Features
 * - **Responsive**: Automatically adapts to container size
 * - **Interactive**: Hover tooltips and click events
 * - **Customisable**: Full control over colours, spacing, and appearance
 * - **Accessible**: ARIA labels and keyboard navigation
 * - **Stacked Values**: Shows how multiple datasets combine
 *
 * ## Installation
 * ```js
 * import { StackedChart } from '@vue-charts/core'
 * import '@vue-charts/core/style.css'
 * ```
 *
 * ## Basic Usage
 * ```vue
 * <template>
 *   <stacked-chart :data="chartData" :options="chartOptions" />
 * </template>
 *
 * <script setup>
 * import { StackedChart } from '@vue-charts/core'
 *
 * const chartData = {
 *   labels: ['Q1', 'Q2', 'Q3', 'Q4'],
 *   datasets: [
 *     { label: 'Product A', data: [30, 40, 35, 50], backgroundColor: '#3b82f6' },
 *     { label: 'Product B', data: [20, 30, 25, 35], backgroundColor: '#8b5cf6' },
 *     { label: 'Product C', data: [15, 20, 18, 25], backgroundColor: '#10b981' }
 *   ]
 * }
 * </script>
 * ```
 */
export default {
  title: 'Charts/StackedChart',
  component: StackedChart,
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
    onBarClick: {
      action: 'bar-click',
      description: 'Event emitted when a bar segment is clicked'
    }
  }
}

/**
 * Default Story - Basic stacked bar chart
 */
export const Default = {
  render: (args) => ({
    components: { StackedChart },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; height: 400px; padding: 20px; background: #f9fafb; border-radius: 8px;">
        <stacked-chart v-bind="args" />
      </div>
    `
  }),
  args: {
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Product A',
          data: [30, 40, 35, 50],
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1
        },
        {
          label: 'Product B',
          data: [20, 30, 25, 35],
          backgroundColor: '#8b5cf6',
          borderColor: '#7c3aed',
          borderWidth: 1
        },
        {
          label: 'Product C',
          data: [15, 20, 18, 25],
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1
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
  }
}

/**
 * Monthly Revenue Breakdown
 */
export const MonthlyRevenue = {
  render: (args) => ({
    components: { StackedChart },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; height: 400px; padding: 20px;">
        <stacked-chart v-bind="args" />
      </div>
    `
  }),
  args: {
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Subscriptions',
          data: [45, 52, 48, 60, 58, 65, 70, 68, 72, 75, 78, 82],
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1
        },
        {
          label: 'Services',
          data: [30, 35, 32, 40, 38, 42, 45, 43, 47, 50, 52, 55],
          backgroundColor: '#8b5cf6',
          borderColor: '#7c3aed',
          borderWidth: 1
        },
        {
          label: 'Products',
          data: [25, 28, 26, 32, 30, 35, 38, 36, 40, 42, 45, 48],
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1
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
 * Team Performance
 */
export const TeamPerformance = {
  render: (args) => ({
    components: { StackedChart },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; height: 400px; padding: 20px;">
        <stacked-chart v-bind="args" />
      </div>
    `
  }),
  args: {
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Team A',
          data: [12, 19, 15, 17],
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          borderWidth: 1
        },
        {
          label: 'Team B',
          data: [10, 15, 13, 14],
          backgroundColor: '#f59e0b',
          borderColor: '#d97706',
          borderWidth: 1
        },
        {
          label: 'Team C',
          data: [8, 12, 10, 11],
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1
        },
        {
          label: 'Team D',
          data: [6, 9, 7, 8],
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1
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
 * No Grid Lines
 */
export const NoGridLines = {
  render: (args) => ({
    components: { StackedChart },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; height: 400px; padding: 20px;">
        <stacked-chart v-bind="args" />
      </div>
    `
  }),
  args: {
    data: {
      labels: ['North', 'South', 'East', 'West'],
      datasets: [
        {
          label: 'Online Sales',
          data: [45, 52, 48, 55],
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1
        },
        {
          label: 'In-Store Sales',
          data: [30, 35, 32, 38],
          backgroundColor: '#8b5cf6',
          borderColor: '#7c3aed',
          borderWidth: 1
        }
      ]
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
 * Interactive with Events
 */
export const Interactive = {
  render: (args) => ({
    components: { StackedChart },
    setup() {
      const chartData = ref({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          {
            label: 'Tasks Completed',
            data: [12, 15, 10, 14, 16],
            backgroundColor: '#10b981',
            borderColor: '#059669',
            borderWidth: 1
          },
          {
            label: 'Tasks In Progress',
            data: [5, 7, 6, 8, 7],
            backgroundColor: '#f59e0b',
            borderColor: '#d97706',
            borderWidth: 1
          },
          {
            label: 'Tasks Pending',
            data: [3, 4, 5, 3, 4],
            backgroundColor: '#ef4444',
            borderColor: '#dc2626',
            borderWidth: 1
          }
        ]
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

      const randomiseData = () => {
        chartData.value = {
          ...chartData.value,
          datasets: chartData.value.datasets.map(dataset => ({
            ...dataset,
            data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 5)
          }))
        }
      }

      return { chartData, events, handleBarClick, randomiseData, args }
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
          <stacked-chart
            :data="chartData"
            :options="args.options"
            @bar-click="handleBarClick"
          />
        </div>
        <div v-if="events.length > 0" style="padding: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #111827;">Recent Events</h4>
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
 * Many Categories
 */
export const ManyCategories = {
  render: (args) => ({
    components: { StackedChart },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; height: 400px; padding: 20px;">
        <stacked-chart v-bind="args" />
      </div>
    `
  }),
  args: {
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Category 1',
          data: [20, 25, 22, 28, 26, 30, 32, 30, 34, 36, 38, 40],
          backgroundColor: '#3b82f6',
          borderWidth: 1
        },
        {
          label: 'Category 2',
          data: [15, 18, 16, 20, 19, 22, 24, 22, 26, 28, 30, 32],
          backgroundColor: '#8b5cf6',
          borderWidth: 1
        },
        {
          label: 'Category 3',
          data: [10, 12, 11, 14, 13, 15, 17, 15, 18, 20, 22, 24],
          backgroundColor: '#10b981',
          borderWidth: 1
        },
        {
          label: 'Category 4',
          data: [8, 10, 9, 11, 10, 12, 14, 12, 15, 17, 19, 21],
          backgroundColor: '#f59e0b',
          borderWidth: 1
        },
        {
          label: 'Category 5',
          data: [5, 7, 6, 8, 7, 9, 11, 9, 12, 14, 16, 18],
          backgroundColor: '#ef4444',
          borderWidth: 1
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
 * With Loading Spinner
 */
export const WithLoadingSpinner = {
  render: (args) => ({
    components: { StackedChart },
    setup() {
      const chartData = ref(null)
      const isLoading = ref(true)

      const loadData = () => {
        isLoading.value = true
        chartData.value = null

        setTimeout(() => {
          chartData.value = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
              {
                label: 'Revenue',
                data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 50) + 30),
                backgroundColor: '#3b82f6',
                borderWidth: 1
              },
              {
                label: 'Costs',
                data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 30) + 20),
                backgroundColor: '#8b5cf6',
                borderWidth: 1
              },
              {
                label: 'Profit',
                data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 20) + 10),
                backgroundColor: '#10b981',
                borderWidth: 1
              }
            ]
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
          <stacked-chart
            v-if="chartData"
            :data="chartData"
            :options="args.options"
            :show-loading="isLoading"
            loading-message="Loading stacked chart..."
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
