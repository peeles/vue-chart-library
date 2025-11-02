import { computed } from 'vue'
import { calculateNiceScale, calculateStackedValues, formatNumber, getDataRange } from '@/utils/chartCalculations.js'

/**
 * Composable for calculating chart scales and tick positions
 * Handles both regular and stacked chart scaling with automatic nice scale calculation
 * @param {import('vue').ComputedRef<import('../types.js').Dataset[]>} datasets - Chart datasets ref
 * @param {import('vue').ComputedRef<{stacked?: boolean}>} chartArea - Chart area dimensions with optional stacked flag
 * @param {import('vue').ComputedRef<import('../types.js').ScalesConfig>} [scaleConfig={}] - Scale configuration ref
 * @returns {{
 *   dataRange: import('vue').ComputedRef<import('../types.js').DataRange>,
 *   yScale: import('vue').ComputedRef<import('../types.js').NiceScale>,
 *   generateYAxisTicks: (area: import('../types.js').ChartArea) => Array<{value: number, gridLine: object, tickMark: object, label: object}>,
 *   generateXAxisTicks: (area: import('../types.js').ChartArea, labels: string[], options?: {flush?: boolean}) => Array<{value: string, gridLine: object, tickMark: object, label: object}>,
 *   valueToY: (value: number, area: import('../types.js').ChartArea) => number,
 *   valueToHeight: (value: number, area: import('../types.js').ChartArea) => number
 * }} Object with scale calculations and tick generators
 * @example
 * const { yScale, generateYAxisTicks, valueToY } = useChartScale(datasets, chartArea, scales)
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
     * Generate Y axis ticks with positions for rendering
     * @param {import('../types.js').ChartArea} area - Chart area dimensions
     * @returns {Array<{value: number, gridLine: object, tickMark: object, label: object}>} Array of tick objects
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
     * Generate X axis ticks with positions for rendering
     * @param {import('../types.js').ChartArea} area - Chart area dimensions
     * @param {string[]} labels - Axis labels
     * @param {{flush?: boolean}} [options={}] - Options for tick positioning
     * @returns {Array<{value: string, gridLine: object, tickMark: object, label: object}>} Array of tick objects
     */
    const generateXAxisTicks = (area, labels, options = {}) => {
        const ticks = []
        const labelCount = labels.length
        const isFlush = options.flush === true

        if (labelCount === 0) return ticks

        labels.forEach((label, index) => {
            let x
            let textAnchor = 'middle'

            if (isFlush) {
                // Flush mode: labels at edges
                if (labelCount === 1) {
                    x = area.x + area.width / 2
                } else {
                    x = area.x + (area.width / (labelCount - 1)) * index

                    // Adjust text anchor for edge labels
                    if (index === 0) {
                        textAnchor = 'start'
                    } else if (index === labelCount - 1) {
                        textAnchor = 'end'
                    }
                }
            } else {
                // Centered mode: labels in segments
                x = area.x + (area.width / labelCount) * (index + 0.5)
            }

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
                    textAnchor: textAnchor,
                    dominantBaseline: 'hanging'
                }
            })
        })

        return ticks
    }

    /**
     * Convert data value to Y coordinate on chart
     * @param {number} value - Data value
     * @param {import('../types.js').ChartArea} area - Chart area dimensions
     * @returns {number} Y coordinate in pixels
     */
    const valueToY = (value, area) => {
        const { min, max } = yScale.value
        const normalizedValue = (value - min) / (max - min)
        return area.y + area.height - (normalizedValue * area.height)
    }

    /**
     * Convert data value to bar height in pixels
     * @param {number} value - Data value
     * @param {import('../types.js').ChartArea} area - Chart area dimensions
     * @returns {number} Height in pixels
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
