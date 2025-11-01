import { computed } from 'vue'

/**
 * Default chart configuration
 */
const DEFAULT_CONFIG = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2,
  padding: {
    top: 20,
    right: 20,
    bottom: 40,
    left: 50
  },
  animation: {
    enabled: true,
    duration: 300
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: true,
        color: 'var(--chart-grid-color, #e5e7eb)'
      },
      ticks: {
        display: true,
        color: 'var(--chart-axis-color, #6b7280)'
      }
    },
    y: {
      display: true,
      beginAtZero: true,
      grid: {
        display: true,
        color: 'var(--chart-grid-color, #e5e7eb)'
      },
      ticks: {
        display: true,
        color: 'var(--chart-axis-color, #6b7280)'
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      enabled: true,
      mode: 'index'
    }
  }
}

/**
 * Deeply merge two objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} - Merged object
 */
function deepMerge(target, source) {
  const result = { ...target }

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }

  return result
}

/**
 * Composable for managing chart configuration
 * @param {Object} userOptions - User-provided options
 * @returns {Object} - Merged configuration and utilities
 */
export function useChartConfig(userOptions = {}) {
  /**
   * Merged configuration
   */
  const config = computed(() => {
    return deepMerge(DEFAULT_CONFIG, userOptions.value || {})
  })

  /**
   * Get responsive flag
   */
  const isResponsive = computed(() => {
    return config.value.responsive !== false
  })

  /**
   * Get maintain aspect ratio flag
   */
  const shouldMaintainAspectRatio = computed(() => {
    return config.value.maintainAspectRatio !== false
  })

  /**
   * Get aspect ratio
   */
  const aspectRatio = computed(() => {
    return config.value.aspectRatio || 2
  })

  /**
   * Get padding
   */
  const padding = computed(() => {
    return config.value.padding || DEFAULT_CONFIG.padding
  })

  /**
   * Get animation config
   */
  const animation = computed(() => {
    return config.value.animation || DEFAULT_CONFIG.animation
  })

  /**
   * Get scales config
   */
  const scales = computed(() => {
    return config.value.scales || DEFAULT_CONFIG.scales
  })

  /**
   * Get plugins config
   */
  const plugins = computed(() => {
    return config.value.plugins || DEFAULT_CONFIG.plugins
  })

  /**
   * Get legend display
   */
  const showLegend = computed(() => {
    return plugins.value.legend?.display !== false
  })

  /**
   * Get tooltip enabled
   */
  const showTooltip = computed(() => {
    return plugins.value.tooltip?.enabled !== false
  })

  /**
   * Calculate chart dimensions based on container and config
   * @param {number} containerWidth - Container width
   * @param {number} containerHeight - Container height
   * @returns {Object} - {width, height}
   */
  const calculateDimensions = (containerWidth, containerHeight) => {
    if (!isResponsive.value) {
      return {
        width: config.value.width || 600,
        height: config.value.height || 300
      }
    }

    const width = containerWidth
    let height = containerHeight

    if (shouldMaintainAspectRatio.value && containerWidth > 0) {
      height = containerWidth / aspectRatio.value
    }

    return { width, height }
  }

  /**
   * Calculate chart area (excluding padding)
   * @param {number} totalWidth - Total chart width
   * @param {number} totalHeight - Total chart height
   * @returns {Object} - {x, y, width, height}
   */
  const calculateChartArea = (totalWidth, totalHeight) => {
    const p = padding.value

    return {
      x: p.left,
      y: p.top,
      width: totalWidth - p.left - p.right,
      height: totalHeight - p.top - p.bottom
    }
  }

  return {
    config,
    isResponsive,
    shouldMaintainAspectRatio,
    aspectRatio,
    padding,
    animation,
    scales,
    plugins,
    showLegend,
    showTooltip,
    calculateDimensions,
    calculateChartArea
  }
}

export { DEFAULT_CONFIG }