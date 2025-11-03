/**
 * Validates chart data structure according to Chart.js pattern
 * Ensures data has required labels and datasets arrays with matching lengths
 * @param {import('../types.js').ChartData} data - Chart data object to validate
 * @returns {boolean} True if data structure is valid, false otherwise
 * @example
 * validateChartData({ labels: ['A', 'B'], datasets: [{ data: [1, 2] }] }) // Returns: true
 * validateChartData({ labels: ['A'], datasets: [{ data: [1, 2] }] }) // Returns: false (length mismatch)
 * validateChartData({}) // Returns: false (missing required fields)
 */
export function validateChartData(data) {
    if (!data || typeof data !== 'object') {
        return false
    }

    if (!Array.isArray(data.labels)) {
        return false
    }

    if (!Array.isArray(data.datasets) || data.datasets.length === 0) {
        return false
    }

    // Validate each dataset
    return data.datasets.every(dataset => {
        return (
            dataset &&
            typeof dataset === 'object' &&
            Array.isArray(dataset.data) &&
            dataset.data.length === data.labels.length
        )
    })
}

/**
 * Validates chart options object
 * Options are optional, so null/undefined is considered valid
 * @param {import('../types.js').ChartOptions|null|undefined} options - Chart options object to validate
 * @returns {boolean} True if options are valid or not provided, false if invalid
 * @example
 * validateChartOptions({ responsive: true }) // Returns: true
 * validateChartOptions(null) // Returns: true (options are optional)
 * validateChartOptions("invalid") // Returns: false (not an object)
 */
export function validateChartOptions(options) {
    if (!options) {
        return true // Options are optional
    }

    if (typeof options !== 'object') {
        return false
    }

    return true
}

/**
 * Validates that all data values are valid numbers
 * Checks for numeric type and filters out NaN values
 * @param {number[]} data - Array of numbers to validate
 * @returns {boolean} True if all values are valid numbers, false otherwise
 * @example
 * validateNumericData([1, 2, 3]) // Returns: true
 * validateNumericData([1, "2", 3]) // Returns: false (string "2")
 * validateNumericData([1, NaN, 3]) // Returns: false (NaN)
 */
export function validateNumericData(data) {
    if (!Array.isArray(data)) {
        return false
    }

    return data.every(value => {
        return typeof value === 'number' && !isNaN(value)
    })
}

/**
 * Validates color value format (hex, rgb, rgba, or common named colors)
 * @param {string} color - Color value to validate
 * @returns {boolean} True if color format is valid, false otherwise
 * @example
 * validateColor("#3b82f6") // Returns: true (hex)
 * validateColor("#fff") // Returns: true (short hex)
 * validateColor("rgb(59, 130, 246)") // Returns: true
 * validateColor("rgba(59, 130, 246, 0.5)") // Returns: true
 * validateColor("red") // Returns: true (named color)
 * validateColor("invalid") // Returns: false
 */
export function validateColor(color) {
    if (!color || typeof color !== 'string') {
        return false
    }

    // Test hex colors
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
        return true
    }

    // Test rgb/rgba
    if (/^rgb(a)?\([\d,.\s]+\)$/.test(color)) {
        return true
    }

    // Test named colors (basic check)
    const namedColors = [
        'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange',
        'purple', 'pink', 'brown', 'gray', 'grey'
    ]
    if (namedColors.includes(color.toLowerCase())) {
        return true
    }

    return false
}

/**
 * Validates dataset object structure and optionally checks data length
 * @param {import('../types.js').Dataset} dataset - Dataset object to validate
 * @param {number} [expectedLength] - Expected data array length (optional)
 * @returns {boolean} True if dataset is valid, false otherwise
 * @example
 * validateDataset({ data: [1, 2, 3] }) // Returns: true
 * validateDataset({ data: [1, 2] }, 2) // Returns: true (length matches)
 * validateDataset({ data: [1, 2] }, 3) // Returns: false (length mismatch)
 * validateDataset({}) // Returns: false (no data array)
 */
export function validateDataset(dataset, expectedLength) {
    if (!dataset || typeof dataset !== 'object') {
        return false
    }

    if (!Array.isArray(dataset.data)) {
        return false
    }

    if (expectedLength !== undefined && dataset.data.length !== expectedLength) {
        return false
    }

    return true
}
