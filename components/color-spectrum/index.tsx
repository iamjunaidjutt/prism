"use client";

import React, {
	useRef,
	useEffect,
	useState,
	useCallback,
	useMemo,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./color-spectrum.module.scss";
import Link from "next/link";

// Register GSAP plugins
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

// Color themes configuration - custom chrome gray to light champagne theme
const colorThemes = {
	monochrome: [
		"#1A1A1A",
		"#404040",
		"#666666",
		"#b0b0b0",
		"#f7e7ce",
		"#f7e7ce",
		"#f7e7ce",
		"#f7e7ce",
	],
};

const ColorSpectrum = () => {
	const [isMounted, setIsMounted] = useState(false);
	const wavelengthTexts = useMemo(
		() => [
			"精准\n洞察",
			"全局\n掌控",
			"文化\n适配",
			"情感\n共鸣",
			"美学\n表达",
			"持续\n互动",
			"资产\n沉淀",
			"感官\n冲击",
			"全域\n共振",
		],
		[]
	);
	const [currentTheme] = useState("monochrome");
	const [blurEnabled, setBlurEnabled] = useState(true);

	// Refs
	const containerRef = useRef<HTMLDivElement>(null);
	const heroTitleRef = useRef<HTMLHeadingElement>(null);
	const svgContainerRef = useRef<HTMLDivElement>(null);
	const mainTitleRef = useRef<HTMLDivElement>(null);
	const gradientOverlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const updateGradients = useCallback((theme: string) => {
		const colors = colorThemes[theme as keyof typeof colorThemes];
		if (!colors) return;

		// Add a small delay to ensure SVG is rendered
		setTimeout(() => {
			// Update SVG gradients
			for (let i = 0; i < 9; i++) {
				const gradient = document.getElementById(`grad${i}`);
				if (gradient) {
					const stops = gradient.querySelectorAll("stop");
					stops.forEach((stop, idx) => {
						if (colors[idx]) {
							stop.setAttribute("stop-color", colors[idx]);
						} else if (colors[colors.length - 1]) {
							stop.setAttribute(
								"stop-color",
								colors[colors.length - 1]
							);
						}
					});
				}
			}
		}, 100);
	}, []);

	// Additional useEffect to ensure gradients are updated after component mounts
	useEffect(() => {
		if (isMounted) {
			setTimeout(() => {
				updateGradients(currentTheme);
			}, 300);
		}
	}, [isMounted, updateGradients, currentTheme]);

	const updateColors = useCallback(
		(theme: string) => {
			const colors = colorThemes[theme as keyof typeof colorThemes];
			if (!colors) return;

			// Use chrome gray to light champagne theme
			const darkShades = ["#1A1A1A", "#404040", "#666666"]; // Dark colors for backgrounds
			const lightShades = ["#b0b0b0", "#f7e7ce", "#f7e7ce", "#f7e7ce"]; // Chrome gray to light champagne for text

			// Update CSS custom properties with dark background and light text
			document.documentElement.style.setProperty(
				"--color-bg",
				darkShades[0] // Darkest shade for main background
			);
			document.documentElement.style.setProperty(
				"--color-text",
				lightShades[3] // Lightest shade for main text
			);
			document.documentElement.style.setProperty(
				"--color-text-light",
				lightShades[1] // Light shade for secondary text
			);
			document.documentElement.style.setProperty(
				"--color-text-lighter",
				lightShades[0] // Medium light shade for subtle text
			);

			// Update gradient colors to use chrome gray to light champagne progression
			const simplifiedColors = [
				darkShades[0], // #1A1A1A
				darkShades[1], // #404040
				darkShades[2], // #666666
				lightShades[0], // #b0b0b0 (chrome gray)
				lightShades[1], // #f7e7ce (light champagne)
				lightShades[2], // #f7e7ce (light champagne)
				lightShades[3], // #f7e7ce (light champagne)
				lightShades[3], // #f7e7ce (light champagne, repeat for consistency)
			];

			simplifiedColors.forEach((color, index) => {
				document.documentElement.style.setProperty(
					`--grad-color-${index + 1}`,
					color
				);
			});

			updateGradients(theme);
		},
		[updateGradients]
	);

	const toggleBlur = useCallback(() => {
		const svgGroup = document.querySelector('g[clip-path="url(#clip)"]');

		if (blurEnabled) {
			svgGroup?.removeAttribute("filter");
			setBlurEnabled(false);
		} else {
			svgGroup?.setAttribute("filter", "url(#blur)");
			setBlurEnabled(true);
		}
	}, [blurEnabled]);

	// Initialize animations
	useGSAP(
		() => {
			if (!isMounted) return;

			console.log("Simple GSAP Animation Starting...");
			updateColors(currentTheme);

			// Force wavelength labels to be visible immediately
			const wavelengthElements = containerRef.current?.querySelectorAll(
				`.${styles.wavelengthLabel}, .wavelength-label`
			);
			console.log(
				`Found ${wavelengthElements?.length || 0} wavelength elements`
			);

			if (wavelengthElements) {
				wavelengthElements.forEach((el) => {
					if (el instanceof HTMLElement) {
						el.style.opacity = "1";
						el.style.transform = "translateY(0)";
						el.style.filter = "blur(0)";
					}
				});
			}

			// Clean up any existing timelines and animations
			gsap.killTweensOf("*");

			// Hero animations
			const heroTl = gsap.timeline({ delay: 0.5 });

			// Title animation
			if (heroTitleRef.current) {
				const chars = heroTitleRef.current.textContent?.split("") || [];
				heroTitleRef.current.innerHTML = chars
					.map((char) =>
						char === " " ? " " : `<span class="char">${char}</span>`
					)
					.join("");

				const charElements =
					heroTitleRef.current.querySelectorAll(".char");

				gsap.set(charElements, {
					opacity: 0,
					filter: "blur(8px)",
					x: -20,
				});

				heroTl.to(
					charElements,
					{
						opacity: 1,
						filter: "blur(0px)",
						x: 0,
						duration: 0.8,
						stagger: 0.03,
						ease: "power2.out",
					},
					0
				);
			}

			// Hero Text Content Animation - animate from down to up
			const heroTextElements = document.querySelectorAll(
				`.${styles.heroTextContent} .${styles.heroText}, .${styles.heroTextContent} .${styles.heroTextChinese}`
			);
			if (heroTextElements.length > 0) {
				gsap.set(heroTextElements, {
					opacity: 0,
					y: 50, // Start 50px below
					filter: "blur(4px)",
				});

				heroTl.to(
					heroTextElements,
					{
						opacity: 1,
						y: 0, // Move to original position
						filter: "blur(0px)",
						duration: 1.0,
						stagger: 0.2, // Stagger each text block
						ease: "power2.out",
					},
					0.5 // Start after title animation begins
				);
			}

			// Hero Nav Animation (left side) - animate from down to up
			const heroNavElements = document.querySelectorAll(
				`.${styles.heroNavItem}`
			);
			if (heroNavElements.length > 0) {
				gsap.set(heroNavElements, {
					opacity: 0,
					y: 40, // Start 40px below
					filter: "blur(3px)",
				});

				heroTl.to(
					heroNavElements,
					{
						opacity: 1,
						y: 0, // Move to original position
						filter: "blur(0px)",
						duration: 0.8,
						stagger: 0.15, // Stagger each nav item
						ease: "power2.out",
					},
					0.4 // Start slightly before heroTextContent
				);
			}

			// Wavelength Text Animation - animate from down to up
			const heroWavelengthElements = document.querySelectorAll(
				`.${styles.wavelengthLabel}, .wavelength-label`
			);
			if (heroWavelengthElements && heroWavelengthElements.length > 0) {
				gsap.set(heroWavelengthElements, {
					opacity: 0,
					y: 30, // Start 30px below
					filter: "blur(3px)",
				});

				heroTl.to(
					heroWavelengthElements,
					{
						opacity: 1,
						y: 0, // Move to original position
						filter: "blur(0px)",
						duration: 0.8,
						stagger: {
							amount: 1.2, // Total time for all staggers
							from: "start", // Stagger from left to right
							ease: "power2.out",
						},
						ease: "power2.out",
					},
					1.0 // Start after hero text content
				);
			}

			// Force initial states to ensure proper initialization
			// SVG Container
			gsap.set(svgContainerRef.current, {
				visibility: "visible",
				opacity: 0,
				scaleY: 0.05,
				y: -30,
			});

			// Text Grid and Main Title - Force visibility and reset properties
			if (mainTitleRef.current) {
				gsap.set(mainTitleRef.current, {
					visibility: "visible",
					opacity: 0,
					y: 30,
					filter: "blur(8px)",
					force3D: true,
				});
			}

			// Force text grid visibility
			gsap.set(`.${styles.textGrid}`, {
				visibility: "visible",
				opacity: 0,
				force3D: true,
			});

			// Initialize ALL wavelength labels - wait for DOM to be ready
			const initializeWavelengthLabels = () => {
				console.log(
					`Initializing ${wavelengthTexts.length} wavelength labels`
				);

				// Use both class selector and data attributes for maximum coverage
				const allWavelengthElements =
					containerRef.current?.querySelectorAll(
						`.${styles.wavelengthLabel}, .wavelength-label`
					);
				console.log(
					`Found ${
						allWavelengthElements?.length || 0
					} wavelength elements via class`
				);

				// Initialize all found elements
				if (allWavelengthElements && allWavelengthElements.length > 0) {
					gsap.set(allWavelengthElements, {
						visibility: "visible",
						opacity: 0,
						y: 30,
						filter: "blur(0px)",
						force3D: true,
						clearProps: "filter,transform", // Clear any existing properties
					});
				}

				// Double-check with data-index targeting
				for (let i = 0; i < wavelengthTexts.length; i++) {
					const wavelengthElement =
						containerRef.current?.querySelector(
							`[data-index="${i}"]`
						);

					if (wavelengthElement) {
						console.log(
							`Found and initializing wavelength element ${i}`
						);
						gsap.set(wavelengthElement, {
							visibility: "visible",
							opacity: 0,
							y: 30,
							filter: "blur(0px)",
							force3D: true,
							clearProps: "filter,transform",
						});
					} else {
						console.warn(`Wavelength element ${i} not found!`);
					}
				}
			};

			// Call immediately and also with a small delay to ensure DOM is ready
			setTimeout(initializeWavelengthLabels, 50);
			setTimeout(initializeWavelengthLabels, 200);

			// Sequential animation: spectrum first, then text grid titles in stagger
			const scrollTl = gsap.timeline({
				scrollTrigger: {
					trigger: ".animation-section",
					start: "top bottom",
					end: "bottom top",
					scrub: 0.5, // Reduced scrub for smoother animation
					markers: false,
					refreshPriority: 1,
					onEnter: () =>
						console.log("ScrollTrigger: Animation started"),
					onUpdate: (self) => {
						console.log(
							`ScrollTrigger progress: ${self.progress.toFixed(
								3
							)}`
						);
					},
				},
			}); // Step 1: Spectrum appears first (early in scroll)
			scrollTl
				.to(
					svgContainerRef.current,
					{
						opacity: 1,
						scaleY: 1,
						y: 0,
						duration: 0.4, // Increased duration for smoother animation
						ease: "power2.inOut", // Changed to inOut for smoother transition
					},
					0
				)
				// Step 2: Text grid container becomes visible
				.to(
					`.${styles.textGrid}`,
					{
						opacity: 1,
						duration: 0.15, // Slightly increased
						ease: "power2.inOut",
					},
					0.15 // Adjusted timing
				);

			// Step 3: Animate wavelength titles in stagger (after spectrum appears)
			scrollTl.to(
				`.${styles.wavelengthLabel}, .wavelength-label`,
				{
					opacity: 1,
					y: 0,
					filter: "blur(0px)",
					duration: 0.5, // Increased duration
					stagger: {
						amount: 0.8, // Increased stagger time for smoother effect
						from: "center", // Stagger from center outward
						ease: "power2.inOut",
					},
					ease: "power2.inOut", // Changed to inOut for smoother transition
				},
				0.25 // Slightly adjusted timing
			);

			// Step 4: Animate main title after wavelength titles
			scrollTl.to(
				`.${styles.mainTitle}`,
				{
					opacity: 1,
					y: 0,
					filter: "blur(0px)",
					duration: 0.5, // Increased duration
					ease: "power2.inOut", // Changed to inOut for smoother transition
				},
				0.8 // Adjusted timing to work with new wavelength timing
			);

			// Step 5: Animate spectrum levels (depth effect)
			const levelAnimationStart = 0.6; // Adjusted timing
			scrollTl
				.to(
					".level-5",
					{ y: "-25vh", duration: 1.0, ease: "power2.inOut" }, // Increased duration and smoother easing
					levelAnimationStart
				)
				.to(
					".level-4",
					{ y: "-20vh", duration: 1.0, ease: "power2.inOut" },
					levelAnimationStart
				)
				.to(
					".level-3",
					{ y: "-15vh", duration: 1.0, ease: "power2.inOut" },
					levelAnimationStart
				)
				.to(
					".level-2",
					{ y: "-10vh", duration: 1.0, ease: "power2.inOut" },
					levelAnimationStart
				)
				.to(
					".level-1",
					{ y: "-5vh", duration: 1.0, ease: "power2.inOut" },
					levelAnimationStart
				);

			console.log("Main title animation scheduled at 0.9s");
			console.log("Animation setup complete");

			// Ensure ScrollTrigger updates on resize
			const handleResize = () => {
				ScrollTrigger.refresh();
			};

			window.addEventListener("resize", handleResize);

			// Cleanup function
			return () => {
				window.removeEventListener("resize", handleResize);
			};
		},
		{
			scope: containerRef,
			dependencies: [
				isMounted,
				currentTheme,
				updateColors,
				wavelengthTexts,
			],
			revertOnUpdate: true, // This ensures proper cleanup when dependencies change
		}
	);

	if (!isMounted) {
		return null; // Avoid hydration mismatch
	}

	return (
		<div ref={containerRef} className={styles.colorSpectrum}>
			{/* Background Gradients */}
			<div className={styles.bgGradients}>
				<div className={`${styles.bgGradient} ${styles.bgGradient1}`} />
				<div className={`${styles.bgGradient} ${styles.bgGradient2}`} />
				<div className={`${styles.bgGradient} ${styles.bgGradient3}`} />
			</div>

			{/* Gradient Overlay */}
			<div ref={gradientOverlayRef} className={styles.gradientOverlay} />

			{/* Header Navigation */}
			<header className={styles.header}>
				<div className={`${styles.navItem} ${styles.navTopLeft}`}>
					PRISMAEON
				</div>
				<div className={`${styles.navItem} ${styles.navTopRight}`}>
					<Link
						href="mailto:hi@prismaeon.com"
						className={styles.emailLink}
					>
						hi@PRISM.COM
					</Link>{" "}
					— 2025
				</div>
			</header>

			{/* Hero Section */}
			<section className={styles.heroSection}>
				{/* Blur Toggle */}
				<div className={styles.blurToggle}>
					<span className={styles.blurBtn} onClick={toggleBlur}>
						{blurEnabled ? "Blur Off" : "Blur On"}
					</span>
				</div>

				<div ref={heroTitleRef} className={styles.heroTitle}>
					<div className={styles.heroTitleMain}>9D PRISMAEON</div>{" "}
					<div className={styles.heroTitleChinese}>
						久违之光 · 穿界越限
					</div>
				</div>

				<div className={styles.heroContent}>
					<div className={styles.heroNav}>
						{[
							{
								chinese: "大数据分析 与 调研",
								english: "Data Analytics & Research",
							},
							{
								chinese: "顶层战略架构与策划",
								english: "Strategy Architecture & Planning",
							},
							{
								chinese: "品牌产品穿越化创意与设计",
								english: "Creative Directing & Design",
							},
							{
								chinese: "品牌穿越化感官系统",
								english: "Brand Sensory System",
							},
							{
								chinese: "穿越化产品包装设计",
								english: "Product Packaging Design",
							},
							{
								chinese: "新媒体定制运维服务",
								english: "New Media Customization & Operation",
							},
							{
								chinese: "穿越化IP创造及授权",
								english: "IP Creation & Licensing",
							},
							{
								chinese: "穿越化视觉",
								english: "Visualization",
							},
							{
								chinese: "策略推广",
								english: "Strategy Promotion",
							},
						].map((item, index) => (
							<div key={index} className={styles.heroNavItem}>
								<p className={styles.chinese}>{item.chinese}</p>
								<p className={styles.english}>{item.english}</p>
							</div>
						))}
					</div>

					<div className={styles.heroTextContent}>
						<div className={styles.heroText}>
							The &quot;Transcendence &amp; Buyability&quot;
							Framework, pioneered by PRISM, Empowered by an
							A-Team of data scientists, statisticians, and global
							creatives一and guided by proven channel strategy一we
							systematically dismantle barriers to growth by
							deeply analyzing, strategically deconstructing, and
							powerfully reinventing your global brand and product
							portfolio.
						</div>
						<div className={styles.heroTextChinese}>
							PRISM 领域独创的「穿越化·买点论」
							是系统化解决品牌及产品在全球化增长中的认知、审美与商业隔阂的方法论。依托A级数据分析团队与统计学博士团队，结合海内外一线的创意设计力量，并由深耕多年的渠道认知反推，全方位洞察·解构·重塑您的品牌与产品
						</div>
					</div>
				</div>
			</section>

			{/* Scroll Space */}
			<div className={styles.scrollSpace} />

			{/* Animation Section */}
			<div className={`${styles.animationSection} animation-section`}>
				<div className={styles.footerContainer}>
					<div ref={svgContainerRef} className={styles.svgContainer}>
						<svg
							className={styles.spectrumSvg}
							viewBox="0 0 1567 584"
							preserveAspectRatio="none"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clipPath="url(#clip)" filter="url(#blur)">
								<path
									d="M1219 584H1393V184H1219V584Z"
									fill="url(#grad0)"
								/>
								<path
									d="M1045 584H1219V104H1045V584Z"
									fill="url(#grad1)"
								/>
								<path
									d="M348 584H174L174 184H348L348 584Z"
									fill="url(#grad2)"
								/>
								<path
									d="M522 584H348L348 104H522L522 584Z"
									fill="url(#grad3)"
								/>
								<path
									d="M697 584H522L522 54H697L697 584Z"
									fill="url(#grad4)"
								/>
								<path
									d="M870 584H1045V54H870V584Z"
									fill="url(#grad5)"
								/>
								<path
									d="M870 584H697L697 0H870L870 584Z"
									fill="url(#grad6)"
								/>
								<path
									d="M174 585H0.000183105L-3.75875e-06 295H174L174 585Z"
									fill="url(#grad7)"
								/>
								<path
									d="M1393 584H1567V294H1393V584Z"
									fill="url(#grad8)"
								/>
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
									<feFlood
										floodOpacity="0"
										result="BackgroundImageFix"
									/>
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
								<linearGradient
									id="grad0"
									x1="1306"
									y1="584"
									x2="1306"
									y2="184"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#340B05" />
									<stop
										offset="0.182709"
										stopColor="#0358F7"
									/>
									<stop
										offset="0.283673"
										stopColor="#5092C7"
									/>
									<stop
										offset="0.413484"
										stopColor="#E1ECFE"
									/>
									<stop
										offset="0.586565"
										stopColor="#FFD400"
									/>
									<stop
										offset="0.682722"
										stopColor="#FA3D1D"
									/>
									<stop
										offset="0.802892"
										stopColor="#FD02F5"
									/>
									<stop
										offset="1"
										stopColor="#FFC0FD"
										stopOpacity="0"
									/>
								</linearGradient>
								<linearGradient
									id="grad1"
									x1="1132"
									y1="584"
									x2="1132"
									y2="104"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#340B05" />
									<stop
										offset="0.182709"
										stopColor="#0358F7"
									/>
									<stop
										offset="0.283673"
										stopColor="#5092C7"
									/>
									<stop
										offset="0.413484"
										stopColor="#E1ECFE"
									/>
									<stop
										offset="0.586565"
										stopColor="#FFD400"
									/>
									<stop
										offset="0.682722"
										stopColor="#FA3D1D"
									/>
									<stop
										offset="0.802892"
										stopColor="#FD02F5"
									/>
									<stop
										offset="1"
										stopColor="#FFC0FD"
										stopOpacity="0"
									/>
								</linearGradient>
								<linearGradient
									id="grad2"
									x1="261"
									y1="584"
									x2="261"
									y2="184"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#340B05" />
									<stop
										offset="0.182709"
										stopColor="#0358F7"
									/>
									<stop
										offset="0.283673"
										stopColor="#5092C7"
									/>
									<stop
										offset="0.413484"
										stopColor="#E1ECFE"
									/>
									<stop
										offset="0.586565"
										stopColor="#FFD400"
									/>
									<stop
										offset="0.682722"
										stopColor="#FA3D1D"
									/>
									<stop
										offset="0.802892"
										stopColor="#FD02F5"
									/>
									<stop
										offset="1"
										stopColor="#FFC0FD"
										stopOpacity="0"
									/>
								</linearGradient>
								<linearGradient
									id="grad3"
									x1="435"
									y1="584"
									x2="435"
									y2="104"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#340B05" />
									<stop
										offset="0.182709"
										stopColor="#0358F7"
									/>
									<stop
										offset="0.283673"
										stopColor="#5092C7"
									/>
									<stop
										offset="0.413484"
										stopColor="#E1ECFE"
									/>
									<stop
										offset="0.586565"
										stopColor="#FFD400"
									/>
									<stop
										offset="0.682722"
										stopColor="#FA3D1D"
									/>
									<stop
										offset="0.802892"
										stopColor="#FD02F5"
									/>
									<stop
										offset="1"
										stopColor="#FFC0FD"
										stopOpacity="0"
									/>
								</linearGradient>
								<linearGradient
									id="grad4"
									x1="609.501"
									y1="584"
									x2="609.501"
									y2="54"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#340B05" />
									<stop
										offset="0.182709"
										stopColor="#0358F7"
									/>
									<stop
										offset="0.283673"
										stopColor="#5092C7"
									/>
									<stop
										offset="0.413484"
										stopColor="#E1ECFE"
									/>
									<stop
										offset="0.586565"
										stopColor="#FFD400"
									/>
									<stop
										offset="0.682722"
										stopColor="#FA3D1D"
									/>
									<stop
										offset="0.802892"
										stopColor="#FD02F5"
									/>
									<stop
										offset="1"
										stopColor="#FFC0FD"
										stopOpacity="0"
									/>
								</linearGradient>
								<linearGradient
									id="grad5"
									x1="957.5"
									y1="584"
									x2="957.5"
									y2="54"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#340B05" />
									<stop
										offset="0.182709"
										stopColor="#0358F7"
									/>
									<stop
										offset="0.283673"
										stopColor="#5092C7"
									/>
									<stop
										offset="0.413484"
										stopColor="#E1ECFE"
									/>
									<stop
										offset="0.586565"
										stopColor="#FFD400"
									/>
									<stop
										offset="0.682722"
										stopColor="#FA3D1D"
									/>
									<stop
										offset="0.802892"
										stopColor="#FD02F5"
									/>
									<stop
										offset="1"
										stopColor="#FFC0FD"
										stopOpacity="0"
									/>
								</linearGradient>
								<linearGradient
									id="grad6"
									x1="783.501"
									y1="584"
									x2="783.501"
									y2="0"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#340B05" />
									<stop
										offset="0.182709"
										stopColor="#0358F7"
									/>
									<stop
										offset="0.283673"
										stopColor="#5092C7"
									/>
									<stop
										offset="0.413484"
										stopColor="#E1ECFE"
									/>
									<stop
										offset="0.586565"
										stopColor="#FFD400"
									/>
									<stop
										offset="0.682722"
										stopColor="#FA3D1D"
									/>
									<stop
										offset="0.802892"
										stopColor="#FD02F5"
									/>
									<stop
										offset="1"
										stopColor="#FFC0FD"
										stopOpacity="0"
									/>
								</linearGradient>
								<linearGradient
									id="grad7"
									x1="87.0003"
									y1="585"
									x2="87.0003"
									y2="295"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#340B05" />
									<stop
										offset="0.182709"
										stopColor="#0358F7"
									/>
									<stop
										offset="0.283673"
										stopColor="#5092C7"
									/>
									<stop
										offset="0.413484"
										stopColor="#E1ECFE"
									/>
									<stop
										offset="0.586565"
										stopColor="#FFD400"
									/>
									<stop
										offset="0.682722"
										stopColor="#FA3D1D"
									/>
									<stop
										offset="0.802892"
										stopColor="#FD02F5"
									/>
									<stop
										offset="1"
										stopColor="#FFC0FD"
										stopOpacity="0"
									/>
								</linearGradient>
								<linearGradient
									id="grad8"
									x1="1480"
									y1="584"
									x2="1480"
									y2="294"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#340B05" />
									<stop
										offset="0.182709"
										stopColor="#0358F7"
									/>
									<stop
										offset="0.283673"
										stopColor="#5092C7"
									/>
									<stop
										offset="0.413484"
										stopColor="#E1ECFE"
									/>
									<stop
										offset="0.586565"
										stopColor="#FFD400"
									/>
									<stop
										offset="0.682722"
										stopColor="#FA3D1D"
									/>
									<stop
										offset="0.802892"
										stopColor="#FD02F5"
									/>
									<stop
										offset="1"
										stopColor="#FFC0FD"
										stopOpacity="0"
									/>
								</linearGradient>
								<clipPath id="clip">
									<rect
										width="1567"
										height="584"
										fill="white"
									/>
								</clipPath>
							</defs>
						</svg>
					</div>

					<div
						ref={mainTitleRef}
						className={`${styles.mainTitle} split-text`}
					>
						Where Light Becomes Color
						<br />
						Across the Infinite Spectrum
					</div>

					<div className={styles.textGrid}>
						{wavelengthTexts.map((text, index) => (
							<div key={index} className={styles.textColumn}>
								<div
									className={`${styles.wavelengthLabel} ${
										styles[
											`level${Math.max(
												1,
												Math.min(
													5,
													5 - Math.abs(4 - index)
												)
											)}`
										]
									} wavelength-label level-${Math.max(
										1,
										Math.min(5, 5 - Math.abs(4 - index))
									)} split-text`}
									data-index={index}
								>
									{text.split("\n").map((line, lineIndex) => (
										<React.Fragment key={lineIndex}>
											{line}
											{lineIndex <
												text.split("\n").length - 1 && (
												<br />
											)}
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

export default ColorSpectrum;
