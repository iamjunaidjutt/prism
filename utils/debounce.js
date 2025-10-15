/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} The debounced function
 */
export function debounce(func, wait) {
  let timeout;
  
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  
  debounced.cancel = () => clearTimeout(timeout);
  
  return debounced;
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @returns {Function} The throttled function
 */
export function throttle(func, wait) {
  let timeout;
  let previous = 0;
  
  const throttled = (...args) => {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
  
  throttled.cancel = () => {
    clearTimeout(timeout);
    timeout = null;
  };
  
  return throttled;
}
