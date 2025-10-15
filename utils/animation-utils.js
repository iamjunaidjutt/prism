/**
 * Animation Utilities
 * Provides shared animation helpers and constants
 */

/**
 * Common animation durations based on device capability
 */
export const ANIMATION_DURATIONS = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.0,
  verySlow: 1.5
};

/**
 * Common animation delays based on device capability
 */
export const ANIMATION_DELAYS = {
  immediate: 0,
  short: 0.1,
  medium: 0.2,
  long: 0.5
};

/**
 * Common stagger delays based on device capability
 */
export const STAGGER_DELAYS = {
  fast: 0.02,
  normal: 0.05,
  slow: 0.1,
  verySlow: 0.15
};

/**
 * Common blur intensities based on device capability
 */
export const BLUR_INTENSITIES = {
  none: 0,
  light: 2,
  medium: 4,
  heavy: 8
};

/**
 * Creates a blur filter string based on intensity and capability
 * @param {number} intensity - Base blur intensity
 * @param {number} capabilityMultiplier - Device capability multiplier (0-1)
 * @returns {string} CSS blur filter string
 */
export function createBlurFilter(intensity, capabilityMultiplier = 1) {
  const actualIntensity = intensity * capabilityMultiplier;
  return actualIntensity > 0 ? `blur(${actualIntensity}px)` : 'blur(0px)';
}

/**
 * Creates animation properties with device-based optimization
 * @param {Object} baseProps - Base animation properties
 * @param {Object} deviceSettings - Device-specific settings
 * @returns {Object} Optimized animation properties
 */
export function createOptimizedAnimationProps(baseProps, deviceSettings) {
  return {
    ...baseProps,
    duration: baseProps.duration * deviceSettings.durationMultiplier,
    stagger: baseProps.stagger * deviceSettings.staggerMultiplier,
    ease: baseProps.ease || "power2.out"
  };
}

/**
 * Common GSAP easing functions
 */
export const GSAP_EASING = {
  power2Out: "power2.out",
  power2In: "power2.in",
  power3Out: "power3.out",
  power3In: "power3.in",
  backOut: "back.out(1.7)",
  sineInOut: "sine.inOut",
  cubicBezier: "cubic-bezier(0.77,0,0.18,1)"
};

/**
 * Creates a timeline with device-optimized settings
 * @param {Object} options - Timeline options
 * @param {Object} deviceSettings - Device-specific settings
 * @returns {Object} GSAP timeline options
 */
export function createOptimizedTimeline(options = {}, deviceSettings) {
  return {
    delay: (options.delay || 0) * deviceSettings.delayMultiplier,
    ...options
  };
}
