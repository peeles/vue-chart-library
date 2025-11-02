import { ref, computed } from 'vue'
import { throttle } from '@/utils/performance.js'

/**
 * Composable for managing range selector state and interactions
 * Handles drag, touch, and keyboard interactions for range selection
 * @param {{
 *   initialStart?: number,
 *   initialEnd?: number,
 *   minWidth?: number,
 *   onChange?: (range: {start: number, end: number}) => void
 * }} [options={}] - Configuration options
 * @param {number} [options.initialStart=0] - Initial start percentage (0-100)
 * @param {number} [options.initialEnd=100] - Initial end percentage (0-100)
 * @param {number} [options.minWidth=5] - Minimum range width percentage
 * @param {(range: {start: number, end: number}) => void} [options.onChange=null] - Callback when range changes
 * @returns {{
 *   rangeStart: import('vue').Ref<number>,
 *   rangeEnd: import('vue').Ref<number>,
 *   isDragging: import('vue').Ref<boolean>,
 *   rangeWindowStyle: import('vue').ComputedRef<{left: string, width: string}>,
 *   startDrag: (type: 'start'|'end', event: MouseEvent|TouchEvent) => void,
 *   handleKeydown: (event: KeyboardEvent, type: 'start'|'end') => void,
 *   resetRange: () => void
 * }} Range selector state and interaction handlers
 * @example
 * const { rangeStart, rangeEnd, startDrag, handleKeydown } = useRangeSelector({
 *   initialStart: 0,
 *   initialEnd: 100,
 *   onChange: (range) => console.log(range)
 * })
 */
export function useRangeSelector(options = {}) {
    const {
        initialStart = 0,
        initialEnd = 100,
        minWidth = 5,
        onChange = null
    } = options

    // State
    const rangeStart = ref(initialStart)
    const rangeEnd = ref(initialEnd)
    const isDragging = ref(false)
    const dragType = ref(null)
    const dragStartX = ref(0)
    const dragStartValue = ref(0)
    const dragContainerRect = ref(null)

    // Throttled change callback
    const emitChange = onChange ? throttle(() => {
        onChange({
            start: rangeStart.value,
            end: rangeEnd.value
        })
    }, 16) : null // ~60fps

    // Computed style for range window
    const rangeWindowStyle = computed(() => ({
        left: `${rangeStart.value}%`,
        width: `${rangeEnd.value - rangeStart.value}%`
    }))

    /**
     * Get client X position from mouse or touch event
     */
    function getClientX(event) {
        return event.clientX || event.touches?.[0]?.clientX || 0
    }

    /**
     * Start dragging a range handle
     */
    function startDrag(type, event) {
        event.preventDefault()

        isDragging.value = true
        dragType.value = type
        dragStartX.value = getClientX(event)
        dragStartValue.value = type === 'start' ? rangeStart.value : rangeEnd.value

        // Cache the container and its bounding rect for better performance during drag
        const container = event.target.closest('[data-range-overlay]')?.parentElement ||
                         event.target.closest('[data-range-selector]')
        if (container) {
            dragContainerRect.value = container.getBoundingClientRect()
        }

        // Add visual feedback
        document.body.style.cursor = 'ew-resize'
        document.body.style.userSelect = 'none'

        // Listen for both mouse and touch events
        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('touchmove', handleDrag, { passive: false })
        document.addEventListener('mouseup', stopDrag)
        document.addEventListener('touchend', stopDrag)
    }

    /**
     * Handle drag movement
     */
    function handleDrag(event) {
        if (!isDragging.value || !dragContainerRect.value) return

        event.preventDefault()

        const clientX = getClientX(event)
        const deltaX = clientX - dragStartX.value
        const deltaPercent = (deltaX / dragContainerRect.value.width) * 100

        if (dragType.value === 'start') {
            rangeStart.value = Math.max(0, Math.min(rangeEnd.value - minWidth, dragStartValue.value + deltaPercent))
        } else if (dragType.value === 'end') {
            rangeEnd.value = Math.min(100, Math.max(rangeStart.value + minWidth, dragStartValue.value + deltaPercent))
        }

        if (emitChange) {
            emitChange()
        }
    }

    /**
     * Stop dragging
     */
    function stopDrag() {
        isDragging.value = false
        dragType.value = null
        dragContainerRect.value = null

        // Remove visual feedback
        document.body.style.cursor = ''
        document.body.style.userSelect = ''

        // Remove event listeners
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('touchmove', handleDrag)
        document.removeEventListener('mouseup', stopDrag)
        document.removeEventListener('touchend', stopDrag)
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeydown(event, type) {
        const step = event.shiftKey ? 10 : 1
        let updated = false

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault()
                if (type === 'start') {
                    rangeStart.value = Math.max(0, rangeStart.value - step)
                } else {
                    rangeEnd.value = Math.max(rangeStart.value + minWidth, rangeEnd.value - step)
                }
                updated = true
                break

            case 'ArrowRight':
                event.preventDefault()
                if (type === 'start') {
                    rangeStart.value = Math.min(rangeEnd.value - minWidth, rangeStart.value + step)
                } else {
                    rangeEnd.value = Math.min(100, rangeEnd.value + step)
                }
                updated = true
                break

            case 'Home':
                event.preventDefault()
                if (type === 'start') {
                    rangeStart.value = 0
                } else {
                    rangeEnd.value = rangeStart.value + minWidth
                }
                updated = true
                break

            case 'End':
                event.preventDefault()
                if (type === 'start') {
                    rangeStart.value = rangeEnd.value - minWidth
                } else {
                    rangeEnd.value = 100
                }
                updated = true
                break
        }

        if (updated && onChange) {
            onChange({
                start: rangeStart.value,
                end: rangeEnd.value
            })
        }
    }

    /**
     * Reset range to full view
     */
    function resetRange() {
        rangeStart.value = initialStart
        rangeEnd.value = initialEnd

        if (onChange) {
            onChange({
                start: rangeStart.value,
                end: rangeEnd.value
            })
        }
    }

    return {
        rangeStart,
        rangeEnd,
        isDragging,
        rangeWindowStyle,
        startDrag,
        handleKeydown,
        resetRange
    }
}
