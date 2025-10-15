"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./future-circle.module.scss";
import Image from "next/image";
import { 
  detectDeviceCapability, 
  getParticleCounts, 
  getAnimationSpeedMultiplier 
} from "@/utils/device-detection";
import { debounce } from "@/utils/debounce";
import { 
  performanceMonitor, 
  easingFunctions, 
  tweenValue 
} from "@/utils/performance-monitoring";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);


const FutureCircle = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deviceCapability, setDeviceCapability] = useState('high'); // 'low', 'medium', 'high'
  const containerRef = useRef(null);

  // Handle performance issues by reducing particle count
  const handlePerformanceIssue = useCallback(() => {
    console.log('Performance issue detected, reducing particle count...');
    
    if (deviceCapability === 'high') {
      setDeviceCapability('medium');
    } else if (deviceCapability === 'medium') {
      setDeviceCapability('low');
    }
    // If already at 'low', we can't reduce further
  }, [deviceCapability]);

  // WebNominee animation refs
  const webbyNomineeRef = useRef(null);
  const canvasRef = useRef(null);
  const badgeRef = useRef(null);
  const animationFrameRef = useRef(null);

  const discsRef = useRef([]);
  const linesRef = useRef([]);
  const particlesRef = useRef([]);
  const renderRef = useRef({ width: 0, height: 0, dpi: 1 });
  const startDiscRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const endDiscRef = useRef({ x: 0, y: 0, w: 0, h: 0 });


  // WebNominee animation functions with error handling
  const setSize = useCallback(() => {
    try {
      if (!webbyNomineeRef.current || !canvasRef.current || !badgeRef.current) {
        console.warn("Required refs not available for setSize");
        return;
      }

      const rect = webbyNomineeRef.current.getBoundingClientRect();
      const badgeRect = badgeRef.current.getBoundingClientRect();
      
      if (rect.width <= 0 || rect.height <= 0) {
        console.warn("Invalid container dimensions:", rect);
        return;
      }
      
      if (badgeRect.width <= 0 || badgeRect.height <= 0) {
        console.warn("Invalid badge dimensions:", badgeRect);
        return;
      }

      renderRef.current = {
        width: rect.width,
        height: rect.height,
        dpi: window.devicePixelRatio || 1,
      };

      const canvas = canvasRef.current;
      const canvasWidth = renderRef.current.width * renderRef.current.dpi;
      const canvasHeight = renderRef.current.height * renderRef.current.dpi;
      
      if (canvasWidth > 0 && canvasHeight > 0) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      } else {
        console.warn("Invalid canvas dimensions calculated:", { canvasWidth, canvasHeight });
        return;
      }

      const { width, height } = renderRef.current;
      const diag = Math.hypot(width, height);

      startDiscRef.current = {
        x: width * 0.5,
        y: height * 0.5,
        w: diag * 0.5,
        h: diag * 0.5,
      };

      endDiscRef.current = {
        x: width * 0.5,
        y: height * 0.5,
        w: badgeRect.width * 0.5,
        h: badgeRect.height * 0.5,
      };
    } catch (error) {
      console.error("Error in setSize function:", error);
    }
  }, []);

  // Tween disc properties
  const tweenDisc = useCallback(
    (disc) => {
      disc.x = tweenValue(startDiscRef.current.x, endDiscRef.current.x, disc.p);
      disc.y = tweenValue(
        startDiscRef.current.y,
        endDiscRef.current.y,
        disc.p,
        "easeInExpo",
      );
      disc.w = tweenValue(
        startDiscRef.current.w,
        endDiscRef.current.w,
        disc.p,
        "easeOutCubic",
      );
      disc.h = tweenValue(
        startDiscRef.current.h,
        endDiscRef.current.h,
        disc.p,
        "easeOutCubic",
      );
      return disc;
    },
    [tweenValue],
  );

  // Initialize discs
  const setDiscs = useCallback(() => {
    const counts = getParticleCounts(deviceCapability);
    const totalDiscs = counts.discs;
    discsRef.current = [];

    for (let i = 0; i < totalDiscs; i++) {
      const p = i / totalDiscs;
      const disc = tweenDisc({ x: 0, y: 0, w: 0, h: 0, p });
      discsRef.current.push(disc);
    }
  }, [tweenDisc, deviceCapability]);

  // Set lines
  const setLines = useCallback(() => {
    const { width, height } = renderRef.current;
    linesRef.current = [];

    const counts = getParticleCounts(deviceCapability);
    const totalLines = counts.lines;
    const linesAngle = (Math.PI * 2) / totalLines;

    for (let i = 0; i < totalLines; i++) {
      const angle =
        (i * linesAngle + performance.now() * 0.0001) % (Math.PI * 2);

      const p0 = {
        x: width * 0.5 + Math.cos(angle) * startDiscRef.current.w,
        y: height * 0.5 + Math.sin(angle) * startDiscRef.current.h,
      };

      const p1 = {
        x: width * 0.5 + Math.cos(angle) * endDiscRef.current.w,
        y: height * 0.5 + Math.sin(angle) * endDiscRef.current.h,
      };

      const l = {
        x: p1.x - p0.x,
        y: p1.y - p0.y,
      };

      linesRef.current.push({ p0, p1, l });
    }
  }, [deviceCapability]);

  // Initialize particles
  const setParticles = useCallback(() => {
    particlesRef.current = [];
    const counts = getParticleCounts(deviceCapability);
    const totalParticles = counts.particles;

    for (let i = 0; i < totalParticles; i++) {
      const lineIndex = Math.round(
        (linesRef.current.length - 1) * Math.random(),
      );
      const v = 0.005 + Math.random() * 0.005;
      const l = 0.01 + Math.random() * 0.1;
      const a = 0.05 + Math.random() * 0.15;

      particlesRef.current.push({ lineIndex, p: Math.random(), v, l, a });
    }
  }, [deviceCapability]);
  // Draw functions
  const drawDiscs = useCallback((ctx) => {
    try {
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 2;

      // Outer disc
      const outerDisc = startDiscRef.current;
      ctx.beginPath();
      ctx.ellipse(
        outerDisc.x,
        outerDisc.y,
        outerDisc.w,
        outerDisc.h,
        0,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.closePath();

      // Inner discs
      discsRef.current.forEach((disc) => {
        ctx.beginPath();
        ctx.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      });
    } catch (error) {
      console.error("Error in drawDiscs function:", error);
    }
  }, []);

  const drawLines = useCallback((ctx) => {
    try {
      ctx.beginPath();
      linesRef.current.forEach(({ p0, p1 }) => {
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
      });
      ctx.strokeStyle = "#4449";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    } catch (error) {
      console.error("Error in drawLines function:", error);
    }
  }, []);

  const drawParticles = useCallback((ctx) => {
    try {
      particlesRef.current.forEach((particle) => {
        const line = linesRef.current[particle.lineIndex];
        if (!line) return;

        const start = {
          x: line.p0.x + line.l.x * particle.p,
          y: line.p0.y + line.l.y * particle.p,
        };

        const p0 = { x: start.x, y: start.y };
        const p1 = {
          x: start.x + line.l.x * particle.l,
          y: start.y + line.l.y * particle.l,
        };

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${particle.a})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      });
    } catch (error) {
      console.error("Error in drawParticles function:", error);
    }
  }, []);

  // Animation functions
  const moveDiscs = useCallback(() => {
    // Adjust animation speed based on device capability
    const speedMultiplier = getAnimationSpeedMultiplier(deviceCapability);
    
    discsRef.current.forEach((disc) => {
      disc.p = (disc.p + 0.001 * speedMultiplier) % 1;
      tweenDisc(disc);
    });
  }, [tweenDisc, deviceCapability]);

  const moveParticles = useCallback(() => {
    // Adjust animation speed based on device capability
    const speedMultiplier = getAnimationSpeedMultiplier(deviceCapability);
    
    particlesRef.current.forEach((particle) => {
      if (particle.p < 1) {
        particle.p += particle.v * speedMultiplier;
      } else {
        particle.p = 0;
      }
    });
  }, [deviceCapability]);

  // Main animation loop with performance monitoring and error handling
  const tick = useCallback(() => {
    try {
      const startTime = performance.now();
      const canvas = canvasRef.current;
      if (!canvas) {
        console.warn("Canvas element not available");
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.warn("Canvas context not available");
        return;
      }

      if (canvas.width === 0 || canvas.height === 0) {
        console.warn("Canvas has invalid dimensions");
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(renderRef.current.dpi, renderRef.current.dpi);

      moveDiscs();
      moveParticles();
      setLines();

      drawDiscs(ctx);
      drawLines(ctx);
      drawParticles(ctx);

      ctx.restore();

      // Performance monitoring
      const endTime = performance.now();
      const frameTime = endTime - startTime;
      if (frameTime > 16) {
        console.warn(`Canvas animation performance issue: ${frameTime.toFixed(2)}ms per frame`);
      }

      // Enhanced performance monitoring with automatic adjustment
      performanceMonitor.frame(handlePerformanceIssue);

      animationFrameRef.current = requestAnimationFrame(tick);
    } catch (error) {
      console.error("Canvas animation error:", error);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }, [moveDiscs, moveParticles, setLines, drawDiscs, drawLines, drawParticles, handlePerformanceIssue]);

  // Resize handler with debouncing
  const handleResize = useCallback(() => {
    setSize();
    setDiscs();
    setLines();
    setParticles();
  }, [setSize, setDiscs, setLines, setParticles]);

  // Debounced resize handler
  const debouncedResize = useCallback(
    debounce(handleResize, 100),
    [handleResize]
  );

  // Ensure client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkDeviceCapability = () => {
      setIsMobile(window.innerWidth < 768);
      const capability = detectDeviceCapability();
      setDeviceCapability(capability);
      console.log(`Future Circle device capability detected: ${capability}`);
    };

    checkDeviceCapability();
    window.addEventListener("resize", checkDeviceCapability);

    return () => window.removeEventListener("resize", checkDeviceCapability);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || !isMounted) return;

      const container = containerRef.current;
      const elements = container.querySelectorAll("#future-svg circle");
      const logo = container.querySelector("#logo-image");
      const prismaeonText = container.querySelector(`.${styles.prismaeonText}`); // PRISMAEON
      const chineseText = container.querySelector(`.${styles.chineseText}`); // 穿越化
      const leftSideText = container.querySelector(`.${styles.leftSideText}`);
      const rightSideText = container.querySelector(`.${styles.rightSideText}`);
      const outer = container.querySelector("#outer-circle");
      const dotted = container.querySelector("#dotted-circle");
      const innerSlim = container.querySelector("#inner-slim-circle");
      const innerFat = container.querySelector("#inner-fat-circle");

      if (
        !elements.length ||
        !logo ||
        !prismaeonText ||
        !chineseText ||
        !leftSideText ||
        !rightSideText ||
        !outer ||
        !dotted ||
        !innerSlim ||
        !innerFat
      )
        return;

      // Initialize animations with ScrollTrigger
      gsap.set([elements, logo], {
        scale: 1,
        transformOrigin: "50% 50%",
      });

      gsap.set([prismaeonText, chineseText], {
        opacity: 0,
        scale: 0.8,
        transformOrigin: "50% 50%",
      });

      // Continuous rotation animations
      const rotationTimeline = gsap.timeline({ repeat: -1 });
      rotationTimeline.to(outer, {
        rotation: 360,
        duration: 30,
        ease: "none",
      });

      gsap.to(dotted, {
        rotation: -360,
        duration: 60,
        ease: "none",
        repeat: -1,
      });

      gsap.to(innerFat, {
        rotation: -360,
        duration: 10,
        ease: "none",
        repeat: -1,
      });

      gsap.to(innerSlim, {
        rotation: 360,
        duration: 10,
        ease: "none",
        repeat: -1,
      });

      // ScrollTrigger animation - Extended timeline for sequential animations
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          // markers: true,
          start: "top top",
          end: "+=400%", // Extended scroll distance for 4 phases
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onEnter: () => rotationTimeline.play(),
          onLeave: () => rotationTimeline.pause(),
          onEnterBack: () => rotationTimeline.play(),
          onLeaveBack: () => rotationTimeline.pause(),
        },
      });

      // Set initial states for WebNominee elements
      gsap.set(webbyNomineeRef.current, {
        opacity: 0,
      });

      // Set initial state for badge (no scaling or rotation)
      gsap.set(badgeRef.current, {
        opacity: 0,
        scale: 1,
        rotation: 0,
      });

      // Phase 1: FutureCircle animations (first 50% of scroll)
      // Scale in animation for circles
      scrollTl.to([elements], {
        scale: 1,
        duration: 1,
        ease: "power2.out",
      });

      // Fade out logo during initial circle scale
      scrollTl.to(
        logo,
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.8,
          ease: "power2.in",
        },
        "-=0.5",
      );

      // Start morph animations - this is where text transitions happen
      scrollTl.to(
        innerFat,
        {
          strokeDasharray: "188.5 377",
          duration: 1,
        },
        "+=0.2",
      );

      scrollTl.to(
        dotted,
        {
          attr: { r: 210 },
          duration: 1,
        },
        "-=1",
      );

      scrollTl.to(
        outer,
        {
          attr: { r: 240 },
          duration: 1,
        },
        "-=1",
      );

      // Fade in PRISMAEON text during morph animations
      scrollTl.to(
        prismaeonText,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=1", // Start during morph
      );

      // Fade out PRISMAEON and fade in Chinese text during morph
      scrollTl.to(
        prismaeonText,
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.4,
          ease: "power2.in",
        },
        "+=0.2", // Small pause after PRISMAEON
      );

      scrollTl.to(
        chineseText,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.2", // Overlap slightly with fade out
      );

      // Phase 2: Transition (fade out FutureCircle completely, fade in WebNominee badge only)
      // Fade out circles, PRISMAEON text, and Chinese text
      scrollTl.to(
        [elements, prismaeonText, chineseText],
        {
          opacity: 0,
          scale: 0.8,
          duration: 1,
          ease: "power2.in",
        },
        "+=0.5",
      );

      // Phase 3: WebNominee badge and effects appear (25% of total scroll)
      scrollTl.to(
        webbyNomineeRef.current,
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          onStart: () => {
            // Start canvas animation and make badge visible
            if (!animationActive) {
              animationActive = true;
              animationFrameRef.current = requestAnimationFrame(tick);
            }
            // Ensure badge is visible when container appears
            gsap.set(badgeRef.current, { opacity: 1 });
          },
        },
        "-=0.3",
      );

      // Phase 4: Left side text appears (next 25% of scroll) - only on desktop
      if (!isMobile && leftSideText) {
        scrollTl.fromTo(
          leftSideText,
          {
            opacity: 0,
            x: -100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1.5,
            ease: "power2.out",
          },
          "+=1",
        );
      }

      // Phase 5: Right side text appears (final 25% of scroll) - only on desktop
      if (!isMobile && rightSideText) {
        scrollTl.fromTo(
          rightSideText,
          {
            opacity: 0,
            x: 100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1.5,
            ease: "power2.out",
          },
          "+=1",
        );
      }

      // Phase 3: WebNominee badge simple appearance
      // WebNominee animation setup
      setSize();
      setDiscs();
      setLines();
      setParticles();

      window.addEventListener("resize", debouncedResize, { passive: true });

      // Variable to track animation state
      let animationActive = false;

      // Cleanup function
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        window.removeEventListener("resize", debouncedResize);
        if (debouncedResize.cancel) {
          debouncedResize.cancel();
        }
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    },
    {
      scope: containerRef,
      dependencies: [
        isMounted,
        isMobile,
        deviceCapability,
        debouncedResize,
        tick,
        setSize,
        setDiscs,
        setLines,
        setParticles,
      ],
    },
  );

  return (
    <div ref={containerRef} className={styles.container}>
      <Image
        id="logo-image"
        src="/logo-1.webp"
        alt="Logo"
        width={200}
        height={200}
        className={styles.logo}
        onError={() => console.error("Logo image failed to load")}
        onLoad={() => console.log("Logo image loaded successfully")}
        priority
      />
      <div className={styles.prismaeonText}>PRISMAEON</div>
      <div className={styles.chineseText}>穿越化</div>
      <svg id="future-svg" className={styles.svg} viewBox="0 0 500 500">
        <circle
          id="outer-circle"
          className={styles.outer}
          stroke="#FFF"
          cy="250"
          cx="250"
          r="180"
          fill="none"
        ></circle>
        <circle
          id="dotted-circle"
          className={styles.dotted}
          stroke="#FFF"
          cy="250"
          cx="250"
          r="180"
          fill="none"
        ></circle>
        <circle
          id="inner-slim-circle"
          className={styles.inner_slim}
          stroke="#FFF"
          cy="250"
          cx="250"
          r="180"
          fill="none"
        ></circle>
        <circle
          id="inner-fat-circle"
          className={styles.inner_fat}
          stroke="#FFF"
          cy="250"
          cx="250"
          r="180"
          fill="none"
        ></circle>
      </svg>

      {/* WebNominee Animation Section */}
      <div ref={webbyNomineeRef} className={styles.webbyNominee}>
        <div ref={badgeRef} className={styles.badge}>
          <Image
            src="/logo-2.webp"
            alt="Prismaeon Logo"
            width={300}
            height={300}
            className={styles.badgeImg}
            onError={() => console.error("Badge image failed to load")}
            onLoad={() => console.log("Badge image loaded successfully")}
          />
        </div>

        <div className={styles.aura}></div>
        <div className={styles.overlay}></div>
        <canvas ref={canvasRef} className={styles.canvas}></canvas>
      </div>

      {/* Side Text Elements */}
      <div className={styles.leftSideText}>
        <div className={styles.leftTextLine1}>穿越化•PRISMAEON</div>
        <div className={styles.leftTextLine2}>
          priz.me,:.On ( priz-muh-ee-on)
        </div>
      </div>

      <div className={styles.rightSideText}>
        打造一个穿越文化：国界，
        <br />
        时间周期 的品牌&大单品
      </div>
    </div>
  );
};

export default FutureCircle;
