/**
 * Calculate min and max values from datasets
 * @param {import('../types.js').Dataset[]} datasets - Array of dataset objects
 * @returns {import('../types.js').DataRange} Object containing min and max values
 * @example
 * const range = getDataRange([{ data: [1, 2, 3] }, { data: [4, 5, 6] }])
 * // Returns: { min: 1, max: 6 }
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
 * Calculate nice scale range for axis with rounded values
 * @param {number} min - Minimum value from data
 * @param {number} max - Maximum value from data
 * @param {number} [ticks=5] - Desired number of ticks
 * @returns {import('../types.js').NiceScale} Object with nice min, max, step, and tick count
 * @example
 * const scale = calculateNiceScale(23, 87, 5)
 * // Returns: { min: 20, max: 90, step: 20, ticks: 4 }
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
 * Sums values at each index across all datasets
 * @param {import('../types.js').Dataset[]} datasets - Array of dataset objects
 * @returns {number[]} Array of stacked totals for each data point
 * @example
 * const stacked = calculateStackedValues([
 *   { data: [1, 2, 3] },
 *   { data: [4, 5, 6] }
 * ])
 * // Returns: [5, 7, 9]
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
 * @param {number[]} data - Array of numeric values
 * @returns {number[]} Array of percentages (0-100) corresponding to each value
 * @example
 * const percentages = calculatePercentages([10, 20, 30])
 * // Returns: [16.67, 33.33, 50]
 */
export function calculatePercentages(data) {
    const total = data.reduce((sum, value) => sum + value, 0)

    if (total === 0) {
        return data.map(() => 0)
    }

    return data.map(value => (value / total) * 100)
}

/**
 * Calculate pie slice angles and percentages
 * @param {number[]} data - Array of numeric values
 * @returns {import('../types.js').PieSlice[]} Array of pie slice objects with angles and percentages
 * @example
 * const slices = calculatePieSlices([25, 75])
 * // Returns: [
 * //   { startAngle: -90, endAngle: 0, percentage: 25, value: 25 },
 * //   { startAngle: 0, endAngle: 270, percentage: 75, value: 75 }
 * // ]
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
 * Convert polar coordinates to cartesian coordinates
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 * @param {number} radius - Radius from center
 * @param {number} angleInDegrees - Angle in degrees (0° = top, clockwise)
 * @returns {import('../types.js').Point} Cartesian coordinates {x, y}
 * @example
 * const point = polarToCartesian(100, 100, 50, 90)
 * // Returns: { x: 150, y: 100 }
 */
export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    }
}

/**
 * Create SVG path data string for pie slice
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 * @param {number} radius - Radius of the pie
 * @param {number} startAngle - Start angle in degrees
 * @param {number} endAngle - End angle in degrees
 * @returns {string} SVG path data string (M, L, A, Z commands)
 * @example
 * const path = describePieSlice(100, 100, 50, 0, 90)
 * // Returns: "M 100 100 L 150 100 A 50 50 0 0 0 100 50 Z"
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
 * Calculate bar width for bar charts based on available space
 * @param {number} chartWidth - Total chart width in pixels
 * @param {number} dataLength - Number of data points (bars)
 * @param {number} [padding=0.2] - Padding percentage between bars (0-1, where 0.2 = 20% gap)
 * @returns {number} Calculated bar width in pixels
 * @example
 * const barWidth = calculateBarWidth(400, 5, 0.2)
 * // Returns: 64 (400 / 5 * 0.8)
 */
export function calculateBarWidth(chartWidth, dataLength, padding = 0.2) {
    const availableWidth = chartWidth / dataLength
    return availableWidth * (1 - padding)
}

/**
 * Format number for display with K/M suffixes for large numbers
 * @param {number} value - Number to format
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted number string (e.g., "1.5K", "2.3M")
 * @example
 * formatNumber(1500) // Returns: "1.50K"
 * formatNumber(2500000, 1) // Returns: "2.5M"
 * formatNumber(42.5, 1) // Returns: "42.5"
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
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} progress - Progress from start to end (0-1, where 0=start, 1=end)
 * @returns {number} Interpolated value
 * @example
 * interpolate(0, 100, 0.5) // Returns: 50
 * interpolate(10, 20, 0.25) // Returns: 12.5
 */
export function interpolate(start, end, progress) {
    return start + (end - start) * progress
}
