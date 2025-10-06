"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./future-circle.module.scss";
import Image from "next/image";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// WebNominee animation interfaces
interface Disc {
  x: number;
  y: number;
  w: number;
  h: number;
  p: number;
}

interface Line {
  p0: { x: number; y: number };
  p1: { x: number; y: number };
  l: { x: number; y: number };
}

interface Particle {
  lineIndex: number;
  p: number;
  v: number;
  l: number;
  a: number;
}

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInCubic: (t: number) => t * t * t,
};

const FutureCircle = () => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // WebNominee animation refs
  const webbyNomineeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const discsRef = useRef<Disc[]>([]);
  const linesRef = useRef<Line[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const renderRef = useRef({ width: 0, height: 0, dpi: 1 });
  const startDiscRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const endDiscRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Utility function to tween values with easing
  const tweenValue = useCallback(
    (
      start: number,
      end: number,
      p: number,
      ease: keyof typeof easingFunctions = "linear",
    ) => {
      const delta = end - start;
      const easeFn = easingFunctions[ease];
      return start + delta * easeFn(p);
    },
    [],
  );

  // WebNominee animation functions
  const setSize = useCallback(() => {
    if (!webbyNomineeRef.current || !canvasRef.current || !badgeRef.current)
      return;

    const rect = webbyNomineeRef.current.getBoundingClientRect();
    const badgeRect = badgeRef.current.getBoundingClientRect();

    renderRef.current = {
      width: rect.width,
      height: rect.height,
      dpi: window.devicePixelRatio || 1,
    };

    const canvas = canvasRef.current;
    canvas.width = renderRef.current.width * renderRef.current.dpi;
    canvas.height = renderRef.current.height * renderRef.current.dpi;

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
  }, []);

  // Tween disc properties
  const tweenDisc = useCallback(
    (disc: Disc) => {
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
    const totalDiscs = 20;
    discsRef.current = [];

    for (let i = 0; i < totalDiscs; i++) {
      const p = i / totalDiscs;
      const disc = tweenDisc({ x: 0, y: 0, w: 0, h: 0, p });
      discsRef.current.push(disc);
    }
  }, [tweenDisc]);

  // Set lines
  const setLines = useCallback(() => {
    const { width, height } = renderRef.current;
    linesRef.current = [];

    const totalLines = 100;
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
  }, []);

  // Initialize particles
  const setParticles = useCallback(() => {
    particlesRef.current = [];
    const totalParticles = 500;

    for (let i = 0; i < totalParticles; i++) {
      const lineIndex = Math.round(
        (linesRef.current.length - 1) * Math.random(),
      );
      const v = 0.005 + Math.random() * 0.005;
      const l = 0.01 + Math.random() * 0.1;
      const a = 0.05 + Math.random() * 0.15;

      particlesRef.current.push({ lineIndex, p: Math.random(), v, l, a });
    }
  }, []);
  // Draw functions
  const drawDiscs = useCallback((ctx: CanvasRenderingContext2D) => {
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
  }, []);

  const drawLines = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    linesRef.current.forEach(({ p0, p1 }) => {
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
    });
    ctx.strokeStyle = "#4449";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }, []);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
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
  }, []);

  // Animation functions
  const moveDiscs = useCallback(() => {
    discsRef.current.forEach((disc) => {
      disc.p = (disc.p + 0.001) % 1;
      tweenDisc(disc);
    });
  }, [tweenDisc]);

  const moveParticles = useCallback(() => {
    particlesRef.current.forEach((particle) => {
      if (particle.p < 1) {
        particle.p += particle.v;
      } else {
        particle.p = 0;
      }
    });
  }, []);

  // Main animation loop
  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    animationFrameRef.current = requestAnimationFrame(tick);
  }, [moveDiscs, moveParticles, setLines, drawDiscs, drawLines, drawParticles]);

  // Resize handler
  const handleResize = useCallback(() => {
    setSize();
    setDiscs();
    setLines();
    setParticles();
  }, [setSize, setDiscs, setLines, setParticles]);

  // Ensure client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || !isMounted) return;

      const container = containerRef.current;
      const elements = container.querySelectorAll("#future-svg circle");
      const logo = container.querySelector("#logo-image");
      const prismaeonText = container.querySelector(`.${styles.prismaeonText}`);
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

      gsap.set(prismaeonText, {
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

      // Fade out logo and fade in PRISMAEON text during FutureCircle animation
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

      scrollTl.to(
        prismaeonText,
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
        },
        "-=0.4",
      );

      // Morph animations
      scrollTl.to(
        innerFat,
        {
          strokeDasharray: "188.5 377",
          duration: 1,
        },
        "-=0.5",
      );

      scrollTl.to(
        dotted,
        {
          attr: { r: 210 },
          duration: 1,
        },
        "-=0.5",
      );

      scrollTl.to(
        outer,
        {
          attr: { r: 240 },
          duration: 1,
        },
        "-=1",
      );

      // Phase 2: Transition (fade out FutureCircle completely, fade in WebNominee badge only)
      // Fade out circles and PRISMAEON text
      scrollTl.to(
        [elements, prismaeonText],
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

      // Phase 4: Left side text appears (next 25% of scroll)
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

      // Phase 5: Right side text appears (final 25% of scroll)
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

      // Phase 3: WebNominee badge simple appearance
      // WebNominee animation setup
      setSize();
      setDiscs();
      setLines();
      setParticles();

      window.addEventListener("resize", handleResize);

      // Variable to track animation state
      let animationActive = false;
    },
    {
      scope: containerRef,
      dependencies: [
        isMounted,
        handleResize,
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
        src="/logo-1.png"
        alt="Logo"
        width={200}
        height={200}
        className={styles.logo}
      />
      <div className={styles.prismaeonText}>PRISMAEON</div>
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
            src="/logo-2.png"
            alt="Webby Nominee Badge"
            width={300}
            height={300}
            className={styles.badgeImg}
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
