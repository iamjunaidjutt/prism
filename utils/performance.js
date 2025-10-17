// Performance monitoring utilities for production

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observer = null;
    this.animationMonitor = {
      startTime: 0,
      frameCount: 0,
      lowFpsCount: 0,
    };
    
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      this.initObservers();
    }
  }

  initObservers() {
    try {
      // Observe Core Web Vitals
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      // Observe different types of performance entries
      this.observer.observe({ entryTypes: ["navigation", "paint", "largest-contentful-paint", "layout-shift", "first-input"] });
    } catch (error) {
      console.warn("Performance monitoring not supported:", error);
    }
  }

  handlePerformanceEntry(entry) {
    switch (entry.entryType) {
      case "navigation":
        const navEntry = entry;
        this.metrics.loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
        break;

      case "paint":
        const paintEntry = entry;
        if (paintEntry.name === "first-contentful-paint") {
          this.metrics.firstContentfulPaint = paintEntry.startTime;
        }
        break;

      case "largest-contentful-paint":
        const lcpEntry = entry;
        this.metrics.largestContentfulPaint = lcpEntry.startTime;
        break;

      case "layout-shift":
        const clsEntry = entry;
        if (!clsEntry.hadRecentInput) {
          this.metrics.cumulativeLayoutShift = (this.metrics.cumulativeLayoutShift || 0) + clsEntry.value;
        }
        break;

      case "first-input":
        const fidEntry = entry;
        this.metrics.firstInputDelay = fidEntry.processingStart - fidEntry.startTime;
        break;
    }
  }

  // Animation performance monitoring
  startAnimationMonitoring() {
    this.animationMonitor.startTime = performance.now();
    this.animationMonitor.frameCount = 0;
    this.animationMonitor.lowFpsCount = 0;
  }

  recordAnimationFrame(onPerformanceIssue) {
    this.animationMonitor.frameCount++;
    const now = performance.now();
    const elapsed = now - this.animationMonitor.startTime;
    
    if (elapsed > 1000) { // Every second
      const fps = Math.round((this.animationMonitor.frameCount * 1000) / elapsed);
      
      if (fps < 30) {
        this.animationMonitor.lowFpsCount++;
        console.warn(`Animation Low FPS: ${fps}, count: ${this.animationMonitor.lowFpsCount}`);
        
        // If we've had low FPS for 3 consecutive seconds, trigger performance adjustment
        if (this.animationMonitor.lowFpsCount >= 3 && onPerformanceIssue) {
          onPerformanceIssue();
          this.animationMonitor.lowFpsCount = 0; // Reset counter
        }
      } else {
        this.animationMonitor.lowFpsCount = 0; // Reset counter on good performance
      }
      
      this.animationMonitor.startTime = now;
      this.animationMonitor.frameCount = 0;
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }

  logMetrics() {
    const metrics = this.getMetrics();
    
    if (process.env.NODE_ENV === "development") {
      console.group("🚀 Performance Metrics");
      console.log("Load Time:", metrics.loadTime?.toFixed(2) + "ms");
      console.log("First Contentful Paint:", metrics.firstContentfulPaint?.toFixed(2) + "ms");
      console.log("Largest Contentful Paint:", metrics.largestContentfulPaint?.toFixed(2) + "ms");
      console.log("Cumulative Layout Shift:", metrics.cumulativeLayoutShift?.toFixed(4));
      console.log("First Input Delay:", metrics.firstInputDelay?.toFixed(2) + "ms");
      console.groupEnd();
    }

    // In production, send to analytics service
    if (process.env.NODE_ENV === "production") {
      this.sendToAnalytics(metrics);
    }
  }

  sendToAnalytics(metrics) {
    // Example: Send to Google Analytics or other analytics service
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "performance_metrics", {
        load_time: metrics.loadTime,
        first_contentful_paint: metrics.firstContentfulPaint,
        largest_contentful_paint: metrics.largestContentfulPaint,
        cumulative_layout_shift: metrics.cumulativeLayoutShift,
        first_input_delay: metrics.firstInputDelay,
      });
    }
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// Singleton instance
let performanceMonitor = null;

export const initPerformanceMonitoring = () => {
  if (typeof window !== "undefined" && !performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
    
    // Log metrics after page load
    window.addEventListener("load", () => {
      setTimeout(() => {
        performanceMonitor?.logMetrics();
      }, 1000);
    });
  }
  
  return performanceMonitor;
};

export const getPerformanceMetrics = () => {
  return performanceMonitor?.getMetrics() || {};
};

export const destroyPerformanceMonitoring = () => {
  if (performanceMonitor) {
    performanceMonitor.destroy();
    performanceMonitor = null;
  }
};

// Animation performance utilities
export const animationPerformanceMonitor = {
  start: () => performanceMonitor?.startAnimationMonitoring(),
  frame: (callback) => performanceMonitor?.recordAnimationFrame(callback)
};

// Easing functions for animations
export const easingFunctions = {
  linear: (t) => t,
  easeInExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInCubic: (t) => t * t * t,
};

// Utility function to tween values with easing
export function tweenValue(start, end, progress, ease = "linear") {
  const delta = end - start;
  const easeFn = easingFunctions[ease];
  return start + delta * easeFn(progress);
}

// Measures frame time and logs warnings for slow frames
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

// Web Vitals helper functions
export const getWebVitals = () => {
  const metrics = getPerformanceMetrics();
  
  return {
    FCP: metrics.firstContentfulPaint, // First Contentful Paint
    LCP: metrics.largestContentfulPaint, // Largest Contentful Paint
    CLS: metrics.cumulativeLayoutShift, // Cumulative Layout Shift
    FID: metrics.firstInputDelay, // First Input Delay
    loadTime: metrics.loadTime,
  };
};

// Performance warning thresholds
export const PERFORMANCE_THRESHOLDS = {
  FCP: 1800, // 1.8s
  LCP: 2500, // 2.5s
  CLS: 0.1, // 0.1
  FID: 100, // 100ms
  loadTime: 3000, // 3s
};

export const checkPerformanceWarnings = () => {
  const vitals = getWebVitals();
  const warnings = [];

  if (vitals.FCP && vitals.FCP > PERFORMANCE_THRESHOLDS.FCP) {
    warnings.push(`First Contentful Paint is slow: ${vitals.FCP.toFixed(2)}ms`);
  }

  if (vitals.LCP && vitals.LCP > PERFORMANCE_THRESHOLDS.LCP) {
    warnings.push(`Largest Contentful Paint is slow: ${vitals.LCP.toFixed(2)}ms`);
  }

  if (vitals.CLS && vitals.CLS > PERFORMANCE_THRESHOLDS.CLS) {
    warnings.push(`Cumulative Layout Shift is high: ${vitals.CLS.toFixed(4)}`);
  }

  if (vitals.FID && vitals.FID > PERFORMANCE_THRESHOLDS.FID) {
    warnings.push(`First Input Delay is high: ${vitals.FID.toFixed(2)}ms`);
  }

  if (vitals.loadTime && vitals.loadTime > PERFORMANCE_THRESHOLDS.loadTime) {
    warnings.push(`Load time is slow: ${vitals.loadTime.toFixed(2)}ms`);
  }

  return warnings;
};
