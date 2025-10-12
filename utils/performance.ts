// Performance monitoring utilities for production

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  totalBlockingTime: number;
  longTasks: Array<{
    duration: number;
    startTime: number;
    name: string;
  }>;
  timeToInteractive: number;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observer: PerformanceObserver | null = null;
  private longTaskObserver: PerformanceObserver | null = null;
  private longTasks: Array<{ duration: number; startTime: number; name: string }> = [];
  private totalBlockingTime: number = 0;
  private fcpTime: number = 0;

  constructor() {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      this.initObservers();
      this.initLongTaskObserver();
    }
  }

  private initObservers() {
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

  private initLongTaskObserver() {
    try {
      // Observe Long Tasks for TBT calculation
      this.longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handleLongTask(entry as any);
        }
      });

      this.longTaskObserver.observe({ entryTypes: ["longtask"] });
    } catch (error) {
      console.warn("Long Task monitoring not supported:", error);
    }
  }

  private handleLongTask(entry: any) {
    const longTask = {
      duration: entry.duration,
      startTime: entry.startTime,
      name: entry.name || 'unknown'
    };

    this.longTasks.push(longTask);

    // Calculate TBT: sum of all long tasks that occur between FCP and TTI
    if (this.fcpTime > 0 && entry.startTime >= this.fcpTime) {
      const blockingTime = Math.max(0, entry.duration - 50); // Tasks > 50ms are blocking
      this.totalBlockingTime += blockingTime;
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case "navigation":
        const navEntry = entry as PerformanceNavigationTiming;
        this.metrics.loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
        break;

      case "paint":
        const paintEntry = entry as PerformancePaintTiming;
        if (paintEntry.name === "first-contentful-paint") {
          this.metrics.firstContentfulPaint = paintEntry.startTime;
          this.fcpTime = paintEntry.startTime;
        }
        break;

      case "largest-contentful-paint":
        const lcpEntry = entry as any;
        this.metrics.largestContentfulPaint = lcpEntry.startTime;
        break;

      case "layout-shift":
        const clsEntry = entry as any;
        if (!clsEntry.hadRecentInput) {
          this.metrics.cumulativeLayoutShift = (this.metrics.cumulativeLayoutShift || 0) + clsEntry.value;
        }
        break;

      case "first-input":
        const fidEntry = entry as any;
        this.metrics.firstInputDelay = fidEntry.processingStart - fidEntry.startTime;
        break;
    }
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { 
      ...this.metrics,
      totalBlockingTime: this.totalBlockingTime,
      longTasks: this.longTasks,
      timeToInteractive: this.calculateTTI()
    };
  }

  private calculateTTI(): number {
    // Simplified TTI calculation: FCP + TBT + 100ms buffer
    if (this.fcpTime > 0) {
      return this.fcpTime + this.totalBlockingTime + 100;
    }
    return 0;
  }

  public logMetrics() {
    const metrics = this.getMetrics();
    
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      console.group("🚀 Performance Metrics");
      console.log("Load Time:", metrics.loadTime?.toFixed(2) + "ms");
      console.log("First Contentful Paint:", metrics.firstContentfulPaint?.toFixed(2) + "ms");
      console.log("Largest Contentful Paint:", metrics.largestContentfulPaint?.toFixed(2) + "ms");
      console.log("Cumulative Layout Shift:", metrics.cumulativeLayoutShift?.toFixed(4));
      console.log("First Input Delay:", metrics.firstInputDelay?.toFixed(2) + "ms");
      console.log("Total Blocking Time:", metrics.totalBlockingTime?.toFixed(2) + "ms");
      console.log("Time to Interactive:", metrics.timeToInteractive?.toFixed(2) + "ms");
      console.log("Long Tasks:", metrics.longTasks?.length || 0);
      
      if (metrics.longTasks && metrics.longTasks.length > 0) {
        console.group("Long Tasks Details");
        metrics.longTasks.forEach((task, index) => {
          console.log(`${index + 1}. ${task.name}: ${task.duration.toFixed(2)}ms at ${task.startTime.toFixed(2)}ms`);
        });
        console.groupEnd();
      }
      console.groupEnd();
    }

    // In production, send to analytics service
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      this.sendToAnalytics(metrics);
    }
  }

  private sendToAnalytics(metrics: Partial<PerformanceMetrics>) {
    // Example: Send to Google Analytics or other analytics service
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "performance_metrics", {
        load_time: metrics.loadTime,
        first_contentful_paint: metrics.firstContentfulPaint,
        largest_contentful_paint: metrics.largestContentfulPaint,
        cumulative_layout_shift: metrics.cumulativeLayoutShift,
        first_input_delay: metrics.firstInputDelay,
        total_blocking_time: metrics.totalBlockingTime,
        time_to_interactive: metrics.timeToInteractive,
        long_tasks_count: metrics.longTasks?.length || 0,
      });
    }
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.longTaskObserver) {
      this.longTaskObserver.disconnect();
      this.longTaskObserver = null;
    }
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

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

// Web Vitals helper functions
export const getWebVitals = () => {
  const metrics = getPerformanceMetrics();
  
  return {
    FCP: metrics.firstContentfulPaint, // First Contentful Paint
    LCP: metrics.largestContentfulPaint, // Largest Contentful Paint
    CLS: metrics.cumulativeLayoutShift, // Cumulative Layout Shift
    FID: metrics.firstInputDelay, // First Input Delay
    TBT: metrics.totalBlockingTime, // Total Blocking Time
    TTI: metrics.timeToInteractive, // Time to Interactive
    loadTime: metrics.loadTime,
    longTasks: metrics.longTasks,
  };
};

// Performance warning thresholds
export const PERFORMANCE_THRESHOLDS = {
  FCP: 1800, // 1.8s
  LCP: 2500, // 2.5s
  CLS: 0.1, // 0.1
  FID: 100, // 100ms
  TBT: 200, // 200ms
  TTI: 3800, // 3.8s
  loadTime: 3000, // 3s
};

export const checkPerformanceWarnings = () => {
  const vitals = getWebVitals();
  const warnings: string[] = [];

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

  if (vitals.TBT && vitals.TBT > PERFORMANCE_THRESHOLDS.TBT) {
    warnings.push(`Total Blocking Time is high: ${vitals.TBT.toFixed(2)}ms`);
  }

  if (vitals.TTI && vitals.TTI > PERFORMANCE_THRESHOLDS.TTI) {
    warnings.push(`Time to Interactive is slow: ${vitals.TTI.toFixed(2)}ms`);
  }

  if (vitals.loadTime && vitals.loadTime > PERFORMANCE_THRESHOLDS.loadTime) {
    warnings.push(`Load time is slow: ${vitals.loadTime.toFixed(2)}ms`);
  }

  if (vitals.longTasks && vitals.longTasks.length > 5) {
    warnings.push(`Too many long tasks detected: ${vitals.longTasks.length}`);
  }

  return warnings;
};
