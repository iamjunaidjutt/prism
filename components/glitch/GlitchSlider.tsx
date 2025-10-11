"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import styles from "./glitch.module.scss";
import type * as THREE from "three";
import { slideData } from "@/utils/slides-data";
import Image from "next/image";

// Debounce utility for performance optimization
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout;
  
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  
  debounced.cancel = () => clearTimeout(timeout);
  
  return debounced as T & { cancel: () => void };
}

const GlitchSlider = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const initSlider = async () => {
      try {
        // Dynamic imports to avoid SSR issues
        const THREE = await import("three");
        const gsap = (await import("gsap")).default;
        const { ScrambleTextPlugin } = await import("gsap/ScrambleTextPlugin");

        // Register GSAP plugins
        gsap.registerPlugin(ScrambleTextPlugin);

        if (!containerRef.current) return;

      const slider = containerRef.current.querySelector(
        "[data-image-slider-init]",
      ) as HTMLElement;
      if (!slider) return;

      // Don't initialize slider immediately - wait for viewport
      // slider.classList.add(styles.loaded);

      // Image collection
      const imageCollection = [
        "/glitch/1.webp",
        "/glitch/2.webp",
        "/glitch/3.webp",
        "/glitch/4.webp",
        "/glitch/5.webp",
        "/glitch/6.webp",
        "/glitch/7.webp",
        "/glitch/8.webp",
        "/glitch/9.webp",
      ];

      // Configuration
      const config = {
        totalImages: imageCollection.length,
        transitionDuration: 1.8,
        scrollThrottleDelay: 1000,
        touchThreshold: 10,
        currentEffect: "datamosh",
        currentEffectPreset: "Default",
        globalIntensity: 1.0,
        speedMultiplier: 1.0,
        colorShiftAmount: 0.3,
        distortionStrength: 1.0,
        noiseLevel: 0.5,
        datamoshBlockSize: 1.0,
        datamoshCorruptionFreq: 1.0,
        datamoshQuantization: 1.0,
        datamoshDisplacement: 1.0,
        datamoshTemporal: 1.0,
        pixelSortDirection: 0.5,
        pixelSortThreshold: 1.0,
        pixelSortBandWidth: 1.0,
        pixelSortSeparation: 1.0,
        pixelSortSensitivity: 1.0,
        staticDensity: 1.0,
        staticWaveSpeed: 1.0,
        staticAnalogNoise: 1.0,
        staticChannelShift: 1.0,
        staticFlicker: 1.0,
        sweepWidth: 1.0,
        sweepLayers: 1.0,
        sweepChromaticAberration: 1.0,
        sweepEdgeGlow: 1.0,
        sweepFadeTiming: 1.0,
        wipeAngle: 0.0,
        wipeAberrationStrength: 1.0,
        wipeEdgeWidth: 1.0,
        wipeColorBleeding: 1.0,
        wipeTransitionCurve: 1.0,
        analogGrain: 1.0,
        analogBleeding: 1.0,
        analogVSync: 1.0,
        analogDropout: 1.0,
        analogScanlines: 1.0,
        analogVignette: 1.0,
        analogJitter: 1.0,
        analogChroma: 1.0,
      };

      // State
      const state = {
        currentImageIndex: 0,
        isTransitioning: false,
        scrollingEnabled: true,
        lastScrollTimestamp: 0,
        touchStartPosition: 0,
        isTouchActive: false,
        isActive: false,
        renderer: null as THREE.WebGLRenderer | null,
        scene: null as THREE.Scene | null,
        camera: null as THREE.OrthographicCamera | null,
        shaderMaterial: null as THREE.ShaderMaterial | null,
        slideTextures: [] as THREE.Texture[],
        texturesLoaded: false,
        startTime: Date.now(),
      };

      // Shaders (complete implementation with all 6 glitch effects)
      const vertexShader = `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`;

      const fragmentShader = `
				uniform sampler2D uTexture1;
				uniform sampler2D uTexture2;
				uniform float uProgress;
				uniform vec2 uResolution;
				uniform vec2 uTexture1Size;
				uniform vec2 uTexture2Size;
				uniform float uTime;
				uniform int uEffectType;
				uniform float uGlobalIntensity;
				uniform float uSpeedMultiplier;
				uniform float uColorShiftAmount;
				uniform float uDistortionStrength;
				uniform float uNoiseLevel;
				
				// Datamosh uniforms
				uniform float uDatamoshBlockSize;
				uniform float uDatamoshCorruptionFreq;
				uniform float uDatamoshQuantization;
				uniform float uDatamoshDisplacement;
				uniform float uDatamoshTemporal;
				
				// Pixel Sort uniforms
				uniform float uPixelSortDirection;
				uniform float uPixelSortThreshold;
				uniform float uPixelSortBandWidth;
				uniform float uPixelSortSeparation;
				uniform float uPixelSortSensitivity;
				
				// Digital Static uniforms
				uniform float uStaticDensity;
				uniform float uStaticWaveSpeed;
				uniform float uStaticAnalogNoise;
				uniform float uStaticChannelShift;
				uniform float uStaticFlicker;
				
				// Static Sweep uniforms
				uniform float uSweepWidth;
				uniform float uSweepLayers;
				uniform float uSweepChromaticAberration;
				uniform float uSweepEdgeGlow;
				uniform float uSweepFadeTiming;
				
				// Glitch Wipe uniforms
				uniform float uWipeAngle;
				uniform float uWipeAberrationStrength;
				uniform float uWipeEdgeWidth;
				uniform float uWipeColorBleeding;
				uniform float uWipeTransitionCurve;
				
				// Analog Decay uniforms
				uniform float uAnalogGrain;
				uniform float uAnalogBleeding;
				uniform float uAnalogVSync;
				uniform float uAnalogDropout;
				uniform float uAnalogScanlines;
				uniform float uAnalogVignette;
				uniform float uAnalogJitter;
				uniform float uAnalogChroma;
				
				varying vec2 vUv;

				float random(vec2 st) {
					return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
				}

				float random(float x) {
					return fract(sin(x) * 43758.5453123);
				}

				vec2 getCoverUV(vec2 uv, vec2 textureSize) {
					vec2 s = uResolution / textureSize;
					float scale = max(s.x, s.y);
					vec2 scaledSize = textureSize * scale;
					vec2 offset = (uResolution - scaledSize) * 0.5;
					return (uv * uResolution - offset) / scaledSize;
				}

				vec4 sampleTexture(sampler2D tex, vec2 uv, vec2 texSize) {
					vec2 coverUV = getCoverUV(uv, texSize);
					coverUV = clamp(coverUV, 0.0, 1.0);
					return texture2D(tex, coverUV);
				}

				vec4 applyWhiteGlitchOverlay(vec4 color, vec2 uv, float intensity, float effectType) {
					float time = uTime * uSpeedMultiplier * 2.0;
					
					float glitchSize = 1500.0;
					vec2 glitchUV = floor(uv * glitchSize) / glitchSize;
					float glitchRandom = random(glitchUV + floor(time * 12.0));
					
					float whiteGlitch = step(0.98, glitchRandom) * uNoiseLevel;
					
					float fineNoise = random(uv * 3000.0 + time * 0.5);
					float whiteNoise = step(0.995, fineNoise) * uNoiseLevel;
					
					float scanlineGlitch = 0.0;
					float scanY = floor(uv.y * 800.0);
					float scanRandom = random(vec2(scanY, floor(time * 8.0)));
					if (scanRandom > 0.99) {
						float scanlineNoise = random(uv * vec2(2000.0, 1.0) + time);
						scanlineGlitch = step(0.7, scanlineNoise) * 0.3 * uNoiseLevel;
					}
					
					float glitchIntensity = 0.4 * uGlobalIntensity;
					
					float totalWhiteGlitch = (whiteGlitch + whiteNoise + scanlineGlitch) * glitchIntensity * intensity;
					
					vec3 result = color.rgb;
					result = mix(result, vec3(1.0), totalWhiteGlitch * 0.6);
					
					float grain = (random(uv * 2500.0 + time * 0.1) - 0.5) * 0.03 * uNoiseLevel;
					result += vec3(grain) * glitchIntensity * intensity;
					
					return vec4(result, color.a);
				}

				// Datamosh Effect
				vec4 datamoshEffect(vec2 uv, float progress) {
					vec4 img1 = sampleTexture(uTexture1, uv, uTexture1Size);
					vec4 img2 = sampleTexture(uTexture2, uv, uTexture2Size);
					
					float time = uTime * uSpeedMultiplier * 2.0 * uDatamoshTemporal;
					
					float corruptionIntensity;
					if (progress < 0.3) {
						corruptionIntensity = smoothstep(0.0, 0.3, progress);
					} else if (progress < 0.7) {
						corruptionIntensity = 1.0;
					} else {
						corruptionIntensity = 1.0 - smoothstep(0.7, 1.0, progress);
					}
					
					vec2 blockSize = vec2(32.0, 24.0) * uDatamoshBlockSize;
					vec2 blockUV = floor(uv * blockSize) / blockSize;
					float blockRand = random(blockUV);
					
					float corruptionThreshold = 1.0 - corruptionIntensity * 1.4 * uDatamoshCorruptionFreq;
					float isCorrupted = step(corruptionThreshold, blockRand) * corruptionIntensity;
					
					vec2 distortion = vec2(
						sin(blockRand * 6.28 + time * 3.0) * 0.075,
						cos(blockRand * 4.71 + time * 2.5) * 0.06
					) * isCorrupted * uDatamoshDisplacement * uDistortionStrength;
					
					vec4 sourceImg = mix(img2, img1, step(progress, 0.5));
					vec4 corruptedImg;
					if (progress < 0.5) {
						corruptedImg = sampleTexture(uTexture1, uv + distortion, uTexture1Size);
					} else {
						corruptedImg = sampleTexture(uTexture2, uv + distortion, uTexture2Size);
					}
					
					if (isCorrupted > 0.1) {
						float colorCorrupt = random(blockUV.x + time * 0.1) * uColorShiftAmount;
						if (colorCorrupt < 0.3) {
							corruptedImg.rgb = corruptedImg.gbr;
						} else if (colorCorrupt < 0.6) {
							corruptedImg.rgb = corruptedImg.brg;
						}
						
						float quantLevels = 6.0 / uDatamoshQuantization;
						corruptedImg.rgb = floor(corruptedImg.rgb * quantLevels) / quantLevels;
					}
					
					vec4 result = mix(sourceImg, corruptedImg, isCorrupted);
					
					float finalBlend = smoothstep(0.0, 1.0, progress);
					if (corruptionIntensity < 0.1) {
						result = mix(img1, img2, finalBlend);
					}
					
					result = applyWhiteGlitchOverlay(result, uv, corruptionIntensity * 0.8 * uGlobalIntensity, 0.0);
					
					return result;
				}

				// Pixel Sort Effect
				vec4 pixelSortEffect(vec2 uv, float progress) {
					vec4 img1 = sampleTexture(uTexture1, uv, uTexture1Size);
					vec4 img2 = sampleTexture(uTexture2, uv, uTexture2Size);
					
					float time = uTime * uSpeedMultiplier * 1.5;
					
					float sortIntensity;
					if (progress < 0.2) {
						sortIntensity = smoothstep(0.0, 0.2, progress);
					} else if (progress < 0.8) {
						sortIntensity = 1.0;
					} else {
						sortIntensity = 1.0 - smoothstep(0.8, 1.0, progress);
					}
					
					float bandHeight = 0.08 * uPixelSortBandWidth;
					float bandIndex = floor(uv.y / bandHeight);
					float bandRandom = random(bandIndex + floor(time * 0.5));
					
					float sortThreshold = 1.0 - sortIntensity * uPixelSortThreshold;
					float shouldSort = step(sortThreshold, bandRandom);
					
					float imageMorphProgress = smoothstep(0.0, 1.0, progress);
					vec4 baseImg = mix(img1, img2, imageMorphProgress);
					
					vec2 sortedUV = uv;
					vec4 result = baseImg;
					
					if (shouldSort > 0.5 && sortIntensity > 0.1) {
						vec4 sortingSample1 = sampleTexture(uTexture1, uv, uTexture1Size);
						vec4 sortingSample2 = sampleTexture(uTexture2, uv, uTexture2Size);
						vec4 sortingSample = mix(sortingSample1, sortingSample2, imageMorphProgress);
						
						float brightness = dot(sortingSample.rgb, vec3(0.299, 0.587, 0.114)) * uPixelSortSensitivity;
						
						float sortDirection = mix(-1.0, 1.0, uPixelSortDirection);
						float sortOffset = (brightness - 0.5) * 0.25 * sortIntensity * sortDirection * uDistortionStrength;
						sortOffset += sin(uv.y * 15.0 + time * 2.0) * 0.08 * sortIntensity;
						
						sortedUV.x += sortOffset;
						
						vec4 sortedImg1 = sampleTexture(uTexture1, sortedUV, uTexture1Size);
						vec4 sortedImg2 = sampleTexture(uTexture2, sortedUV, uTexture2Size);
						vec4 sortedImg = mix(sortedImg1, sortedImg2, imageMorphProgress);
						
						float separation = 0.015 * sortIntensity * uPixelSortSeparation;
						
						vec4 sample1_r = sampleTexture(uTexture1, sortedUV + vec2(separation, 0.0), uTexture1Size);
						vec4 sample2_r = sampleTexture(uTexture2, sortedUV + vec2(separation, 0.0), uTexture2Size);
						float r = mix(sample1_r.r, sample2_r.r, imageMorphProgress);
						
						vec4 sample1_g = sampleTexture(uTexture1, sortedUV, uTexture1Size);
						vec4 sample2_g = sampleTexture(uTexture2, sortedUV, uTexture2Size);
						float g = mix(sample1_g.g, sample2_g.g, imageMorphProgress);
						
						vec4 sample1_b = sampleTexture(uTexture1, sortedUV - vec2(separation, 0.0), uTexture1Size);
						vec4 sample2_b = sampleTexture(uTexture2, sortedUV - vec2(separation, 0.0), uTexture2Size);
						float b = mix(sample1_b.b, sample2_b.b, imageMorphProgress);
						
						sortedImg = vec4(r, g, b, 1.0);
						
						result = sortedImg;
					}
					
					if (sortIntensity < 0.1) {
						result = mix(img1, img2, imageMorphProgress);
					}
					
					result = applyWhiteGlitchOverlay(result, uv, sortIntensity * 0.6 * uGlobalIntensity, 1.0);
					
					return result;
				}

				// Enhanced Digital Static Effect
				vec4 digitalStaticEffect(vec2 uv, float progress) {
					vec4 img1 = sampleTexture(uTexture1, uv, uTexture1Size);
					vec4 img2 = sampleTexture(uTexture2, uv, uTexture2Size);
					
					float time = uTime * uSpeedMultiplier * 3.0 * uStaticWaveSpeed;
					
					float wavePos = progress * 1.4 - 0.2;
					float waveWidth = 0.3;
					float distanceFromWave = abs(uv.y - wavePos);
					float staticIntensity = 1.0 - smoothstep(0.0, waveWidth, distanceFromWave);
					
					float noise = random(uv * uResolution.xy + time * 0.1) * uStaticDensity;
					float staticMask = step(0.3, noise) * staticIntensity;
					
					float analogNoise = random(uv * 500.0 + time * 0.05) - 0.5;
					analogNoise *= staticIntensity * uStaticAnalogNoise;
					
					vec4 staticImg = img2;
					if (staticIntensity > 0.1) {
						staticImg.rgb = mix(staticImg.rgb, vec3(noise), staticMask * 0.8);
						staticImg.rgb += analogNoise * 0.3;
						
						float shift = sin(time + uv.y * 10.0) * 0.02 * staticIntensity * uStaticChannelShift;
						float r = sampleTexture(uTexture2, uv + vec2(shift, 0.0), uTexture2Size).r;
						float g = sampleTexture(uTexture2, uv, uTexture2Size).g;
						float b = sampleTexture(uTexture2, uv - vec2(shift, 0.0), uTexture2Size).b;
						staticImg = vec4(r, g, b, 1.0);
						
						float flickerFade = staticIntensity * smoothstep(0.8, 0.2, progress);
						float flicker = sin(time * 30.0) * 0.1 * uStaticFlicker * flickerFade;
						staticImg.rgb *= (1.0 + flicker);
					}
					
					float reveal = step(uv.y, wavePos + waveWidth * 0.5);
					vec4 result = mix(img1, staticImg, reveal);
					
					result = applyWhiteGlitchOverlay(result, uv, staticIntensity * uGlobalIntensity, 2.0);
					
					return result;
				}

				// Enhanced Static Sweep Effect
				vec4 staticSweepEffect(vec2 uv, float progress) {
					vec4 img1 = sampleTexture(uTexture1, uv, uTexture1Size);
					vec4 img2 = sampleTexture(uTexture2, uv, uTexture2Size);
					
					if (progress < 0.01 || progress > 0.99) {
						return mix(img1, img2, smoothstep(0.0, 1.0, progress));
					}
					
					float time = uTime * uSpeedMultiplier * 2.5;
					
					float sweepPos = progress * 1.4 - 0.2;
					float isRevealed = step(uv.x, sweepPos);
					
					float distanceFromSweep = abs(uv.x - sweepPos);
					float effectZoneWidth = 0.25 * uSweepWidth;
					
					float adjustedProgress = pow(progress, uSweepFadeTiming);
					
					float masterIntensity;
					if (adjustedProgress < 0.15) {
						masterIntensity = smoothstep(0.0, 0.15, adjustedProgress) * 0.4;
					} else if (adjustedProgress < 0.35) {
						masterIntensity = 0.4 + smoothstep(0.15, 0.35, adjustedProgress) * 0.5;
					} else if (adjustedProgress < 0.65) {
						masterIntensity = 0.9 + sin(adjustedProgress * 20.0) * 0.1 * uSweepLayers;
					} else if (adjustedProgress < 0.85) {
						masterIntensity = 0.9 - smoothstep(0.65, 0.85, adjustedProgress) * 0.6;
					} else {
						masterIntensity = 0.3 - smoothstep(0.85, 1.0, adjustedProgress) * 0.25;
					}
					
					float baseEffectStrength = (1.0 - smoothstep(0.0, effectZoneWidth, distanceFromSweep)) * masterIntensity * uGlobalIntensity;
					
					float staticNoise1 = random(uv * 120.0 * uSweepLayers + time * 0.8);
					float staticNoise2 = random(uv * 200.0 + time * 1.3);
					float staticNoise3 = random(uv * 80.0 + time * 0.5);
					float combinedStatic = mix(mix(staticNoise1, staticNoise2, 0.6), staticNoise3, 0.3);
					
					float staticMask = step(0.3, combinedStatic) * baseEffectStrength;
					
					float analogNoise = (random(uv * 300.0 + time * 0.1) - 0.5) * 2.0;
					analogNoise *= random(vec2(time * 0.02)) * baseEffectStrength;
					
					float rgbSeparationAmount = 0.04 * baseEffectStrength * uSweepChromaticAberration;
					float rgbTimeOffset = time * 3.0 + uv.y * 12.0;
					
					vec2 rgbOffset1 = vec2(sin(rgbTimeOffset) * rgbSeparationAmount, 0.0);
					vec2 rgbOffset2 = vec2(-sin(rgbTimeOffset * 1.3) * rgbSeparationAmount * 0.7, 0.0);
					vec2 rgbOffset3 = vec2(cos(rgbTimeOffset * 0.8) * rgbSeparationAmount * 0.5, 0.0);
					
					vec4 currentImg = mix(img1, img2, isRevealed);
					
					if (baseEffectStrength > 0.05) {
						float r, g, b;
						
						if (isRevealed > 0.5) {
							r = sampleTexture(uTexture2, uv + rgbOffset1, uTexture2Size).r;
							g = sampleTexture(uTexture2, uv + rgbOffset2, uTexture2Size).g;
							b = sampleTexture(uTexture2, uv + rgbOffset3, uTexture2Size).b;
						} else {
							r = sampleTexture(uTexture1, uv + rgbOffset1, uTexture1Size).r;
							g = sampleTexture(uTexture1, uv + rgbOffset2, uTexture1Size).g;
							b = sampleTexture(uTexture1, uv + rgbOffset3, uTexture1Size).b;
						}
						
						vec4 glitchedImg = vec4(r, g, b, 1.0);
						
						glitchedImg.rgb = mix(glitchedImg.rgb, vec3(combinedStatic), staticMask * 0.7);
						glitchedImg.rgb += vec3(analogNoise) * 0.25;
						
						float edgeGlow = 1.0 - smoothstep(0.0, 0.02, distanceFromSweep);
						glitchedImg.rgb += vec3(0.8, 0.4, 1.0) * edgeGlow * 0.5 * masterIntensity * uSweepEdgeGlow;
						
						currentImg = mix(currentImg, glitchedImg, baseEffectStrength);
					}
					
					currentImg = applyWhiteGlitchOverlay(currentImg, uv, masterIntensity * 1.2 * uGlobalIntensity, 3.0);
					
					return currentImg;
				}

				// Enhanced Glitch Wipe Effect
				vec4 glitchWipeEffect(vec2 uv, float progress) {
					vec4 img1 = sampleTexture(uTexture1, uv, uTexture1Size);
					vec4 img2 = sampleTexture(uTexture2, uv, uTexture2Size);
					
					if (progress < 0.01 || progress > 0.99) {
						return mix(img1, img2, smoothstep(0.0, 1.0, progress));
					}
					
					float time = uTime * uSpeedMultiplier * 2.0;
					
					vec2 wipeUV = uv;
					float angleRad = radians(uWipeAngle);
					mat2 rotation = mat2(cos(angleRad), -sin(angleRad), sin(angleRad), cos(angleRad));
					wipeUV = rotation * (wipeUV - 0.5) + 0.5;
					
					float curvedProgress = pow(progress, uWipeTransitionCurve);
					
					float wipePos = curvedProgress * 1.2 - 0.1;
					float wipeEdge = wipePos + sin(wipeUV.y * 20.0 + time) * 0.02;
					float isRevealed = step(wipeUV.x, wipeEdge);
					
					float distanceFromWipe = abs(wipeUV.x - wipeEdge);
					
					float caIntensity;
					if (curvedProgress < 0.2) {
						caIntensity = smoothstep(0.0, 0.2, curvedProgress);
					} else if (curvedProgress < 0.75) {
						caIntensity = 1.0;
					} else {
						caIntensity = 1.0 - smoothstep(0.75, 0.95, curvedProgress);
					}
					
					float caZone = (1.0 - smoothstep(0.0, 0.12 * uWipeEdgeWidth, distanceFromWipe)) * caIntensity * uGlobalIntensity;
					
					vec4 currentImg = mix(img1, img2, isRevealed);
					
					if (caZone > 0.05) {
						float baseShift = sin(time * 3.0 + wipeUV.y * 15.0) * 0.035 * caZone * uWipeAberrationStrength;
						float secondaryShift = cos(time * 2.0 + wipeUV.x * 10.0) * 0.02 * caZone;
						
						float totalShift = baseShift + secondaryShift;
						
						float bleeding = uWipeColorBleeding;
						
						float r, g, b;
						if (isRevealed > 0.5) {
							r = sampleTexture(uTexture2, uv + vec2(totalShift * 2.5 * bleeding, totalShift * 0.5), uTexture2Size).r;
							g = sampleTexture(uTexture2, uv + vec2(totalShift * 0.5, -totalShift * 0.3), uTexture2Size).g;
							b = sampleTexture(uTexture2, uv - vec2(totalShift * 2.0 * bleeding, totalShift * 0.7), uTexture2Size).b;
						} else {
							r = sampleTexture(uTexture1, uv + vec2(totalShift * 2.5 * bleeding, totalShift * 0.5), uTexture1Size).r;
							g = sampleTexture(uTexture1, uv + vec2(totalShift * 0.5, -totalShift * 0.3), uTexture1Size).g;
							b = sampleTexture(uTexture1, uv - vec2(totalShift * 2.0 * bleeding, totalShift * 0.7), uTexture1Size).b;
						}
						
						vec4 chromaticImg = vec4(r, g, b, 1.0);
						
						float edgeGlow = 1.0 - smoothstep(0.0, 0.015, distanceFromWipe);
						chromaticImg.rgb += vec3(1.0, 0.6, 0.9) * edgeGlow * 0.4 * caIntensity;
						
						float digitalNoise = random(uv * 200.0 + time * 0.1) * uNoiseLevel;
						chromaticImg.rgb += vec3(digitalNoise - 0.5) * 0.1 * caZone;
						
						currentImg = mix(currentImg, chromaticImg, caZone);
					}
					
					currentImg = applyWhiteGlitchOverlay(currentImg, uv, caIntensity * 0.9 * uGlobalIntensity, 4.0);
					
					return currentImg;
				}

				// Analog Decay Effect
				vec4 analogDecayEffect(vec2 uv, float progress) {
					vec4 img1 = sampleTexture(uTexture1, uv, uTexture1Size);
					vec4 img2 = sampleTexture(uTexture2, uv, uTexture2Size);
					
					float time = uTime * uSpeedMultiplier * 1.8;
					
					float transitionMask = smoothstep(0.4, 0.6, progress + sin(uv.y * 8.0 + time) * 0.1);
					vec4 baseImg = mix(img1, img2, transitionMask);
					
					vec2 jitteredUV = uv;
					if (uAnalogJitter > 0.1) {
						float jitterAmount = (random(vec2(floor(time * 60.0))) - 0.5) * 0.003 * uAnalogJitter;
						jitteredUV.x += jitterAmount;
						jitteredUV.y += (random(vec2(floor(time * 30.0) + 1.0)) - 0.5) * 0.001 * uAnalogJitter;
					}
					
					if (uAnalogVSync > 0.1) {
						float vsyncRoll = sin(time * 2.0 + uv.y * 100.0) * 0.02 * uAnalogVSync;
						float vsyncChance = step(0.95, random(vec2(floor(time * 4.0))));
						jitteredUV.y += vsyncRoll * vsyncChance;
					}
					
					vec4 currentImg = mix(baseImg, mix(
						sampleTexture(uTexture1, jitteredUV, uTexture1Size),
						sampleTexture(uTexture2, jitteredUV, uTexture2Size),
						transitionMask
					), 0.8);
					
					if (uAnalogGrain > 0.1) {
						float grain = (random(uv * 1500.0 + time * 0.1) - 0.5) * 0.15 * uAnalogGrain;
						currentImg.rgb += vec3(grain);
					}
					
					if (uAnalogBleeding > 0.1) {
						float bleedAmount = 0.008 * uAnalogBleeding;
						float offsetPhase = time * 1.5 + uv.y * 20.0;
						
						vec2 redOffset = vec2(sin(offsetPhase) * bleedAmount, 0.0);
						vec2 blueOffset = vec2(-sin(offsetPhase * 1.1) * bleedAmount * 0.8, 0.0);
						
						float r = mix(
							sampleTexture(uTexture1, jitteredUV + redOffset, uTexture1Size).r,
							sampleTexture(uTexture2, jitteredUV + redOffset, uTexture2Size).r,
							transitionMask
						);
						float g = currentImg.g;
						float b = mix(
							sampleTexture(uTexture1, jitteredUV + blueOffset, uTexture1Size).b,
							sampleTexture(uTexture2, jitteredUV + blueOffset, uTexture2Size).b,
							transitionMask
						);
						
						currentImg = vec4(r, g, b, 1.0);
					}
					
					if (uAnalogScanlines > 0.1) {
						float scanlinePattern = sin(uv.y * 800.0) * 0.5 + 0.5;
						float scanlineIntensity = 0.05 * uAnalogScanlines;
						currentImg.rgb *= (1.0 - scanlinePattern * scanlineIntensity);
					}
					
					if (uAnalogDropout > 0.1) {
						float dropoutSize = 100.0;
						vec2 dropoutUV = floor(uv * dropoutSize) / dropoutSize;
						float dropoutRandom = random(dropoutUV + floor(time * 8.0));
						
						float dropoutThreshold = 1.0 - uAnalogDropout * 0.02;
						float isDropout = step(dropoutThreshold, dropoutRandom);
						
						if (isDropout > 0.5) {
							float dropoutNoise = random(uv * 500.0 + time);
							currentImg.rgb = mix(currentImg.rgb, vec3(dropoutNoise * 0.3), 0.8);
						}
					}
					
					if (uAnalogChroma > 0.1) {
						float chromaAmount = 0.01 * uAnalogChroma;
						float chromaPhase = time * 0.5 + uv.x * 5.0;
						
						vec2 chromaOffset = vec2(cos(chromaPhase) * chromaAmount, sin(chromaPhase) * chromaAmount * 0.5);
						
						float r = mix(
							sampleTexture(uTexture1, jitteredUV + chromaOffset, uTexture1Size).r,
							sampleTexture(uTexture2, jitteredUV + chromaOffset, uTexture2Size).r,
							transitionMask
						);
						float g = currentImg.g;
						float b = mix(
							sampleTexture(uTexture1, jitteredUV - chromaOffset, uTexture1Size).b,
							sampleTexture(uTexture2, jitteredUV - chromaOffset, uTexture2Size).b,
							transitionMask
						);
						
						currentImg = vec4(r, g, b, 1.0);
					}
					
					if (uAnalogVignette > 0.1) {
						vec2 vignetteUV = (uv - 0.5) * 2.0;
						float vignette = 1.0 - dot(vignetteUV, vignetteUV) * 0.3 * uAnalogVignette;
						currentImg.rgb *= vignette;
					}
					
					currentImg = applyWhiteGlitchOverlay(currentImg, uv, 0.3 * uGlobalIntensity, 5.0);
					
					return currentImg;
				}

				void main() {
					if (uEffectType == 0) {
						gl_FragColor = datamoshEffect(vUv, uProgress);
					} else if (uEffectType == 1) {
						gl_FragColor = pixelSortEffect(vUv, uProgress);
					} else if (uEffectType == 2) {
						gl_FragColor = digitalStaticEffect(vUv, uProgress);
					} else if (uEffectType == 3) {
						gl_FragColor = staticSweepEffect(vUv, uProgress);
					} else if (uEffectType == 4) {
						gl_FragColor = glitchWipeEffect(vUv, uProgress);
					} else {
						gl_FragColor = analogDecayEffect(vUv, uProgress);
					}
				}
			`;

      // Helper functions
      function getEffectIndex(effectName: string): number {
        const effectMap: Record<string, number> = {
          datamosh: 0,
          pixelSort: 1,
          digitalStatic: 2,
          staticSweep: 3,
          glitchWipe: 4,
          analogDecay: 5,
        };
        return effectMap[effectName] || 0;
      }

      function loadImageTexture(src: string): Promise<THREE.Texture> {
        return new Promise((resolve, reject) => {
          try {
            const loader = new THREE.TextureLoader();
            const timeout = setTimeout(() => reject(new Error("Timeout")), 10000);
            loader.load(
              src,
              (texture) => {
                clearTimeout(timeout);
                texture.minFilter = texture.magFilter = THREE.LinearFilter;
                texture.userData = {
                  size: new THREE.Vector2(
                    texture.image.width,
                    texture.image.height,
                  ),
                };
                resolve(texture);
              },
              undefined,
              (error) => {
                clearTimeout(timeout);
                console.warn(`Failed to load texture: ${src}`, error);
                reject(error);
              },
            );
          } catch (error) {
            console.error(`Error in loadImageTexture for ${src}:`, error);
            reject(error);
          }
        });
      }

      // Initialize WebGL with error handling
      async function initializeRenderer() {
        try {
          const canvas = slider.querySelector(
            "[data-webgl-canvas]",
          ) as HTMLCanvasElement;
          if (!canvas) {
            console.warn("WebGL canvas not found");
            return;
          }

        state.scene = new THREE.Scene();
        state.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        state.renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: false,
          alpha: false,
        });
        state.renderer.setSize(window.innerWidth, window.innerHeight);
        state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create shader material
        state.shaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uTexture1: { value: null },
            uTexture2: { value: null },
            uProgress: { value: 0.0 },
            uTime: { value: 0.0 },
            uResolution: {
              value: new THREE.Vector2(window.innerWidth, window.innerHeight),
            },
            uTexture1Size: { value: new THREE.Vector2(1, 1) },
            uTexture2Size: { value: new THREE.Vector2(1, 1) },
            uEffectType: {
              value: getEffectIndex(config.currentEffect),
            },
            uGlobalIntensity: { value: config.globalIntensity },
            uSpeedMultiplier: { value: config.speedMultiplier },
            uColorShiftAmount: { value: config.colorShiftAmount },
            uDistortionStrength: {
              value: config.distortionStrength,
            },
            uNoiseLevel: { value: config.noiseLevel },
            // Datamosh uniforms
            uDatamoshBlockSize: { value: config.datamoshBlockSize },
            uDatamoshCorruptionFreq: {
              value: config.datamoshCorruptionFreq,
            },
            uDatamoshQuantization: {
              value: config.datamoshQuantization,
            },
            uDatamoshDisplacement: {
              value: config.datamoshDisplacement,
            },
            uDatamoshTemporal: { value: config.datamoshTemporal },
            // Pixel Sort uniforms
            uPixelSortDirection: {
              value: config.pixelSortDirection,
            },
            uPixelSortThreshold: {
              value: config.pixelSortThreshold,
            },
            uPixelSortBandWidth: {
              value: config.pixelSortBandWidth,
            },
            uPixelSortSeparation: {
              value: config.pixelSortSeparation,
            },
            uPixelSortSensitivity: {
              value: config.pixelSortSensitivity,
            },
            // Digital Static uniforms
            uStaticDensity: { value: config.staticDensity },
            uStaticWaveSpeed: { value: config.staticWaveSpeed },
            uStaticAnalogNoise: { value: config.staticAnalogNoise },
            uStaticChannelShift: {
              value: config.staticChannelShift,
            },
            uStaticFlicker: { value: config.staticFlicker },
            // Static Sweep uniforms
            uSweepWidth: { value: config.sweepWidth },
            uSweepLayers: { value: config.sweepLayers },
            uSweepChromaticAberration: {
              value: config.sweepChromaticAberration,
            },
            uSweepEdgeGlow: { value: config.sweepEdgeGlow },
            uSweepFadeTiming: { value: config.sweepFadeTiming },
            // Glitch Wipe uniforms
            uWipeAngle: { value: config.wipeAngle },
            uWipeAberrationStrength: {
              value: config.wipeAberrationStrength,
            },
            uWipeEdgeWidth: { value: config.wipeEdgeWidth },
            uWipeColorBleeding: { value: config.wipeColorBleeding },
            uWipeTransitionCurve: {
              value: config.wipeTransitionCurve,
            },
            // Analog Decay uniforms
            uAnalogGrain: { value: config.analogGrain },
            uAnalogBleeding: { value: config.analogBleeding },
            uAnalogVSync: { value: config.analogVSync },
            uAnalogDropout: { value: config.analogDropout },
            uAnalogScanlines: { value: config.analogScanlines },
            uAnalogVignette: { value: config.analogVignette },
            uAnalogJitter: { value: config.analogJitter },
            uAnalogChroma: { value: config.analogChroma },
          },
          vertexShader,
          fragmentShader,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, state.shaderMaterial);
        state.scene.add(mesh);

        // Load textures with error handling
        for (let i = 0; i < imageCollection.length; i++) {
          try {
            const texture = await loadImageTexture(imageCollection[i]);
            state.slideTextures.push(texture);
          } catch (error) {
            console.warn(`Failed to load image ${i} (${imageCollection[i]}):`, error);
            // Continue loading other images even if one fails
          }
        }

        if (state.slideTextures.length === 0) {
          console.error("No textures loaded successfully");
          return;
        }

        if (state.slideTextures.length >= 2) {
          // Initialize with first texture for both to ensure clean start at slide 1
          state.shaderMaterial.uniforms.uTexture1.value =
            state.slideTextures[0];
          state.shaderMaterial.uniforms.uTexture2.value =
            state.slideTextures[0];
          state.shaderMaterial.uniforms.uTexture1Size.value =
            state.slideTextures[0].userData.size;
          state.shaderMaterial.uniforms.uTexture2Size.value =
            state.slideTextures[0].userData.size;
          state.texturesLoaded = true;
          state.scrollingEnabled = true;
        }

        // Render loop
        const render = () => {
          requestAnimationFrame(render);
          if (state.shaderMaterial) {
            state.shaderMaterial.uniforms.uTime.value =
              (Date.now() - state.startTime) * 0.001;
          }
          if (state.renderer && state.scene && state.camera) {
            state.renderer.render(state.scene, state.camera);
          }
        };
        render();
        } catch (error) {
          console.error("WebGL renderer initialization failed:", error);
        }
      }

      // Transitions
      function createFeaturedImageWrapper(
        imageIndex: number,
        transitionDirection: string,
      ): HTMLElement {
        const featuredWrapper = document.createElement("div");
        featuredWrapper.className = styles.featuredImageWrapper;
        featuredWrapper.setAttribute("data-featured-wrapper", "");
        const featuredImage = document.createElement("img");
        featuredImage.src = imageCollection[imageIndex];
        featuredImage.alt = `Featured image ${imageIndex + 1}`;
        featuredWrapper.appendChild(featuredImage);

        const initialClipPath =
          transitionDirection === "down"
            ? "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
            : "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
        featuredWrapper.style.clipPath = initialClipPath;
        return featuredWrapper;
      }

      function createTextElements(
        slideIndex: number,
        transitionDirection: string,
      ) {
        const newNumber = document.createElement("span");
        newNumber.textContent = slideData[slideIndex].number;
        gsap.set(newNumber, {
          y: transitionDirection === "down" ? 20 : -20,
          opacity: 0,
        });

        const newTitle = document.createElement("h1");
        newTitle.textContent = slideData[slideIndex].title;
        gsap.set(newTitle, {
          y: transitionDirection === "down" ? 60 : -60,
          opacity: 0,
        });

        const newDescription = document.createElement("p");
        newDescription.textContent = slideData[slideIndex].description;
        gsap.set(newDescription, {
          y: transitionDirection === "down" ? 24 : -24,
          opacity: 0,
        });

        const newPropertyLines = slideData[slideIndex].properties.map(
          (lineText) => {
            const lineSpan = document.createElement("span");
            lineSpan.textContent = lineText;
            gsap.set(lineSpan, {
              y: transitionDirection === "down" ? 28 : -28,
              opacity: 0,
            });
            return lineSpan;
          },
        );

        const newParagraphLines = slideData[slideIndex].paragraphLines.map(
          (lineText) => {
            const lineSpan = document.createElement("span");
            lineSpan.textContent = lineText;
            gsap.set(lineSpan, {
              y: transitionDirection === "down" ? 35 : -35,
              opacity: 0,
            });
            return lineSpan;
          },
        );

        return {
          newNumber,
          newTitle,
          newDescription,
          newPropertyLines,
          newParagraphLines,
        };
      }

      function getNextImageIndex(direction: string): number {
        if (direction === "down") {
          return state.currentImageIndex === config.totalImages - 1
            ? 0
            : state.currentImageIndex + 1;
        } else {
          return state.currentImageIndex === 0
            ? config.totalImages - 1
            : state.currentImageIndex - 1;
        }
      }

      function executeSlideTransition(transitionDirection: string) {
        if (
          state.isTransitioning ||
          !state.scrollingEnabled ||
          !state.texturesLoaded
        )
          return;

        state.isTransitioning = true;
        state.scrollingEnabled = false;

        const nextIndex = getNextImageIndex(transitionDirection);
        const currentTexture = state.slideTextures[state.currentImageIndex];
        const nextTexture = state.slideTextures[nextIndex];

        if (!currentTexture || !nextTexture || !state.shaderMaterial) return;

        // Get DOM elements
        const featuredImageContainer = slider.querySelector(
          "[data-featured-image]",
        );
        const currentFeaturedWrapper = featuredImageContainer?.querySelector(
          "[data-featured-wrapper]",
        );

        const numberContainer = slider.querySelector("[data-slide-number]");
        const titleContainer = slider.querySelector("[data-slide-title]");
        const descriptionContainer = slider.querySelector(
          "[data-slide-description]",
        );
        // Get all property line containers (up to 5)
        const propertyLineContainers: (Element | null)[] = [];
        for (let i = 1; i <= 5; i++) {
          propertyLineContainers.push(
            slider.querySelector(`[data-property-line-${i}]`),
          );
        }
        const paragraphLine1Container = slider.querySelector(
          "[data-paragraph-line-1]",
        );
        const paragraphLine2Container = slider.querySelector(
          "[data-paragraph-line-2]",
        );
        const paragraphLine3Container = slider.querySelector(
          "[data-paragraph-line-3]",
        );

        const currentNumber = numberContainer?.querySelector("span");
        const currentTitle = titleContainer?.querySelector("h1");
        const currentDescription = descriptionContainer?.querySelector("p");
        // Get all current property line spans
        const currentPropertyLines = propertyLineContainers.map((container) =>
          container?.querySelector("span"),
        );
        const currentParagraphLine1 =
          paragraphLine1Container?.querySelector("span");
        const currentParagraphLine2 =
          paragraphLine2Container?.querySelector("span");
        const currentParagraphLine3 =
          paragraphLine3Container?.querySelector("span");

        // Create new elements
        const newFeaturedWrapper = createFeaturedImageWrapper(
          nextIndex,
          transitionDirection,
        );
        const {
          newNumber,
          newTitle,
          newDescription,
          newPropertyLines,
          newParagraphLines,
        } = createTextElements(nextIndex, transitionDirection);

        // Add new elements to DOM
        featuredImageContainer?.appendChild(newFeaturedWrapper);
        numberContainer?.appendChild(newNumber);
        titleContainer?.appendChild(newTitle);
        descriptionContainer?.appendChild(newDescription);
        // Append property lines dynamically based on how many exist
        newPropertyLines.forEach((line, index) => {
          propertyLineContainers[index]?.appendChild(line);
        });
        paragraphLine1Container?.appendChild(newParagraphLines[0]);
        paragraphLine2Container?.appendChild(newParagraphLines[1]);
        paragraphLine3Container?.appendChild(newParagraphLines[2]);

        // Set initial position for featured image
        gsap.set(newFeaturedWrapper.querySelector("img"), {
          y: transitionDirection === "down" ? "-50%" : "50%",
        });
        // Update shader uniforms
        state.shaderMaterial.uniforms.uTexture1.value = currentTexture;
        state.shaderMaterial.uniforms.uTexture2.value = nextTexture;
        state.shaderMaterial.uniforms.uTexture1Size.value =
          currentTexture.userData.size;
        state.shaderMaterial.uniforms.uTexture2Size.value =
          nextTexture.userData.size;

        state.currentImageIndex = nextIndex;

        // Create transition timeline
        const transitionTimeline = gsap.timeline({
          onComplete: () => {
            // Cleanup ALL old elements except the newest ones
            // Remove all children from containers except the last one
            const allContainers = [
              numberContainer,
              titleContainer,
              descriptionContainer,
              ...propertyLineContainers,
              paragraphLine1Container,
              paragraphLine2Container,
              paragraphLine3Container,
            ];
            allContainers.forEach((container) => {
              if (container) {
                // Keep only the last child (newest element)
                while (container.children.length > 1) {
                  container.removeChild(container.children[0]);
                }
              }
            }); // Remove all featured wrappers except the newest one
            if (featuredImageContainer) {
              const wrappers = featuredImageContainer.querySelectorAll(
                "[data-featured-wrapper]",
              );
              wrappers.forEach((wrapper, index) => {
                if (index < wrappers.length - 1) {
                  wrapper.remove();
                }
              });
            }

            // Reset shader
            if (state.shaderMaterial) {
              state.shaderMaterial.uniforms.uProgress.value = 0;
              state.shaderMaterial.uniforms.uTexture1.value = nextTexture;
              state.shaderMaterial.uniforms.uTexture1Size.value =
                nextTexture.userData.size;
            }

            state.isTransitioning = false;
            setTimeout(() => {
              state.scrollingEnabled = true;
              state.lastScrollTimestamp = Date.now();
            }, 100);
          },
        });

        const featuredClipPath =
          transitionDirection === "down"
            ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
            : "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)";

        // Background shader transition
        transitionTimeline.fromTo(
          state.shaderMaterial.uniforms.uProgress,
          { value: 0 },
          {
            value: 1,
            duration: config.transitionDuration,
            ease: "cubic-bezier(0.77,0,0.18,1)",
          },
          0,
        );

        // Featured image transitions
        transitionTimeline.to(
          newFeaturedWrapper,
          {
            clipPath: featuredClipPath,
            duration: config.transitionDuration,
            ease: "cubic-bezier(0.77,0,0.18,1)",
          },
          0,
        );

        if (currentFeaturedWrapper?.querySelector("img")) {
          transitionTimeline.to(
            currentFeaturedWrapper.querySelector("img")!,
            {
              y: transitionDirection === "down" ? "50%" : "-50%",
              duration: config.transitionDuration,
              ease: "cubic-bezier(0.77,0,0.18,1)",
            },
            0,
          );
        }

        transitionTimeline.to(
          newFeaturedWrapper.querySelector("img"),
          {
            y: "0%",
            duration: config.transitionDuration,
            ease: "cubic-bezier(0.77,0,0.18,1)",
          },
          0,
        );

        // Text transitions with scramble
        if (currentNumber) {
          transitionTimeline.to(
            currentNumber,
            {
              y: transitionDirection === "down" ? -20 : 20,
              opacity: 0,
              duration: config.transitionDuration,
              ease: "cubic-bezier(0.77,0,0.18,1)",
            },
            0,
          );
        }
        transitionTimeline.fromTo(
          newNumber,
          {
            y: transitionDirection === "down" ? 20 : -20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: config.transitionDuration,
            ease: "cubic-bezier(0.77,0,0.18,1)",
          },
          0,
        );
        transitionTimeline.to(
          newNumber,
          {
            duration: 0.8,
            scrambleText: {
              text: slideData[nextIndex].number,
              chars: "∅øΩ§∆◊¶†‡0123456789",
              revealDelay: 0.3,
              speed: 0.4,
            },
          },
          0.2,
        );

        // Title with scramble
        if (currentTitle) {
          transitionTimeline.to(
            currentTitle,
            {
              y: transitionDirection === "down" ? -60 : 60,
              opacity: 0,
              duration: config.transitionDuration,
              ease: "cubic-bezier(0.77,0,0.18,1)",
            },
            0.02,
          );
        }
        transitionTimeline.fromTo(
          newTitle,
          {
            y: transitionDirection === "down" ? 60 : -60,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: config.transitionDuration,
            ease: "cubic-bezier(0.77,0,0.18,1)",
          },
          0.02,
        );
        transitionTimeline.to(
          newTitle,
          {
            duration: 1.2,
            scrambleText: {
              text: slideData[nextIndex].title,
              chars: "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ",
              revealDelay: 0.4,
              speed: 0.3,
            },
          },
          0.3,
        );

        // Description with scramble
        if (currentDescription) {
          transitionTimeline.to(
            currentDescription,
            {
              y: transitionDirection === "down" ? -24 : 24,
              opacity: 0,
              duration: config.transitionDuration,
              ease: "cubic-bezier(0.77,0,0.18,1)",
            },
            0.04,
          );
        }
        transitionTimeline.fromTo(
          newDescription,
          {
            y: transitionDirection === "down" ? 24 : -24,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: config.transitionDuration,
            ease: "cubic-bezier(0.77,0,0.18,1)",
          },
          0.04,
        );
        transitionTimeline.to(
          newDescription,
          {
            duration: 1.0,
            scrambleText: {
              text: slideData[nextIndex].description,
              chars: "!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz",
              revealDelay: 0.5,
              speed: 0.35,
            },
          },
          0.4,
        );

        // Property lines with scramble (handle variable count)
        currentPropertyLines.forEach((line, index) => {
          if (line) {
            transitionTimeline.to(
              line,
              {
                y: transitionDirection === "down" ? -28 : 28,
                opacity: 0,
                duration: config.transitionDuration,
                ease: "cubic-bezier(0.77,0,0.18,1)",
              },
              0.05 + index * 0.02,
            );
          }
        });
        newPropertyLines.forEach((line, index) => {
          transitionTimeline.fromTo(
            line,
            {
              y: transitionDirection === "down" ? 28 : -28,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: config.transitionDuration,
              ease: "cubic-bezier(0.77,0,0.18,1)",
            },
            0.05 + index * 0.02,
          );
          transitionTimeline.to(
            line,
            {
              duration: 1.2,
              scrambleText: {
                text: slideData[nextIndex].properties[index],
                chars: "!<>-_\\/[]{}—=+*^?#________",
                revealDelay: 0.5 + index * 0.1,
                speed: 0.3,
              },
            },
            0.45 + index * 0.1,
          );
        });

        // Paragraph lines
        [
          currentParagraphLine1,
          currentParagraphLine2,
          currentParagraphLine3,
        ].forEach((line, index) => {
          if (line) {
            transitionTimeline.to(
              line,
              {
                y: transitionDirection === "down" ? -35 : 35,
                opacity: 0,
                duration: config.transitionDuration,
                ease: "cubic-bezier(0.77,0,0.18,1)",
              },
              0.06 + index * 0.02,
            );
          }
        });
        newParagraphLines.forEach((line, index) => {
          transitionTimeline.fromTo(
            line,
            {
              y: transitionDirection === "down" ? 35 : -35,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: config.transitionDuration,
              ease: "cubic-bezier(0.77,0,0.18,1)",
            },
            0.06 + index * 0.02,
          );
        });
      }
      function handleScrollInteraction(scrollDirection: string) {
        const currentTimestamp = Date.now();
        if (state.isTransitioning || !state.scrollingEnabled) return;
        if (
          currentTimestamp - state.lastScrollTimestamp <
          config.scrollThrottleDelay
        )
          return;

        state.lastScrollTimestamp = currentTimestamp;
        executeSlideTransition(scrollDirection);
      }

      // Event listeners with error handling
      let eventListenersCleanup: (() => void) | null = null;
      
      function initEventListeners() {
        // Clean up existing listeners first
        if (eventListenersCleanup) {
          eventListenersCleanup();
        }
        
        try {
          // Mouse wheel handler
          const wheelHandler = (wheelEvent: WheelEvent) => {
            // Only handle scroll if component is active AND scrolling is enabled
            if (!state.isActive || !state.scrollingEnabled) return;
            
            const scrollDirection = wheelEvent.deltaY > 0 ? "down" : "up";
            
            // If scrolling up and already at first slide, allow page scroll to exit
            if (scrollDirection === "up" && state.currentImageIndex === 0) {
              // Don't preventDefault - allow natural page scroll
              return;
            }
            
            // Otherwise, handle slide navigation
            wheelEvent.preventDefault();
            handleScrollInteraction(scrollDirection);
          };
          
          window.addEventListener("wheel", wheelHandler, { passive: false });

          // Touch start handler
          const touchStartHandler = (touchStartEvent: TouchEvent) => {
            // Only handle touch if component is active AND scrolling is enabled
            if (!state.isActive || !state.scrollingEnabled) return;
            
            state.touchStartPosition = touchStartEvent.touches[0].clientY;
            state.isTouchActive = true;
          };
          
          // Touch move handler
          const touchMoveHandler = (touchMoveEvent: TouchEvent) => {
            if (
              !state.isActive ||
              !state.isTouchActive ||
              state.isTransitioning ||
              !state.scrollingEnabled
            )
              return;

            const touchCurrentPosition = touchMoveEvent.touches[0].clientY;
            const touchDifference =
              state.touchStartPosition - touchCurrentPosition;

            if (Math.abs(touchDifference) > config.touchThreshold) {
              const swipeDirection = touchDifference > 0 ? "down" : "up";
              
              // If swiping down (scrollDirection up) and at first slide, allow page scroll
              if (swipeDirection === "up" && state.currentImageIndex === 0) {
                // Don't preventDefault - allow page scroll
                state.isTouchActive = false;
                return;
              }
              
              // Otherwise, prevent default and handle slide transition
              touchMoveEvent.preventDefault();
              state.isTouchActive = false;
              handleScrollInteraction(swipeDirection);
            }
          };
          
          // Touch end handler
          const touchEndHandler = () => {
            state.isTouchActive = false;
          };
          
          window.addEventListener("touchstart", touchStartHandler, { passive: false });
          window.addEventListener("touchmove", touchMoveHandler, { passive: false });
          window.addEventListener("touchend", touchEndHandler);

          // Keyboard handler
          const keyboardHandler = (e: KeyboardEvent) => {
            e.preventDefault();

            switch (e.code) {
              case "KeyH":
                const paneElement = document.querySelector(
                  ".tp-dfwv",
                ) as HTMLElement;
                if (paneElement) {
                  const isHidden = paneElement.style.visibility === "hidden";
                  paneElement.style.visibility = isHidden ? "visible" : "hidden";
                  paneElement.style.opacity = isHidden ? "1" : "0";
                }
                break;

              case "Digit1":
                config.currentEffect = "datamosh";
                if (state.shaderMaterial) {
                  state.shaderMaterial.uniforms.uEffectType.value = 0;
                }
                break;
              case "Digit2":
                config.currentEffect = "pixelSort";
                if (state.shaderMaterial) {
                  state.shaderMaterial.uniforms.uEffectType.value = 1;
                }
                break;
              case "Digit3":
                config.currentEffect = "digitalStatic";
                if (state.shaderMaterial) {
                  state.shaderMaterial.uniforms.uEffectType.value = 2;
                }
                break;
              case "Digit4":
                config.currentEffect = "staticSweep";
                if (state.shaderMaterial) {
                  state.shaderMaterial.uniforms.uEffectType.value = 3;
                }
                break;
              case "Digit5":
                config.currentEffect = "glitchWipe";
                if (state.shaderMaterial) {
                  state.shaderMaterial.uniforms.uEffectType.value = 4;
                }
                break;
              case "Digit6":
                config.currentEffect = "analogDecay";
                if (state.shaderMaterial) {
                  state.shaderMaterial.uniforms.uEffectType.value = 5;
                }
                break;

              case "Equal":
              case "NumpadAdd":
                config.globalIntensity = Math.min(
                  2.0,
                  config.globalIntensity + 0.1,
                );
                if (state.shaderMaterial) {
                  state.shaderMaterial.uniforms.uGlobalIntensity.value =
                    config.globalIntensity;
                }
                break;
              case "Minus":
              case "NumpadSubtract":
                config.globalIntensity = Math.max(
                  0.1,
                  config.globalIntensity - 0.1,
                );
                if (state.shaderMaterial) {
                  state.shaderMaterial.uniforms.uGlobalIntensity.value =
                    config.globalIntensity;
                }
                break;

              case "KeyR":
                config.globalIntensity = 1.0;
                config.speedMultiplier = 1.0;
                if (state.shaderMaterial) {
                  state.shaderMaterial.uniforms.uGlobalIntensity.value = 1.0;
                  state.shaderMaterial.uniforms.uSpeedMultiplier.value = 1.0;
                }
                break;
            }
          };
          
          // Resize handler with debouncing
          const debouncedResize = debounce(() => {
            if (state.renderer && state.shaderMaterial) {
              state.renderer.setSize(window.innerWidth, window.innerHeight);
              state.shaderMaterial.uniforms.uResolution.value.set(
                window.innerWidth,
                window.innerHeight,
              );
            }
          }, 100);
          
          document.addEventListener("keydown", keyboardHandler);
          window.addEventListener("resize", debouncedResize, { passive: true });
          
          // Create cleanup function
          eventListenersCleanup = () => {
            window.removeEventListener("wheel", wheelHandler);
            window.removeEventListener("touchstart", touchStartHandler);
            window.removeEventListener("touchmove", touchMoveHandler);
            window.removeEventListener("touchend", touchEndHandler);
            document.removeEventListener("keydown", keyboardHandler);
            window.removeEventListener("resize", debouncedResize);
            debouncedResize.cancel();
          };
          
        } catch (error) {
          console.error("Event listeners initialization failed:", error);
        }
      }

      // Initialize everything
      await initializeRenderer();

      // Set up ScrollTrigger to activate component when it comes into view
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // Function to reset to first slide without animation
      function resetToFirstSlide() {
        state.currentImageIndex = 0;
        
        const slideInfo = slideData[0];
        
        // Update all text elements instantly
        const numberEl = slider.querySelector("[data-slide-number] span");
        const titleEl = slider.querySelector("[data-slide-title] h1");
        const descEl = slider.querySelector("[data-slide-description] p");
        
        if (numberEl) numberEl.textContent = slideInfo.number;
        if (titleEl) titleEl.textContent = slideInfo.title;
        if (descEl) descEl.textContent = slideInfo.description;
        
        // Update properties
        for (let i = 0; i < 5; i++) {
          const propEl = slider.querySelector(`[data-property-line-${i + 1}] span`);
          if (propEl) propEl.textContent = slideInfo.properties[i] || "";
        }
        
        // Update paragraphs
        const para1El = slider.querySelector("[data-paragraph-line-1] span");
        const para2El = slider.querySelector("[data-paragraph-line-2] span");
        if (para1El) para1El.textContent = slideInfo.paragraphLines[0] || "";
        if (para2El) para2El.textContent = slideInfo.paragraphLines[1] || "";
        
        // Update featured image - remove all old wrappers and reset to first image
        const featuredImageContainer = slider.querySelector("[data-featured-image]");
        if (featuredImageContainer) {
          // Clear all existing wrappers
          featuredImageContainer.innerHTML = "";
          
          // Create fresh wrapper with first image
          const newWrapper = document.createElement("div");
          newWrapper.className = styles.featuredImageWrapper;
          newWrapper.setAttribute("data-featured-wrapper", "");
          
          const img = document.createElement("img");
          img.src = imageCollection[0];
          img.alt = `Featured image 1`;
          img.style.transform = "translateY(0%)";
          
          newWrapper.appendChild(img);
          newWrapper.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
          featuredImageContainer.appendChild(newWrapper);
        }
        
        // Update shader texture - set both to first slide for clean reset
        if (state.shaderMaterial && state.slideTextures[0]) {
          state.shaderMaterial.uniforms.uProgress.value = 0;
          state.shaderMaterial.uniforms.uTexture1.value = state.slideTextures[0];
          state.shaderMaterial.uniforms.uTexture2.value = state.slideTextures[0];
          state.shaderMaterial.uniforms.uTexture1Size.value = state.slideTextures[0].userData.size;
          state.shaderMaterial.uniforms.uTexture2Size.value = state.slideTextures[0].userData.size;
        }
      }

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top center",
        end: "bottom top",
        onEnter: () => {
          // Disable interactions immediately
          state.isTransitioning = true;
          state.scrollingEnabled = false;
          
          // Add loaded class to show component
          slider.classList.add(styles.loaded);
          
          // Reset to first slide
          resetToFirstSlide();
          
          // Fade in Glitch header/footer elements
          gsap.to(slider.querySelector(`.${styles.topCenterText}`), {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          });
          gsap.to(slider.querySelector(`.${styles.bottomCenterText}`), {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          });
          
          // Enable interaction after a longer delay to ensure reset is complete
          setTimeout(() => {
            state.isActive = true;
            state.isTransitioning = false;
            state.scrollingEnabled = true;
            
            // Initialize event listeners only after component is fully ready
            initEventListeners();
          }, 1000);
        },
        onLeave: () => {
          state.isActive = false;
          
          // Clean up event listeners when leaving viewport
          if (eventListenersCleanup) {
            eventListenersCleanup();
            eventListenersCleanup = null;
          }
          
          // Fade out Glitch header/footer elements
          gsap.to(slider.querySelector(`.${styles.topCenterText}`), {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          });
          gsap.to(slider.querySelector(`.${styles.bottomCenterText}`), {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          });
        },
        onEnterBack: () => {
          state.isActive = true;
          state.scrollingEnabled = true;
          
          // Fade in Glitch header/footer elements
          gsap.to(slider.querySelector(`.${styles.topCenterText}`), {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          });
          gsap.to(slider.querySelector(`.${styles.bottomCenterText}`), {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          });
          
          // Initialize event listeners when re-entering
          initEventListeners();
        },
        onLeaveBack: () => {
          state.isActive = false;
          
          // Clean up event listeners when leaving viewport
          if (eventListenersCleanup) {
            eventListenersCleanup();
            eventListenersCleanup = null;
          }
          
          // Fade out Glitch header/footer elements
          gsap.to(slider.querySelector(`.${styles.topCenterText}`), {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          });
          gsap.to(slider.querySelector(`.${styles.bottomCenterText}`), {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          });
        }
      });
    } catch (error) {
      console.error("GlitchSlider initialization failed:", error);
    }
  };

    initSlider();

    // Cleanup function
    return () => {
      // Clean up any pending timeouts or intervals
      // ScrollTrigger cleanup is handled automatically by useGSAP
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.glitchContainer} data-glitch-section>
      <main
        className={`${styles.imageSlider}`}
        role="region"
        aria-label="Image carousel"
        data-image-slider-init
      >
        <canvas
          className={styles.webglCanvas}
          data-webgl-canvas
          aria-hidden="true"
        ></canvas>

        <div className={styles.topCenterText}>PRÏSMAEON</div>
        <div className={styles.bottomCenterText}>穿越化</div>

        <section className={styles.featuredImage} data-featured-image>
          <div className={styles.featuredImageWrapper} data-featured-wrapper>
            <Image
              src="/glitch/1.webp"
              alt="PRÏSMAEON Glitch Effect"
              width={800}
              height={600}
              priority
              onError={() => console.error("Featured image failed to load")}
              onLoad={() => console.log("Featured image loaded successfully")}
            />
          </div>
        </section>

        <header className={styles.slideText} data-slide-text>
          <div className={styles.slideNumber} data-slide-number>
            <span>∅1</span>
          </div>
          <div className={styles.slideTitle} data-slide-title>
            <h1>大数据分析 与 调研</h1>
          </div>
          <div className={styles.slideDescription} data-slide-description>
            <p>DATA ANALYTICS & RESEARCH</p>
          </div>
        </header>

        <div className={styles.slideProperties} data-slide-properties>
          <div className={styles.slidePropertyLine} data-property-line-1>
            <span>品牌全方位调研与诊断</span>
          </div>
          <div className={styles.slidePropertyLine} data-property-line-2>
            <span>宏观市场洞察及本地化规划</span>
          </div>
          <div className={styles.slidePropertyLine} data-property-line-3>
            <span>可行性评估</span>
          </div>
          <div className={styles.slidePropertyLine} data-property-line-4>
            <span></span>
          </div>
          <div className={styles.slidePropertyLine} data-property-line-5>
            <span></span>
          </div>
        </div>

        <div className={styles.slideParagraph} data-slide-paragraph>
          <div className={styles.slideParagraphLine} data-paragraph-line-1>
            <span>核心价值：理性与确定性的基石</span>
          </div>
          <div className={styles.slideParagraphLine} data-paragraph-line-2>
            <span>
              代表从&quot;主观臆断&quot;到&quot;客观洞察&quot;的转变，确保品牌的每一个决策都建立在数据和事实之上，从而规避风险，找准赛道。
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};


export default GlitchSlider;
