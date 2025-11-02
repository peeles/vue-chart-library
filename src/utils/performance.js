/**
 * Throttle a function to limit how often it can be called
 * Ensures function executes at most once per specified time period
 * @template {(...args: any[]) => any} T
 * @param {T} func - Function to throttle
 * @param {number} limit - Minimum time in milliseconds between function calls
 * @returns {(...args: Parameters<T>) => ReturnType<T>|undefined} Throttled function that returns last result or undefined
 * @example
 * const throttledScroll = throttle((e) => console.log('scrolled', e), 100)
 * window.addEventListener('scroll', throttledScroll)
 * // Function will execute at most once every 100ms
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
 * Delays function execution until specified time has passed since last call
 * @template {(...args: any[]) => any} T
 * @param {T} func - Function to debounce
 * @param {number} wait - Time in milliseconds to wait before executing
 * @returns {(...args: Parameters<T>) => void} Debounced function (no return value)
 * @example
 * const debouncedSearch = debounce((query) => fetchResults(query), 300)
 * input.addEventListener('input', (e) => debouncedSearch(e.target.value))
 * // Function will execute 300ms after user stops typing
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
