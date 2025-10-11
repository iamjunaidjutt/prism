"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "./spectrum.module.scss";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// Simple debounce utility for resize events
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

// Monochrome theme colors - Chrome gray and light champagne
const MONOCHROME_COLORS = [
  // "#1A1A1A", // Dark chrome gray
  // "#404040", // Chrome gray
  "#666666", // Medium gray
  // "#b0b0b0", // Light gray
  "#f7e7ce", // Light champagne
  "#f7e7ce", // Light champagne
  "#f7e7ce", // Light champagne
  "#f7e7ce", // Light champagne
  "#f7e7ce", // Light champagne
  "#f7e7ce", // Light champagne
  "#f7e7ce", // Light champagne
];

const Spectrum: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Refs for DOM elements
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroNavRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const textGridRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLDivElement>(null);
  const gradientOverlayRef = useRef<HTMLDivElement>(null);
  const svgGroupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize animations after fonts are loaded
  useEffect(() => {
    if (!isMounted) return;

    const initAnimations = async () => {
      try {
        // Wait for fonts to be ready
        await document.fonts.ready;

        const isMobileView = window.innerWidth < 768;
        const isTabletView = window.innerWidth >= 768 && window.innerWidth < 1024;


      // Hero Timeline - Initial animations
      const heroTl = gsap.timeline({ delay: 0.5 });

      // Animate hero title
      if (heroTitleRef.current) {
        const titleSplit = new SplitText(heroTitleRef.current, {
          type: isMobileView ? "words" : "chars",
          charsClass: "char",
        });

        const elements = isMobileView ? titleSplit.words : titleSplit.chars;

        gsap.set(elements, { opacity: 0, filter: "blur(8px)", x: -20 });

        heroTl.to(
          elements,
          {
            opacity: 1,
            filter: "blur(0px)",
            x: 0,
            duration: 0.8,
            stagger: isMobileView ? 0.1 : 0.03,
            ease: "power2.out",
          },
          0,
        );
      }

      // Animate hero nav items
      const navItems = heroNavRef.current?.querySelectorAll(
        "#hero-nav-item-0, #hero-nav-item-1, #hero-nav-item-2, #hero-nav-item-3, #hero-nav-item-4, #hero-nav-item-5, #hero-nav-item-6, #hero-nav-item-7, #hero-nav-item-8",
      );

      if (navItems) {
        navItems.forEach((item) => {
          const split = new SplitText(item as HTMLElement, {
            type: "lines",
          });
          gsap.set(split.lines, {
            opacity: 0,
            y: 30,
            filter: "blur(8px)",
          });

          heroTl.to(
            split.lines,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.8,
              stagger: 0.08,
              ease: "power2.out",
            },
            0.4,
          );
        });
      }

      // Animate hero text paragraphs - animate as whole blocks to preserve justify alignment
      const textElements = heroTextRef.current?.querySelectorAll(
        "#hero-text-0, #hero-text-1",
      );

      if (textElements) {
        gsap.set(textElements, {
          opacity: 0,
          y: 50,
          filter: "blur(4px)",
        });

        heroTl.to(
          textElements,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.0,
            stagger: 0.2,
            ease: "power2.out",
          },
          0.5,
        );
      }

      // Animate scroll hint with continuous blur
      if (scrollHintRef.current) {
        const scrollSplit = new SplitText(scrollHintRef.current, {
          type: "chars",
        });
        gsap.set(scrollSplit.chars, {
          opacity: 0,
          filter: "blur(3px)",
        });

        gsap.to(scrollSplit.chars, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.6,
          stagger: { each: 0.08, repeat: -1, yoyo: true },
          ease: "sine.inOut",
          delay: 1,
        });

        gsap.to(scrollSplit.chars, {
          filter: "blur(1px)",
          duration: 0.8,
          stagger: { each: 0.08, repeat: -1, yoyo: true },
          ease: "sine.inOut",
          delay: 1.04,
        });
      }

      // Scroll-triggered animations
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#animation-section",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // Add fade-out animation when Glitch component comes into view
      const fadeOutTl = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-glitch-section]",
          start: "top bottom",
          end: "top center",
          scrub: 1,
        },
      });

      // Fade out SVG elements
      fadeOutTl.to("[data-spectrum-component] #svg-container, [data-spectrum-component] #text-grid, [data-spectrum-component] #main-title", {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      }, 0);



      // Control Spectrum header/nav visibility
      ScrollTrigger.create({
        trigger: ".spectrum",
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          // Show all nav items when entering Spectrum
          gsap.to("[data-spectrum-component] #nav-top-left, [data-spectrum-component] #nav-top-right", {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          });
        },
        onLeave: () => {
          // No action needed when leaving Spectrum
        },
        onEnterBack: () => {
          // No action needed when coming back to Spectrum
        },
        onLeaveBack: () => {
          // Hide nav items when leaving Spectrum (scrolling up)
          gsap.to("[data-spectrum-component] #nav-top-left, [data-spectrum-component] #nav-top-right", {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          });
        },
      });

      // Fade out nav items when scrolling past hero section
      ScrollTrigger.create({
        trigger: "#animation-section",
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          gsap.to("[data-spectrum-component] #nav-top-left, [data-spectrum-component] #nav-top-right", {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          gsap.to("[data-spectrum-component] #nav-top-left, [data-spectrum-component] #nav-top-right", {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        },
      });

      // Prepare wavelength labels and main title
      const wavelengthLabels =
        textGridRef.current?.querySelectorAll("#wavelength-label");
      const allSplitLines: Element[] = [];

      if (wavelengthLabels) {
        wavelengthLabels.forEach((label) => {
          const split = new SplitText(label as HTMLElement, {
            type: "lines",
          });
          gsap.set(split.lines, {
            opacity: 0,
            y: 30,
            filter: "blur(8px)",
          });
          allSplitLines.push(...split.lines);
        });
      }

      if (mainTitleRef.current) {
        const mainTitleSplit = new SplitText(mainTitleRef.current, {
          type: "lines",
        });
        gsap.set(mainTitleSplit.lines, {
          opacity: 0,
          y: 30,
          filter: "blur(8px)",
        });
        allSplitLines.push(...mainTitleSplit.lines);
      }

      // Scroll animations
      scrollTl
        .to("[data-spectrum-component] #svg-container", { autoAlpha: 1, duration: 0.01 }, 0)
        .to("[data-spectrum-component] #text-grid", { autoAlpha: 1, duration: 0.01 }, 0)
        .to("[data-spectrum-component] #main-title", { autoAlpha: 1, duration: 0.01 }, 0)
        .to(
          "[data-spectrum-component] #svg-container",
          {
            transform: "scaleY(0.05) translateY(-30px)",
            duration: 0.3,
            ease: "power2.out",
          },
          0,
        )
        .to(
          "[data-spectrum-component] #svg-container",
          {
            transform: "scaleY(1) translateY(0px)",
            duration: 1.2,
            ease: "power2.out",
          },
          0.3,
        )
        .to(
          "[data-spectrum-component] #nav-bottom-left, [data-spectrum-component] #nav-bottom-right, [data-spectrum-component] #nav-bottom-center",
          {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          0.2,
        )
        .to(
          allSplitLines,
          {
            duration: 0.8,
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.08,
            ease: "power2.out",
          },
          0.9,
        )
        .to(".level-5", { y: "-25vh", duration: 0.8, ease: "power2.out" }, 0.9)
        .to(".level-4", { y: "-20vh", duration: 0.8, ease: "power2.out" }, 0.9)
        .to(".level-3", { y: "-15vh", duration: 0.8, ease: "power2.out" }, 0.9)
        .to(".level-2", { y: "-10vh", duration: 0.8, ease: "power2.out" }, 0.9)
        .to(".level-1", { y: "-5vh", duration: 0.8, ease: "power2.out" }, 0.9);
      } catch (error) {
        console.error("Spectrum animation initialization failed:", error);
      }
    };

    initAnimations();

    // Handle resize with debouncing
    const debouncedResize = debounce(() => ScrollTrigger.refresh(), 100);
    window.addEventListener("resize", debouncedResize, { passive: true });

    return () => {
      window.removeEventListener("resize", debouncedResize);
      debouncedResize.cancel();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMounted]);

  // Hero nav hover effects
  useEffect(() => {
    if (!isMounted || !heroNavRef.current || !gradientOverlayRef.current)
      return;

    try {
      const heroNav = heroNavRef.current;
      const gradientOverlay = gradientOverlayRef.current;
      const navItems = heroNav.querySelectorAll("[id^='hero-nav-item']");

    const navGradients = [
      "radial-gradient(circle, #1A1A1A 0%, #404040 50%, transparent 100%)",
      "radial-gradient(circle, #404040 0%, #666666 50%, transparent 100%)",
      "radial-gradient(circle, #666666 0%, #999999 50%, transparent 100%)",
      "radial-gradient(circle, #999999 0%, #CCCCCC 50%, transparent 100%)",
      "radial-gradient(circle, #CCCCCC 0%, #E5E5E5 50%, transparent 100%)",
      "radial-gradient(circle, #E5E5E5 0%, #F5F5F5 50%, transparent 100%)",
      "radial-gradient(circle, #F5F5F5 0%, #FFFFFF 50%, transparent 100%)",
      "radial-gradient(circle, #FFFFFF 0%, #E5E5E5 50%, transparent 100%)",
      "radial-gradient(circle, #999999 0%, #666666 50%, transparent 100%)",
    ];

    const handleMouseEnter = (index: number) => {
      gradientOverlay.style.background = navGradients[index];
      gradientOverlay.style.opacity = "0.3";

      navItems.forEach((navItem, navIndex) => {
        const distance = Math.abs(index - navIndex);
        let opacity = 1;

        if (navIndex === index) {
          opacity = 1;
          (navItem as HTMLElement).classList.add("active");
        } else if (distance === 1) {
          opacity = 0.6;
          (navItem as HTMLElement).classList.remove("active");
        } else if (distance === 2) {
          opacity = 0.3;
          (navItem as HTMLElement).classList.remove("active");
        } else {
          opacity = 0.1;
          (navItem as HTMLElement).classList.remove("active");
        }

        (navItem as HTMLElement).style.opacity = opacity.toString();
      });
    };

    const handleMouseLeave = () => {
      navItems.forEach((navItem) => {
        (navItem as HTMLElement).style.opacity = "1";
        (navItem as HTMLElement).classList.remove("active");
      });
      gradientOverlay.style.opacity = "0";
    };

    navItems.forEach((item, index) => {
      item.addEventListener("mouseenter", () => handleMouseEnter(index));
    });

    heroNav.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        navItems.forEach((item, index) => {
          item.removeEventListener("mouseenter", () => handleMouseEnter(index));
        });
        heroNav.removeEventListener("mouseleave", handleMouseLeave);
      };
    } catch (error) {
      console.error("Spectrum hover effects initialization failed:", error);
    }
  }, [isMounted]);


  if (!isMounted) {
    return null; // Prevent SSR mismatch
  }

  return (
    <div className={styles.spectrum} data-spectrum-component>
      {/* Header */}
      <header className={styles.header}>
        <nav>
          <div
            id="nav-top-left"
            className={`${styles.navItem} ${styles.navTopLeft}`}
          >
            PRÏSMAEON
          </div>
          <div
            id="nav-top-right"
            className={`${styles.navItem} ${styles.navTopRight}`}
          >
            <a href="mailto:hi@prismaeon.com" className={styles.emailLink}>
              hi@PRÏSM.COM
            </a>{" "}
            — 2025
          </div>
          <div
            id="nav-bottom-center"
            ref={scrollHintRef}
            className={`${styles.navItem} ${styles.navBottomCenter} ${styles.splitText}`}
          >
            Scroll to explore
          </div>
        </nav>
      </header>

      {/* Background Gradients */}
      <div className={styles.bgGradients}>
        <div className={`${styles.bgGradient} ${styles.bgGradient1}`}></div>
        <div className={`${styles.bgGradient} ${styles.bgGradient2}`}></div>
        <div className={`${styles.bgGradient} ${styles.bgGradient3}`}></div>
      </div>

      <div
        id="gradient-overlay"
        ref={gradientOverlayRef}
        className={styles.gradientOverlay}
      ></div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div ref={heroTitleRef} className={styles.heroTitle}>
          <div className={styles.heroTitleMain}>9D PRÏSMAEON</div>{" "}
          <div className={styles.heroTitleChinese}>久违之光 · 穿界越限</div>
        </div>
        <div className={styles.heroContent}>
          <div ref={heroNavRef} className={styles.heroNav}>
            <div
              id="hero-nav-item-0"
              className={`${styles.heroNavItem} ${styles.splitText}`}
            >
              <p className={styles.chinese}>大数据分析 与 调研</p>
              <p className={styles.english}>Data Analytics & Research</p>
            </div>
            <div
              id="hero-nav-item-1"
              className={`${styles.heroNavItem} ${styles.splitText}`}
            >
              <p className={styles.chinese}>顶层战略架构与策划</p>
              <p className={styles.english}>Strategy Architecture & Planning</p>
            </div>
            <div
              id="hero-nav-item-2"
              className={`${styles.heroNavItem} ${styles.splitText}`}
            >
              <p className={styles.chinese}>品牌产品穿越化创意与设计</p>
              <p className={styles.english}>Creative Directing & Design</p>
            </div>
            <div
              id="hero-nav-item-3"
              className={`${styles.heroNavItem} ${styles.splitText}`}
            >
              <p className={styles.chinese}>品牌穿越化感官系统</p>
              <p className={styles.english}>Brand Sensory System</p>
            </div>
            <div
              id="hero-nav-item-4"
              className={`${styles.heroNavItem} ${styles.splitText}`}
            >
              <p className={styles.chinese}>穿越化产品包装设计</p>
              <p className={styles.english}>Product Packaging Design</p>
            </div>
            <div
              id="hero-nav-item-5"
              className={`${styles.heroNavItem} ${styles.splitText}`}
            >
              <p className={styles.chinese}>新媒体定制运维服务</p>
              <p className={styles.english}>
                New Media Customization & Operation
              </p>
            </div>
            <div
              id="hero-nav-item-6"
              className={`${styles.heroNavItem} ${styles.splitText}`}
            >
              <p className={styles.chinese}>穿越化IP创造及授权</p>
              <p className={styles.english}>IP Creation & Licensing</p>
            </div>
            <div
              id="hero-nav-item-7"
              className={`${styles.heroNavItem} ${styles.splitText}`}
            >
              <p className={styles.chinese}>穿越化视觉</p>
              <p className={styles.english}>Visualization</p>
            </div>
            <div
              id="hero-nav-item-8"
              className={`${styles.heroNavItem} ${styles.splitText}`}
            >
              <p className={styles.chinese}>策略推广</p>
              <p className={styles.english}>Strategy Promotion</p>
            </div>
          </div>

          <div ref={heroTextRef} className={styles.heroTextContent}>
            <div
              id="hero-text-0"
              className={`${styles.heroText} ${styles.splitText}`}
            >
              The &quot;Transcendence &amp; Buyability&quot; Framework,
              pioneered by PRÏSM,
              <br />
              <br />
              Empowered by an A-Team of data scientists, statisticians, and
              global creatives一and guided by proven channel strategy一we
              systematically dismantle barriers to growth by deeply analyzing,
              strategically deconstructing, and powerfully reinventing your
              global brand and product portfolio.
            </div>
            <div
              id="hero-text-1"
              className={`${styles.heroTextChinese} ${styles.splitText}`}
            >
              PRïSM 瓴境
              独创的「穿越化·买点论」，是驱动品牌全球增长的核心引擎。它系统化地解决在全球化征程中遇到的认知、审美与商业隔阂。这不仅仅是一套方法论，更是一种战略操作系统：它将陌生的文化翻译为共鸣的故事，将抽象的数据激活为具体的买点，将原有的产品重构为市场的焦点。不仅打破市场壁垒，更深层次地重塑产品价值与品牌引力。我们依托4A级数据分析团队与统计学博士团队，融汇海内外一线的创意设计力量，并以深耕多年的渠道认知为战略罗盘，全方位地洞察、解构与重塑您的品牌与产品，为成功的全球化拓展奠定坚实基础。
            </div>
          </div>
        </div>
      </section>

      <div className={styles.scrollSpace}></div>

      {/* Animation Section */}
      <div id="animation-section" className={styles.animationSection}>
        <div className={styles.footerContainer}>
          <div
            id="svg-container"
            ref={svgContainerRef}
            className={styles.svgContainer}
          >
            <svg
              className={styles.spectrumSvg}
              viewBox="0 0 1567 584"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g ref={svgGroupRef} clipPath="url(#clip)" filter="url(#blur)">
                <path d="M1219 584H1393V184H1219V584Z" fill="url(#grad0)" />
                <path d="M1045 584H1219V104H1045V584Z" fill="url(#grad1)" />
                <path
                  d="M348 584H174L174 184H348L348 584Z"
                  fill="url(#grad2)"
                />
                <path
                  d="M522 584H348L348 104H522L522 584Z"
                  fill="url(#grad3)"
                />
                <path d="M697 584H522L522 54H697L697 584Z" fill="url(#grad4)" />
                <path d="M870 584H1045V54H870V584Z" fill="url(#grad5)" />
                <path d="M870 584H697L697 0H870L870 584Z" fill="url(#grad6)" />
                <path
                  d="M174 585H0.000183105L-3.75875e-06 295H174L174 585Z"
                  fill="url(#grad7)"
                />
                <path d="M1393 584H1567V294H1393V584Z" fill="url(#grad8)" />
              </g>
              <defs>
                <filter
                  id="blur"
                  x="-30"
                  y="-30"
                  width="1627"
                  height="644"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="15"
                    result="effect1_foregroundBlur"
                  />
                </filter>
                {/* Monochrome gradients */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <linearGradient
                    key={i}
                    id={`grad${i}`}
                    x1="0"
                    y1="584"
                    x2="0"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor={MONOCHROME_COLORS[0]} />
                    <stop offset="0.182709" stopColor={MONOCHROME_COLORS[1]} />
                    <stop offset="0.283673" stopColor={MONOCHROME_COLORS[2]} />
                    <stop offset="0.413484" stopColor={MONOCHROME_COLORS[3]} />
                    <stop offset="0.586565" stopColor={MONOCHROME_COLORS[4]} />
                    <stop offset="0.682722" stopColor={MONOCHROME_COLORS[5]} />
                    <stop offset="0.802892" stopColor={MONOCHROME_COLORS[6]} />
                    <stop
                      offset="1"
                      stopColor={MONOCHROME_COLORS[7]}
                      stopOpacity="0"
                    />
                  </linearGradient>
                ))}
                <clipPath id="clip">
                  <rect width="1567" height="584" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div id="text-grid" ref={textGridRef} className={styles.textGrid}>
            {[
              { level: "level-1", text: "精准\n洞察" },
              { level: "level-2", text: "全局\n掌控" },
              { level: "level-3", text: "文化\n适配" },
              { level: "level-4", text: "情感\n共鸣" },
              { level: "level-5", text: "美学\n表达" },
              { level: "level-4", text: "持续\n互动" },
              { level: "level-3", text: "资产\n沉淀" },
              { level: "level-2", text: "感官\n冲击" },
              { level: "level-1", text: "全域\n共振" },
            ].map((item, index) => (
              <div key={index} className={styles.textColumn}>
                <div
                  id="wavelength-label"
                  className={`${styles.wavelengthLabel} ${
                    styles[item.level]
                  } ${styles.splitText}`}
                >
                  {item.text.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spectrum;
