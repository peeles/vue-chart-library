/**
 * Validates chart data structure
 * @param {Object} data - Chart data object
 * @returns {boolean} - True if valid
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
 * Validates chart options
 * @param {Object} options - Chart options object
 * @returns {boolean} - True if valid
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
 * Validates numeric data
 * @param {Array} data - Array of numbers
 * @returns {boolean} - True if all values are numbers
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
 * Validates color value (hex, rgb, rgba, named)
 * @param {string} color - Color value
 * @returns {boolean} - True if valid color
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
 * Validates dataset structure
 * @param {Object} dataset - Dataset object
 * @param {number} expectedLength - Expected data length
 * @returns {boolean} - True if valid
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