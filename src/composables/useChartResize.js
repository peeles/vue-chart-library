import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Debounce function for resize events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 16) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Composable for handling chart resize
 * @param {Object} containerRef - Ref to container element
 * @param {Function} callback - Optional callback when resize occurs
 * @returns {Object} - {width, height}
 */
export function useChartResize(containerRef, callback = null) {
  const width = ref(0)
  const height = ref(0)
  let resizeObserver = null
  let rafId = null

  const updateDimensions = () => {
    // Cancel any pending animation frame
    if (rafId) {
      cancelAnimationFrame(rafId)
    }

    // Use requestAnimationFrame for smooth updates
    rafId = requestAnimationFrame(() => {
      if (containerRef.value) {
        const rect = containerRef.value.getBoundingClientRect()
        width.value = Math.floor(rect.width)
        height.value = Math.floor(rect.height)

        if (callback) {
          callback({ width: width.value, height: height.value })
        }
      }
    })
  }

  const debouncedUpdate = debounce(updateDimensions, 16)

  onMounted(() => {
    updateDimensions()

    // Use ResizeObserver for better performance
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        // Use the more efficient contentRect
        for (const entry of entries) {
          if (entry.target === containerRef.value) {
            debouncedUpdate()
          }
        }
      })

      if (containerRef.value) {
        resizeObserver.observe(containerRef.value)
      }
    } else {
      // Fallback to window resize event
      window.addEventListener('resize', debouncedUpdate)
    }
  })

  onUnmounted(() => {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    if (resizeObserver) {
      resizeObserver.disconnect()
    } else {
      window.removeEventListener('resize', debouncedUpdate)
    }
  })

  return {
    width,
    height,
    updateDimensions
  }
}