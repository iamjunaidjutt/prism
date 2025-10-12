/**
 * Utility for loading shader files dynamically
 * This helps reduce the main bundle size by loading shaders on-demand
 */

export async function loadShader(url: string): Promise<string> {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('Shader loading only available in browser environment');
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load shader: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading shader from ${url}:`, error);
    throw error;
  }
}

export async function loadShaders(): Promise<{ vertex: string; fragment: string }> {
  try {
    const [vertexShader, fragmentShader] = await Promise.all([
      loadShader('/shaders/vertex.glsl'),
      loadShader('/shaders/fragment.glsl')
    ]);
    
    return {
      vertex: vertexShader,
      fragment: fragmentShader
    };
  } catch (error) {
    console.error('Failed to load shaders:', error);
    // Fallback to inline shaders if loading fails
    return {
      vertex: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        uniform sampler2D uTexture1;
        uniform sampler2D uTexture2;
        uniform float uProgress;
        varying vec2 vUv;
        
        void main() {
          vec4 img1 = texture2D(uTexture1, vUv);
          vec4 img2 = texture2D(uTexture2, vUv);
          gl_FragColor = mix(img1, img2, uProgress);
        }
      `
    };
  }
}
