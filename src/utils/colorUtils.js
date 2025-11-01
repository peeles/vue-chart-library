/**
 * Default color palette for charts
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
 * Get color from palette by index
 * @param {number} index - Color index
 * @param {Array<string>} palette - Optional custom palette
 * @returns {string} - Color value
 */
export function getColorByIndex(index, palette = DEFAULT_COLORS) {
  return palette[index % palette.length]
}

/**
 * Generate color palette for datasets
 * @param {number} count - Number of colors needed
 * @param {Array<string>} customPalette - Optional custom palette
 * @returns {Array<string>} - Array of colors
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
 * @param {string} hex - Hex color value
 * @returns {Object} - RGB object {r, g, b}
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
 * Convert RGB to hex color
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} - Hex color value
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * Add alpha channel to color
 * @param {string} color - Color value (hex or rgb)
 * @param {number} alpha - Alpha value (0-1)
 * @returns {string} - RGBA color value
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
 * @param {number} percent - Percentage to lighten (0-100)
 * @returns {string} - Lightened hex color
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
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} - Darkened hex color
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
 * Get contrasting text color (black or white) for background
 * @param {string} backgroundColor - Background color (hex)
 * @returns {string} - '#000000' or '#ffffff'
 */
export function getContrastColor(backgroundColor) {
  const rgb = hexToRgb(backgroundColor)
  if (!rgb) return '#000000'

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255

  return luminance > 0.5 ? '#000000' : '#ffffff'
}