import { calculateBarWidth as calculateBarWidthUtil } from '@/utils/chartCalculations.js'

/**
 * Composable for calculating bar dimensions and positions
 * Handles both grouped and stacked bar chart layouts
 * @param {{
 *   labels: import('vue').Ref<string[]>|import('vue').ComputedRef<string[]>,
 *   visibleDatasets: import('vue').Ref<import('../types.js').Dataset[]>|import('vue').ComputedRef<import('../types.js').Dataset[]>,
 *   gapRatio: number,
 *   stacked: boolean
 * }} params - Configuration parameters
 * @param {import('vue').Ref<string[]>|import('vue').ComputedRef<string[]>} params.labels - Chart labels (x-axis categories)
 * @param {import('vue').Ref<import('../types.js').Dataset[]>|import('vue').ComputedRef<import('../types.js').Dataset[]>} params.visibleDatasets - Visible datasets
 * @param {number} [params.gapRatio=0.2] - Gap ratio between bars (0-1, where 0.2 = 20% gap)
 * @param {boolean} [params.stacked=false] - Whether bars are stacked
 * @returns {{
 *   getGroupWidth: (chartArea: import('../types.js').ChartArea) => number,
 *   getBarWidth: (chartArea: import('../types.js').ChartArea) => number,
 *   getBarX: (labelIndex: number, datasetIndex: number, chartArea: import('../types.js').ChartArea) => number,
 *   getGroupStart: (labelIndex: number, chartArea: import('../types.js').ChartArea) => number,
 *   getGroupCenter: (labelIndex: number, chartArea: import('../types.js').ChartArea) => number
 * }} Bar dimension calculation functions
 * @example
 * const { getBarWidth, getBarX } = useBarDimensions({ labels, visibleDatasets, gapRatio: 0.2, stacked: false })
 */
export function useBarDimensions({ labels, visibleDatasets, gapRatio = 0.2, stacked = false }) {
    /**
     * Calculate the width of each group (category) along the x-axis
     * @param {import('../types.js').ChartArea} chartArea - Chart area dimensions
     * @returns {number} Group width in pixels
     */
    const getGroupWidth = (chartArea) => {
        const labelCount = labels.value?.length || 0
        if (labelCount === 0) return 0
        return chartArea.width / labelCount
    }

    /**
     * Calculate the width of a single bar
     * For grouped bars: distributed among datasets
     * For stacked bars: takes full group width (minus gap)
     * @param {import('../types.js').ChartArea} chartArea - Chart area dimensions
     * @returns {number} Bar width in pixels
     */
    const getBarWidth = (chartArea) => {
        const labelCount = labels.value?.length || 0
        if (labelCount === 0) return 0

        const groupWidth = getGroupWidth(chartArea)

        if (stacked) {
            // Stacked bars: single bar per group
            return calculateBarWidthUtil(groupWidth, 1, gapRatio)
        } else {
            // Grouped bars: divide among visible datasets
            const datasetCount = visibleDatasets.value?.length || 0
            return calculateBarWidthUtil(groupWidth, datasetCount, gapRatio)
        }
    }

    /**
     * Calculate the X position for a grouped or stacked bar
     * @param {number} labelIndex - Index of the category/label
     * @param {number} datasetIndex - Index of the dataset (0 for stacked)
     * @param {import('../types.js').ChartArea} chartArea - Chart area dimensions
     * @returns {number} X position in pixels
     */
    const getBarX = (labelIndex, datasetIndex, chartArea) => {
        const labelCount = labels.value?.length || 0
        if (labelCount === 0) return 0

        const groupWidth = getGroupWidth(chartArea)
        const groupStart = chartArea.x + groupWidth * labelIndex
        const barW = getBarWidth(chartArea)

        if (stacked) {
            // Stacked bars: centered within group
            return groupStart + (groupWidth - barW) / 2
        } else {
            // Grouped bars: position based on dataset index
            const datasetCount = visibleDatasets.value?.length || 0
            const totalBarsWidth = barW * datasetCount
            const groupPadding = (groupWidth - totalBarsWidth) / 2
            return groupStart + groupPadding + (barW * datasetIndex)
        }
    }

    /**
     * Calculate the start X position for a group
     * Useful for group labels or backgrounds
     * @param {number} labelIndex - Index of the category/label
     * @param {import('../types.js').ChartArea} chartArea - Chart area dimensions
     * @returns {number} Group start X position in pixels
     */
    const getGroupStart = (labelIndex, chartArea) => {
        const groupWidth = getGroupWidth(chartArea)
        return chartArea.x + groupWidth * labelIndex
    }

    /**
     * Calculate the center X position for a group
     * Useful for centered labels
     * @param {number} labelIndex - Index of the category/label
     * @param {import('../types.js').ChartArea} chartArea - Chart area dimensions
     * @returns {number} Group center X position in pixels
     */
    const getGroupCenter = (labelIndex, chartArea) => {
        const groupWidth = getGroupWidth(chartArea)
        return chartArea.x + groupWidth * labelIndex + groupWidth / 2
    }

    return {
        getGroupWidth,
        getBarWidth,
        getBarX,
        getGroupStart,
        getGroupCenter
    }
}
