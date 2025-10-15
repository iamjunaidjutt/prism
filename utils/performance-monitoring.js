/**
 * Performance Monitoring Utility
 * Provides consistent performance monitoring across all components
 */

/**
 * Performance monitor for tracking FPS and frame times
 */
export const performanceMonitor = {
  startTime: 0,
  frameCount: 0,
  lowFpsCount: 0,
  
  /**
   * Starts performance monitoring
   */
  start: () => {
    performanceMonitor.startTime = performance.now();
    performanceMonitor.frameCount = 0;
    performanceMonitor.lowFpsCount = 0;
  },
  
  /**
   * Records a frame and checks performance
   * @param {Function} onPerformanceIssue - Callback when performance issues are detected
   */
  frame: (onPerformanceIssue) => {
    performanceMonitor.frameCount++;
    const now = performance.now();
    const elapsed = now - performanceMonitor.startTime;
    
    if (elapsed > 1000) { // Every second
      const fps = Math.round((performanceMonitor.frameCount * 1000) / elapsed);
      
      if (fps < 30) {
        performanceMonitor.lowFpsCount++;
        console.warn(`Animation Low FPS: ${fps}, count: ${performanceMonitor.lowFpsCount}`);
        
        // If we've had low FPS for 3 consecutive seconds, trigger performance adjustment
        if (performanceMonitor.lowFpsCount >= 3 && onPerformanceIssue) {
          onPerformanceIssue();
          performanceMonitor.lowFpsCount = 0; // Reset counter
        }
      } else {
        performanceMonitor.lowFpsCount = 0; // Reset counter on good performance
      }
      
      performanceMonitor.startTime = now;
      performanceMonitor.frameCount = 0;
    }
  }
};

/**
 * Easing functions for animations
 */
export const easingFunctions = {
  linear: (t) => t,
  easeInExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInCubic: (t) => t * t * t,
};

/**
 * Utility function to tween values with easing
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} progress - Progress (0-1)
 * @param {string} ease - Easing function name
 * @returns {number} Tweened value
 */
export function tweenValue(start, end, progress, ease = "linear") {
  const delta = end - start;
  const easeFn = easingFunctions[ease];
  return start + delta * easeFn(progress);
}

/**
 * Measures frame time and logs warnings for slow frames
 * @param {Function} frameFunction - The function to measure
 * @returns {Function} Wrapped function with performance monitoring
 */
export function measureFrameTime(frameFunction) {
  return (...args) => {
    const startTime = performance.now();
    const result = frameFunction(...args);
    const endTime = performance.now();
    const frameTime = endTime - startTime;
    
    if (frameTime > 16) {
      console.warn(`Frame performance issue: ${frameTime.toFixed(2)}ms per frame`);
    }
    
    return result;
  };
}
