/**
 * Calculate min and max values from datasets
 * @param {Array} datasets - Array of dataset objects
 * @returns {Object} - {min, max}
 */
export function getDataRange(datasets) {
  let min = Infinity
  let max = -Infinity

  datasets.forEach(dataset => {
    dataset.data.forEach(value => {
      if (value < min) min = value
      if (value > max) max = value
    })
  })

  return { min, max }
}

/**
 * Calculate nice scale range for axis
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} ticks - Desired number of ticks
 * @returns {Object} - {min, max, step}
 */
export function calculateNiceScale(min, max, ticks = 5) {
  const range = max - min
  const roughStep = range / (ticks - 1)
  const magnitude = Math.floor(Math.log10(roughStep))
  const magnitudePower = Math.pow(10, magnitude)
  const possibleSteps = [1, 2, 5, 10]

  let niceStep = possibleSteps[0] * magnitudePower
  for (const step of possibleSteps) {
    const testStep = step * magnitudePower
    if (testStep >= roughStep) {
      niceStep = testStep
      break
    }
  }

  const niceMin = Math.floor(min / niceStep) * niceStep
  const niceMax = Math.ceil(max / niceStep) * niceStep

  return {
    min: niceMin,
    max: niceMax,
    step: niceStep,
    ticks: Math.round((niceMax - niceMin) / niceStep) + 1
  }
}

/**
 * Calculate stacked values for stacked charts
 * @param {Array} datasets - Array of dataset objects
 * @returns {Array} - Array of stacked totals
 */
export function calculateStackedValues(datasets) {
  if (!datasets || datasets.length === 0) return []

  const length = datasets[0].data.length
  const stacked = new Array(length).fill(0)

  datasets.forEach(dataset => {
    dataset.data.forEach((value, index) => {
      stacked[index] += value
    })
  })

  return stacked
}

/**
 * Calculate percentage values for pie chart
 * @param {Array} data - Array of numbers
 * @returns {Array} - Array of percentages
 */
export function calculatePercentages(data) {
  const total = data.reduce((sum, value) => sum + value, 0)

  if (total === 0) {
    return data.map(() => 0)
  }

  return data.map(value => (value / total) * 100)
}

/**
 * Calculate pie slice angles
 * @param {Array} data - Array of numbers
 * @returns {Array} - Array of {startAngle, endAngle, percentage}
 */
export function calculatePieSlices(data) {
  const percentages = calculatePercentages(data)
  const slices = []
  let currentAngle = -90 // Start at top

  percentages.forEach((percentage, index) => {
    const angle = (percentage / 100) * 360
    slices.push({
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      percentage,
      value: data[index]
    })
    currentAngle += angle
  })

  return slices
}

/**
 * Convert polar coordinates to cartesian
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 * @param {number} radius - Radius
 * @param {number} angleInDegrees - Angle in degrees
 * @returns {Object} - {x, y}
 */
export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  }
}

/**
 * Create SVG path for pie slice
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 * @param {number} radius - Radius
 * @param {number} startAngle - Start angle in degrees
 * @param {number} endAngle - End angle in degrees
 * @returns {string} - SVG path string
 */
export function describePieSlice(centerX, centerY, radius, startAngle, endAngle) {
  const start = polarToCartesian(centerX, centerY, radius, endAngle)
  const end = polarToCartesian(centerX, centerY, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  return [
    'M', centerX, centerY,
    'L', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'Z'
  ].join(' ')
}

/**
 * Calculate bar width for bar charts
 * @param {number} chartWidth - Total chart width
 * @param {number} dataLength - Number of data points
 * @param {number} padding - Padding percentage (0-1)
 * @returns {number} - Bar width
 */
export function calculateBarWidth(chartWidth, dataLength, padding = 0.2) {
  const availableWidth = chartWidth / dataLength
  return availableWidth * (1 - padding)
}

/**
 * Format number for display
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted number
 */
export function formatNumber(value, decimals = 2) {
  if (Math.abs(value) >= 1000000) {
    return (value / 1000000).toFixed(decimals) + 'M'
  }
  if (Math.abs(value) >= 1000) {
    return (value / 1000).toFixed(decimals) + 'K'
  }
  return value.toFixed(decimals)
}

/**
 * Interpolate between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} progress - Progress (0-1)
 * @returns {number} - Interpolated value
 */
export function interpolate(start, end, progress) {
  return start + (end - start) * progress
}