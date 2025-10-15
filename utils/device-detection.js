/**
 * Device Capability Detection Utility
 * Provides consistent device capability assessment across all components
 */

/**
 * Detects device capability based on multiple factors
 * @returns {string} Device capability level: 'low', 'medium', or 'high'
 */
export function detectDeviceCapability() {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  
  // Check for hardware acceleration and memory
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const hasWebGL = !!gl;
  
  // Check device pixel ratio (higher usually means better GPU)
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Estimate device capability
  if (prefersReducedMotion || !hasWebGL) {
    return 'low';
  } else if (isMobile || pixelRatio < 1.5) {
    return 'low';
  } else if (isTablet || pixelRatio < 2) {
    return 'medium';
  } else {
    return 'high';
  }
}

/**
 * Gets device-specific animation settings
 * @param {string} capability - Device capability level
 * @returns {Object} Animation settings object
 */
export function getAnimationSettings(capability) {
  switch (capability) {
    case 'low':
      return { 
        blurIntensity: 0.2, 
        staggerDelay: 0.08, 
        duration: 0.5,
        enableBlur: false,
        enableComplexAnimations: false
      };
    case 'medium':
      return { 
        blurIntensity: 0.4, 
        staggerDelay: 0.05, 
        duration: 0.6,
        enableBlur: true,
        enableComplexAnimations: true
      };
    case 'high':
    default:
      return { 
        blurIntensity: 0.6, 
        staggerDelay: 0.03, 
        duration: 0.7,
        enableBlur: true,
        enableComplexAnimations: true
      };
  }
}

/**
 * Gets device-specific WebGL settings
 * @param {string} capability - Device capability level
 * @returns {Object} WebGL settings object
 */
export function getWebGLSettings(capability) {
  switch (capability) {
    case 'low':
      return { 
        pixelRatio: 1,
        antialias: false,
        maxTextureSize: 1024,
        shaderComplexity: 'low',
        effectIntensity: 0.5,
        textureQuality: 0.5
      };
    case 'medium':
      return { 
        pixelRatio: Math.min(window.devicePixelRatio, 1.5),
        antialias: false,
        maxTextureSize: 2048,
        shaderComplexity: 'medium',
        effectIntensity: 0.75,
        textureQuality: 0.75
      };
    case 'high':
    default:
      return { 
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        maxTextureSize: 4096,
        shaderComplexity: 'high',
        effectIntensity: 1.0,
        textureQuality: 1.0
      };
  }
}

/**
 * Gets device-specific particle counts for canvas animations
 * @param {string} capability - Device capability level
 * @returns {Object} Particle counts object
 */
export function getParticleCounts(capability) {
  switch (capability) {
    case 'low':
      return { particles: 150, lines: 50, discs: 10 };
    case 'medium':
      return { particles: 300, lines: 75, discs: 15 };
    case 'high':
    default:
      return { particles: 500, lines: 100, discs: 20 };
  }
}

/**
 * Gets device-specific animation speed multipliers
 * @param {string} capability - Device capability level
 * @returns {number} Speed multiplier
 */
export function getAnimationSpeedMultiplier(capability) {
  switch (capability) {
    case 'low':
      return 0.5;
    case 'medium':
      return 0.75;
    case 'high':
    default:
      return 1.0;
  }
}
