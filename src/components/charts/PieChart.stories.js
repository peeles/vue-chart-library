import { ref, onMounted } from 'vue'
import PieChart from './PieChart.vue'

/**
 * # PieChart Component
 *
 * A fully responsive and highly customisable pie/donut chart component for Vue 3.
 * Perfect for showing proportions, percentages, and part-to-whole relationships.
 *
 * ## Features
 * - **Donut Mode**: Optional center hole with custom labels
 * - **Exploded Slices**: Separate slices for emphasis (all or individual)
 * - **Flexible Labels**: Inner, outer, or no labels with multiple format options
 * - **Interactive**: Hover tooltips and click events
 * - **Customisable**: Full control over colours, borders, angles, and appearance
 *
 * ## Installation
 * ```js
 * import { PieChart } from '@vue-charts/core'
 * import '@vue-charts/core/style.css'
 * ```
 *
 * ## Basic Usage
 * ```vue
 * <template>
 *   <pie-chart :data="chartData" :options="chartOptions" />
 * </template>
 *
 * <script setup>
 * import { PieChart } from '@vue-charts/core'
 *
 * const chartData = {
 *   labels: ['Red', 'Blue', 'Yellow', 'Green'],
 *   datasets: [{
 *     data: [12, 19, 8, 15],
 *     backgroundColor: ['#ef4444', '#3b82f6', '#eab308', '#10b981']
 *   }]
 * }
 * </script>
 * ```
 */
export default {
  title: 'Charts/PieChart',
  component: PieChart,
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
    onSliceClick: {
      action: 'slice-click',
      description: 'Event emitted when a slice is clicked'
    }
  }
}

/**
 * Default Story - Basic pie chart
 */
