import { ref, computed } from 'vue'

/**
 * Composable for managing dataset visibility (show/hide datasets via legend)
 * Tracks which datasets are disabled and provides toggle functionality
 * @param {import('vue').ComputedRef<import('../types.js').Dataset[]>} datasets - Ref or computed containing datasets array
 * @returns {{
 *   disabledDatasets: import('vue').Ref<Set<number>>,
 *   visibleDatasets: import('vue').ComputedRef<import('../types.js').Dataset[]>,
 *   toggleDataset: (index: number) => boolean,
 *   isDatasetDisabled: (index: number) => boolean,
 *   showAllDatasets: () => void,
 *   hideAllDatasets: () => void,
 *   handleLegendToggle: (event: {index: number}) => void
 * }} Object with visibility state and toggle methods
 * @example
 * const { visibleDatasets, toggleDataset, handleLegendToggle } = useDatasetVisibility(datasets)
 */
export function useDatasetVisibility(datasets) {
    // Track which dataset indices are disabled
    const disabledDatasets = ref(new Set())

    /**
     * Filter datasets to only visible ones
     */
    const visibleDatasets = computed(() => {
        if (!datasets.value) return []
        return datasets.value.filter((_, index) => !disabledDatasets.value.has(index))
    })

    /**
     * Toggle dataset visibility by index
     * @param {number} index - Dataset index to toggle
     * @returns {boolean} New disabled state (true if now disabled, false if now visible)
     */
    function toggleDataset(index) {
        if (disabledDatasets.value.has(index)) {
            disabledDatasets.value.delete(index)
            return false
        } else {
            disabledDatasets.value.add(index)
            return true
        }
    }

    /**
     * Check if a dataset is currently disabled
     * @param {number} index - Dataset index
     * @returns {boolean} True if dataset is disabled/hidden
     */
    function isDatasetDisabled(index) {
        return disabledDatasets.value.has(index)
    }

    /**
     * Enable all datasets
     */
    function showAllDatasets() {
        disabledDatasets.value.clear()
    }

    /**
     * Disable all datasets
     */
    function hideAllDatasets() {
        if (!datasets.value) return
        disabledDatasets.value = new Set(datasets.value.map((_, index) => index))
    }

    /**
     * Handle legend toggle event
     * Standard event handler for ChartLegend component @toggle events
     * @param {{index: number, disabled?: boolean}} event - Event from ChartLegend with dataset index
     */
    function handleLegendToggle(event) {
        toggleDataset(event.index)
    }

    return {
        disabledDatasets,
        visibleDatasets,
        toggleDataset,
        isDatasetDisabled,
        showAllDatasets,
        hideAllDatasets,
        handleLegendToggle
    }
}
