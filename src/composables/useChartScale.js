import { computed } from 'vue'
import { calculateNiceScale, getDataRange, formatNumber, calculateStackedValues } from '@/utils/chartCalculations.js'

/**
 * Composable for calculating chart scales and tick positions
 * @param {Object} datasets - Chart datasets
 * @param {Object} chartArea - Chart area dimensions (can be a ref or computed with stacked property)
 * @param {Object} scaleConfig - Scale configuration
 * @returns {Object} - Scale utilities and tick generators
 */
export function useChartScale(datasets, chartArea, scaleConfig = {}) {
  /**
   * Check if stacked mode is enabled
   */
  const isStacked = computed(() => {
    return chartArea.value?.stacked === true
  })

  /**
   * Calculate data range for Y axis
   */
  const dataRange = computed(() => {
    if (isStacked.value) {
      // For stacked charts, calculate range based on stacked totals
      const stackedValues = calculateStackedValues(datasets.value)
      if (stackedValues.length === 0) {
        return { min: 0, max: 10 }
      }
      const min = Math.min(...stackedValues, 0)
      const max = Math.max(...stackedValues)
      return { min, max }
    }
    return getDataRange(datasets.value)
  })

  /**
   * Calculate Y axis scale
   */
  const yScale = computed(() => {
    const { min, max } = dataRange.value
    const beginAtZero = scaleConfig.value?.y?.beginAtZero !== false

    return calculateNiceScale(
      beginAtZero ? Math.min(0, min) : min,
      max,
      5
    )
  })

  /**
   * Generate Y axis ticks with positions
   */
  const generateYAxisTicks = (area) => {
    const { min, max, step } = yScale.value
    const ticks = []

    for (let value = min; value <= max; value += step) {
      const normalizedValue = (value - min) / (max - min)
      const y = area.y + area.height - (normalizedValue * area.height)

      ticks.push({
        value,
        gridLine: {
          x1: area.x,
          y1: y,
          x2: area.x + area.width,
          y2: y
        },
        tickMark: {
          x1: area.x - 5,
          y1: y,
          x2: area.x,
          y2: y
        },
        label: {
          x: area.x - 8,
          y: y,
          text: formatNumber(value, 0),
          textAnchor: 'end',
          dominantBaseline: 'middle'
        }
      })
    }

    return ticks
  }

  /**
   * Generate X axis ticks with positions
   */
  const generateXAxisTicks = (area, labels) => {
    const ticks = []
    const labelCount = labels.length

    if (labelCount === 0) return ticks

    labels.forEach((label, index) => {
      const x = area.x + (area.width / labelCount) * (index + 0.5)
      const y = area.y + area.height

      ticks.push({
        value: label,
        gridLine: {
          x1: x,
          y1: area.y,
          x2: x,
          y2: y
        },
        tickMark: {
          x1: x,
          y1: y,
          x2: x,
          y2: y + 5
        },
        label: {
          x: x,
          y: y + 20,
          text: label,
          textAnchor: 'middle',
          dominantBaseline: 'hanging'
        }
      })
    })

    return ticks
  }

  /**
   * Convert value to Y coordinate
   */
  const valueToY = (value, area) => {
    const { min, max } = yScale.value
    const normalizedValue = (value - min) / (max - min)
    return area.y + area.height - (normalizedValue * area.height)
  }

  /**
   * Calculate bar height
   */
  const valueToHeight = (value, area) => {
    const { min, max } = yScale.value
    const normalizedValue = (value - min) / (max - min)
    return normalizedValue * area.height
  }

  return {
    dataRange,
    yScale,
    generateYAxisTicks,
    generateXAxisTicks,
    valueToY,
    valueToHeight
  }
}
