/**
 * Throttle a function to limit how often it can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time in milliseconds between calls
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit) {
    let inThrottle
    let lastResult

    return function (...args) {
        if (!inThrottle) {
            lastResult = func.apply(this, args)
            inThrottle = true

            setTimeout(() => {
                inThrottle = false
            }, limit)
        }

        return lastResult
    }
}

/**
 * Debounce a function to delay execution until after wait time
 * @param {Function} func - Function to debounce
 * @param {number} wait - Time in milliseconds to wait
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
    let timeout

    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            func.apply(this, args)
        }, wait)
    }
}