export const Default = {
  render: (args) => ({
    components: { PieChart },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; height: 400px; padding: 20px; background: #f9fafb; border-radius: 8px;">
        <pie-chart v-bind="args" />
      </div>
    `
  }),
  args: {
    data: {
      labels: ['Sales', 'Marketing', 'Development', 'Support'],
      datasets: [{
        data: [35, 25, 30, 10],
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#10b981',
          '#f59e0b'
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right'
        }
      }
    }
  }
}

/**
 * Donut Chart - With center label
 */
export const DonutChart = {
  render: (args) => ({
    components: { PieChart },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; height: 400px; padding: 20px;">
        <pie-chart v-bind="args" />
      </div>
    `
  }),
  args: {
    data: {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{
        data: [55, 35, 10],
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#10b981'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      donut: true,
      donutThickness: 0.6,
      centerLabel: {
        title: 'Total',
        subtitle: '100%'
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  }
}

/**
 * Inner Labels - Labels on slices
 */
export const InnerLabels = {
  render: (args) => ({
    components: { PieChart },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; height: 400px; padding: 20px;">
        <pie-chart v-bind="args" />
      </div>
    `
  }),
  args: {
    data: {
      labels: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Other'],
      datasets: [{
        data: [45, 20, 18, 12, 5],
        backgroundColor: [
          '#3b82f6',
          '#f59e0b',
          '#8b5cf6',
          '#10b981',
          '#6b7280'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      labelPosition: 'inner',
      labelColor: '#ffffff',
      labelFontSize: 14,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  }
}

/**
 * Outer Labels - Labels with connecting lines
 */
export const OuterLabels = {
  render: (args) => ({
    components: { PieChart },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; height: 400px; padding: 20px;">
        <pie-chart v-bind="args" />
      </div>
    `
  }),
  args: {
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        data: [18, 22, 15, 25, 20],
        backgroundColor: [
          '#ef4444',
          '#f59e0b',
          '#eab308',
          '#10b981',
          '#3b82f6'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      labelPosition: 'outer',
      labelFormat: 'both',
      plugins: {
        legend: {
          display: false
        }
      }
    }
  }
}

/**
 * Label Formats - Different label display options
 */
export const LabelFormats = {
  render: (args) => ({
    components: { PieChart },
    setup() {
      const currentFormat = ref('percentage')
      const formats = ['percentage', 'value', 'label', 'both']

      const chartOptions = ref({
        ...args.options,
        labelFormat: currentFormat.value
      })

      const changeFormat = (format) => {
        currentFormat.value = format
        chartOptions.value = {
          ...args.options,
          labelFormat: format
        }
      }

      return { args, chartOptions, changeFormat, formats, currentFormat }
    },
    template: `
      <div style="width: 100%;">
        <div style="margin-bottom: 16px; display: flex; gap: 8px;">
          <button
            v-for="format in formats"
            :key="format"
            @click="changeFormat(format)"
            :style="{
              padding: '8px 16px',
              background: currentFormat === format ? '#3b82f6' : '#e5e7eb',
              color: currentFormat === format ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              textTransform: 'capitalize'
            }"
          >
            {{ format }}
          </button>
        </div>
        <div style="width: 100%; height: 400px; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <pie-chart
            :data="args.data"
            :options="chartOptions"
          />
        </div>
      </div>
    `
  }),
  args: {
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
      datasets: [{
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#ef4444',
          '#3b82f6',
          '#eab308',
          '#10b981',
          '#8b5cf6'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      labelPosition: 'outer',
      labelFormat: 'percentage',
      plugins: {
        legend: {
          display: false
        }
      }
    }
  }
}

/**
 * Custom Start Angle - Start from different position
 */
export const CustomStartAngle = {
  render: (args) => ({
    components: { PieChart },
    setup() {
      const startAngle = ref(-90)

      const chartOptions = ref({
        ...args.options,
        startAngle: startAngle.value
      })

      const updateAngle = () => {
        chartOptions.value = {
          ...args.options,
          startAngle: startAngle.value
        }
      }

      return { args, chartOptions, startAngle, updateAngle }
    },
    template: `
      <div style="width: 100%;">
        <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <label style="font-size: 14px; font-weight: 500; color: #374151;">
            Start Angle: {{ startAngle }}°
          </label>
          <input
            v-model.number="startAngle"
            @input="updateAngle"
            type="range"
            min="-180"
            max="180"
            step="15"
            style="flex: 1; max-width: 300px;"
          />
        </div>
        <div style="width: 100%; height: 400px; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <pie-chart
            :data="args.data"
            :options="chartOptions"
          />
        </div>
      </div>
    `
  }),
  args: {
    data: {
      labels: ['North', 'East', 'South', 'West'],
      datasets: [{
        data: [25, 25, 25, 25],
        backgroundColor: [
          '#ef4444',
          '#3b82f6',
          '#10b981',
          '#f59e0b'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      startAngle: -90,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  }
}

/**
 * Donut Thickness - Adjustable donut width
 */
export const DonutThickness = {
  render: (args) => ({
    components: { PieChart },
    setup() {
      const thickness = ref(0.6)

      const chartOptions = ref({
        ...args.options,
        donutThickness: thickness.value
      })

      const updateThickness = () => {
        chartOptions.value = {
          ...args.options,
          donutThickness: thickness.value
        }
      }

      return { args, chartOptions, thickness, updateThickness }
    },
    template: `
      <div style="width: 100%;">
        <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <label style="font-size: 14px; font-weight: 500; color: #374151;">
            Thickness: {{ (thickness * 100).toFixed(0) }}%
          </label>
          <input
            v-model.number="thickness"
            @input="updateThickness"
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            style="flex: 1; max-width: 300px;"
          />
        </div>
        <div style="width: 100%; height: 400px; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <pie-chart
            :data="args.data"
            :options="chartOptions"
          />
        </div>
      </div>
    `
  }),
  args: {
    data: {
      labels: ['Category A', 'Category B', 'Category C'],
      datasets: [{
        data: [40, 35, 25],
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#10b981'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      donut: true,
      donutThickness: 0.6,
      centerLabel: {
        title: 'Total',
        subtitle: '100'
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
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
    components: { PieChart },
    setup() {
      const chartData = ref({
        labels: ['A', 'B', 'C', 'D'],
        datasets: [{
          data: [30, 25, 25, 20],
          backgroundColor: [
            '#3b82f6',
            '#8b5cf6',
            '#ec4899',
            '#f59e0b'
          ]
        }]
      })

      const events = ref([])

      const handleSliceClick = (data) => {
        events.value.unshift({
          label: data.label,
          value: data.value,
          percentage: data.percentage
        })
        if (events.value.length > 5) events.value.pop()
      }

      const randomiseData = () => {
        chartData.value = {
          ...chartData.value,
          datasets: [{
            ...chartData.value.datasets[0],
            data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 50) + 10)
          }]
        }
      }

      return { chartData, events, handleSliceClick, randomiseData, args }
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
          <pie-chart
            :data="chartData"
            :options="args.options"
            @slice-click="handleSliceClick"
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
              Clicked: <strong>{{ event.label }}</strong> - Value: <strong>{{ event.value }}</strong> ({{ event.percentage.toFixed(1) }}%)
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
        legend: {
          display: true,
          position: 'right'
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
    components: { PieChart },
    setup() {
      const chartData = ref(null)
      const isLoading = ref(true)

      const loadData = () => {
        isLoading.value = true
        chartData.value = null

        setTimeout(() => {
          chartData.value = {
            labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
            datasets: [{
              data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 50) + 10),
              backgroundColor: [
                '#3b82f6',
                '#8b5cf6',
                '#ec4899',
                '#f59e0b'
              ]
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
          <pie-chart
            v-if="chartData"
            :data="chartData"
            :options="args.options"
            :show-loading="isLoading"
            loading-message="Loading pie chart..."
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
      donut: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  }
}
