import { ref, computed } from 'vue'

/**
 * Composable for managing dataset visibility (show/hide datasets via legend)
 * @param {Object} datasets - Ref or computed containing datasets array
 * @returns {Object} - Dataset visibility state and methods
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
     * @returns {boolean} - New disabled state (true if now disabled)
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
     * Check if a dataset is disabled
     * @param {number} index - Dataset index
     * @returns {boolean} - True if disabled
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
     * Standard event handler for ChartLegend @toggle events
     * @param {Object} event - Event from ChartLegend { index, disabled }
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
