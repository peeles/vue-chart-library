import { computed } from 'vue'
import { validateChartData, validateNumericData } from '@/utils/validators.js'
import { generateColorPalette } from '@/utils/colourUtils.js'

/**
 * Composable for normalizing and processing chart data
 * Validates data, applies default colors, and provides utility computed properties
 * @param {import('vue').Ref<import('../types.js').ChartData>} data - Reactive chart data ref
 * @param {import('vue').Ref<import('../types.js').ChartOptions>} [options={}] - Reactive chart options ref
 * @returns {{
 *   isValid: import('vue').ComputedRef<boolean>,
 *   normalisedDatasets: import('vue').ComputedRef<import('../types.js').Dataset[]>,
 *   allValues: import('vue').ComputedRef<number[]>,
 *   isNumeric: import('vue').ComputedRef<boolean>,
 *   datasetCount: import('vue').ComputedRef<number>,
 *   dataPointCount: import('vue').ComputedRef<number>,
 *   labels: import('vue').ComputedRef<string[]>,
 *   isEmpty: import('vue').ComputedRef<boolean>
 * }} Object containing computed properties for chart data processing
 * @example
 * const dataRef = ref({ labels: ['A', 'B'], datasets: [{ data: [1, 2] }] })
 * const { isValid, normalisedDatasets, isEmpty } = useChartData(dataRef)
 */
export function useChartData(data, options = {}) {
    /**
     * Validate the chart data structure
     * @type {import('vue').ComputedRef<boolean>}
     */
    const isValid = computed(() => {
        return validateChartData(data.value)
    })

    /**
     * Get normalized datasets with default colors applied
     * Ensures all datasets have backgroundColor, borderColor, borderWidth, and label
     * @type {import('vue').ComputedRef<import('../types.js').Dataset[]>}
     */
    const normalisedDatasets = computed(() => {
        if (!data.value || !data.value.datasets) {
            return []
        }

        // Generate color palette once for all datasets
        const datasetCount = data.value.datasets.length
        const colors = generateColorPalette(datasetCount, options.value?.colors)

        return data.value.datasets.map((dataset, index) => {
            return {
                ...dataset,
                backgroundColor: dataset.backgroundColor || colors[index % colors.length],
                borderColor: dataset.borderColor || dataset.backgroundColor || colors[index % colors.length],
                borderWidth: dataset.borderWidth ?? 1,
                label: dataset.label || `Dataset ${index + 1}`
            }
        })
    })

    /**
     * Get all data values from all datasets as a flat array
     * @type {import('vue').ComputedRef<number[]>}
     */
    const allValues = computed(() => {
        if (!data.value || !data.value.datasets) {
            return []
        }

        return data.value.datasets.flatMap(dataset => dataset.data)
    })

    /**
     * Check if all data values are valid numbers
     * @type {import('vue').ComputedRef<boolean>}
     */
    const isNumeric = computed(() => {
        return validateNumericData(allValues.value)
    })

    /**
     * Get total number of datasets
     * @type {import('vue').ComputedRef<number>}
     */
    const datasetCount = computed(() => {
        return data.value?.datasets?.length || 0
    })

    /**
     * Get number of data points (equal to number of labels)
     * @type {import('vue').ComputedRef<number>}
     */
    const dataPointCount = computed(() => {
        return data.value?.labels?.length || 0
    })

    /**
     * Get chart labels array
     * @type {import('vue').ComputedRef<string[]>}
     */
    const labels = computed(() => {
        return data.value?.labels || []
    })

    /**
     * Check if chart has no datasets or data points
     * @type {import('vue').ComputedRef<boolean>}
     */
    const isEmpty = computed(() => {
        return datasetCount.value === 0 || dataPointCount.value === 0
    })

    return {
        isValid,
        normalisedDatasets,
        allValues,
        isNumeric,
        datasetCount,
        dataPointCount,
        labels,
        isEmpty
    }
}
