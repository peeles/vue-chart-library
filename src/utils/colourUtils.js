/**
 * Default color palette for charts (WCAG AA compliant)
 * @type {string[]}
 * @constant
 */
export const DEFAULT_COLORS = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#10b981', // green
    '#f59e0b', // orange
    '#ef4444', // red
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange-red
    '#a855f7' // violet
]

/**
 * Get color from palette by index with wraparound
 * @param {number} index - Color index (will wrap around if exceeds palette length)
 * @param {string[]} [palette=DEFAULT_COLORS] - Optional custom color palette
 * @returns {string} Color value (hex, rgb, or rgba)
 * @example
 * getColorByIndex(0) // Returns: "#3b82f6"
 * getColorByIndex(15, DEFAULT_COLORS) // Wraps around: DEFAULT_COLORS[5]
 */
export function getColorByIndex(index, palette = DEFAULT_COLORS) {
    return palette[index % palette.length]
}

/**
 * Generate color palette for datasets
 * @param {number} count - Number of colors needed
 * @param {string[]|null} [customPalette=null] - Optional custom color palette
 * @returns {string[]} Array of color values
 * @example
 * const colors = generateColorPalette(3)
 * // Returns: ["#3b82f6", "#8b5cf6", "#10b981"]
 */
export function generateColorPalette(count, customPalette = null) {
    const palette = customPalette || DEFAULT_COLORS
    const colors = []

    for (let i = 0; i < count; i++) {
        colors.push(getColorByIndex(i, palette))
    }

    return colors
}

/**
 * Convert hex color to RGB object
 * @param {string} hex - Hex color value (with or without #)
 * @returns {import('../types.js').RGBColor|null} RGB object {r, g, b} or null if invalid
 * @example
 * hexToRgb("#3b82f6") // Returns: { r: 59, g: 130, b: 246 }
 * hexToRgb("3b82f6") // Returns: { r: 59, g: 130, b: 246 }
 * hexToRgb("invalid") // Returns: null
 */
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : null
}

/**
 * Convert RGB values to hex color string
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color value with # prefix
 * @example
 * rgbToHex(59, 130, 246) // Returns: "#3b82f6"
 * rgbToHex(255, 0, 0) // Returns: "#ff0000"
 */
export function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')
}

/**
 * Add alpha (transparency) channel to color
 * @param {string} color - Color value (hex, rgb, or rgba)
 * @param {number} alpha - Alpha value (0-1, where 0=transparent, 1=opaque)
 * @returns {string} RGBA color string
 * @example
 * addAlpha("#3b82f6", 0.5) // Returns: "rgba(59, 130, 246, 0.5)"
 * addAlpha("rgb(59, 130, 246)", 0.3) // Returns: "rgba(59, 130, 246, 0.3)"
 */
export function addAlpha(color, alpha) {
    if (color.startsWith('#')) {
        const rgb = hexToRgb(color)
        if (!rgb) return color
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
    }

    if (color.startsWith('rgb(')) {
        return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
    }

    return color
}

/**
 * Lighten a color by percentage
 * @param {string} color - Hex color value
 * @param {number} percent - Percentage to lighten (0-100, where 50=significantly lighter)
 * @returns {string} Lightened hex color value
 * @example
 * lightenColor("#3b82f6", 20) // Returns: lighter blue
 * lightenColor("#000000", 50) // Returns: "#7f7f7f" (gray)
 */
export function lightenColor(color, percent) {
    const rgb = hexToRgb(color)
    if (!rgb) return color

    const amount = Math.round(2.55 * percent)
    const r = Math.min(255, rgb.r + amount)
    const g = Math.min(255, rgb.g + amount)
    const b = Math.min(255, rgb.b + amount)

    return rgbToHex(r, g, b)
}

/**
 * Darken a color by percentage
 * @param {string} color - Hex color value
 * @param {number} percent - Percentage to darken (0-100, where 50=significantly darker)
 * @returns {string} Darkened hex color value
 * @example
 * darkenColor("#3b82f6", 20) // Returns: darker blue
 * darkenColor("#ffffff", 50) // Returns: "#808080" (gray)
 */
export function darkenColor(color, percent) {
    const rgb = hexToRgb(color)
    if (!rgb) return color

    const amount = Math.round(2.55 * percent)
    const r = Math.max(0, rgb.r - amount)
    const g = Math.max(0, rgb.g - amount)
    const b = Math.max(0, rgb.b - amount)

    return rgbToHex(r, g, b)
}

/**
 * Get contrasting text color (black or white) for background color
 * Uses relative luminance calculation for WCAG compliance
 * @param {string} backgroundColor - Background color (hex format)
 * @returns {string} '#000000' for light backgrounds, '#ffffff' for dark backgrounds
 * @example
 * getContrastColor("#ffffff") // Returns: "#000000" (black text on white)
 * getContrastColor("#000000") // Returns: "#ffffff" (white text on black)
 * getContrastColor("#3b82f6") // Returns: "#ffffff" (white text on blue)
 */
export function getContrastColor(backgroundColor) {
    const rgb = hexToRgb(backgroundColor)
    if (!rgb) return '#000000'

    // Calculate relative luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255

    return luminance > 0.5 ? '#000000' : '#ffffff'
}