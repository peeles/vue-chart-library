import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Internal debounce function for resize events
 * @private
 * @param {Function} func - Function to debounce
 * @param {number} [wait=16] - Wait time in milliseconds (default ~60fps)
 * @returns {Function} Debounced function
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
 * Composable for handling chart container resize with ResizeObserver
 * Automatically tracks container dimensions and updates on resize with debouncing
 * @param {import('vue').Ref<HTMLElement|null>} containerRef - Ref to container element
 * @param {((dimensions: import('../types.js').Dimensions) => void)|null} [callback=null] - Optional callback when resize occurs
 * @returns {{
 *   width: import('vue').Ref<number>,
 *   height: import('vue').Ref<number>,
 *   updateDimensions: () => void
 * }} Object containing reactive width, height, and update function
 * @example
 * const container = ref(null)
 * const { width, height } = useChartResize(container, ({ width, height }) => {
 *   console.log('Resized to:', width, height)
 * })
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
