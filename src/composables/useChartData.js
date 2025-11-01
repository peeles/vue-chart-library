import { computed } from 'vue'
import { validateChartData, validateNumericData } from '@/utils/validators.js'
import { generateColorPalette } from '@/utils/colourUtils.js'

/**
 * Composable for normalizing and processing chart data
 * @param {Object} data - Chart data
 * @param {Object} options - Chart options
 * @returns {Object} - Normalized data and utilities
 */
export function useChartData(data, options = {}) {
    /**
   * Validate the chart data
   */
    const isValid = computed(() => {
        return validateChartData(data.value)
    })

    /**
   * Get normalized datasets with colors
   */
    const normalizedDatasets = computed(() => {
        if (!data.value || !data.value.datasets) {
            return []
        }

        return data.value.datasets.map((dataset, index) => {
            const colors = generateColorPalette(1, options.value?.colors)

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
   * Get all data values as flat array
   */
    const allValues = computed(() => {
        if (!data.value || !data.value.datasets) {
            return []
        }

        return data.value.datasets.flatMap(dataset => dataset.data)
    })

    /**
   * Check if all data is numeric
   */
    const isNumeric = computed(() => {
        return validateNumericData(allValues.value)
    })

    /**
   * Get dataset count
   */
    const datasetCount = computed(() => {
        return data.value?.datasets?.length || 0
    })

    /**
   * Get data point count (labels count)
   */
    const dataPointCount = computed(() => {
        return data.value?.labels?.length || 0
    })

    /**
   * Get labels
   */
    const labels = computed(() => {
        return data.value?.labels || []
    })

    /**
   * Check if data is empty
   */
    const isEmpty = computed(() => {
        return datasetCount.value === 0 || dataPointCount.value === 0
    })

    return {
        isValid,
        normalizedDatasets,
        allValues,
        isNumeric,
        datasetCount,
        dataPointCount,
        labels,
        isEmpty
    }
}
