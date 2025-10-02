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

// Register GSAP plugins
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

// Color themes configuration
const colorThemes = {
	original: [
		"#340B05",
		"#0358F7",
		"#5092C7",
		"#E1ECFE",
		"#FFD400",
		"#FA3D1D",
		"#FD02F5",
		"#FFC0FD",
	],
	"blue-pink": [
		"#1E3A8A",
		"#3B82F6",
		"#A855F7",
		"#EC4899",
		"#F472B6",
		"#F9A8D4",
		"#FBCFE8",
		"#FDF2F8",
	],
	"blue-orange": [
		"#1E40AF",
		"#3B82F6",
		"#60A5FA",
		"#FFFFFF",
		"#FED7AA",
		"#FB923C",
		"#EA580C",
		"#9A3412",
	],
	sunset: [
		"#FEF3C7",
		"#FCD34D",
		"#F59E0B",
		"#D97706",
		"#B45309",
		"#92400E",
		"#78350F",
		"#451A03",
	],
	purple: [
		"#F3E8FF",
		"#E9D5FF",
		"#D8B4FE",
		"#C084FC",
		"#A855F7",
		"#9333EA",
		"#7C3AED",
		"#6B21B6",
	],
	monochrome: [
		"#1A1A1A",
		"#404040",
		"#666666",
		"#999999",
		"#CCCCCC",
		"#E5E5E5",
		"#F5F5F5",
		"#FFFFFF",
	],
	"pink-purple": [
		"#FDF2F8",
		"#FCE7F3",
		"#F9A8D4",
		"#F472B6",
		"#EC4899",
		"#BE185D",
		"#831843",
		"#500724",
	],
	"blue-black": [
		"#000000",
		"#0F172A",
		"#1E293B",
		"#334155",
		"#475569",
		"#64748B",
		"#94A3B8",
		"#CBD5E1",
	],
	"beige-black": [
		"#FEF3C7",
		"#F59E0B",
		"#D97706",
		"#92400E",
		"#451A03",
		"#1C1917",
		"#0C0A09",
		"#000000",
	],
};

const darkThemes = ["blue-black", "beige-black", "monochrome"];

const ColorSpectrum = () => {
	const [isMounted, setIsMounted] = useState(false);
	const wavelengthTexts = useMemo(
		() => [
			"Data\nAnalytics\n& Research",
			"Strategy\nArchitecture\n& Planning",
			"Creative\nDirecting\n& Design",
			"Brand\nSensory\nSystem",
			"Product\nPackaging\nDesign",
			"New Media\nCustomization\n& Operation",
			"IP Creation\n& Licensing",
			"Visualization",
			"Strategy\nPromotion",
		],
		[]
	);
	const [currentTheme, setCurrentTheme] = useState("original");
	const [blurEnabled, setBlurEnabled] = useState(true);
	const [soundEnabled, setSoundEnabled] = useState(false);

	// Refs
	const containerRef = useRef<HTMLDivElement>(null);
	const heroTitleRef = useRef<HTMLHeadingElement>(null);
	const svgContainerRef = useRef<HTMLDivElement>(null);
	const mainTitleRef = useRef<HTMLDivElement>(null);
	const gradientOverlayRef = useRef<HTMLDivElement>(null);

	// Audio files (optional - implement if needed)
	const audioFiles = useRef({
		whoosh: null as HTMLAudioElement | null,
		glitch: null as HTMLAudioElement | null,
		reverb: null as HTMLAudioElement | null,
	});

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const playSound = useCallback(
		(soundName: keyof typeof audioFiles.current) => {
			if (soundEnabled && audioFiles.current[soundName]) {
				const audio = audioFiles.current[soundName];
				if (audio) {
					audio.currentTime = 0;
					audio.play().catch(() => {});
				}
			}
		},
		[soundEnabled]
	);

	const updateGradients = useCallback((theme: string) => {
		const colors = colorThemes[theme as keyof typeof colorThemes];
		if (!colors) return;

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
	}, []);

	const updateColors = useCallback(
		(theme: string) => {
			const colors = colorThemes[theme as keyof typeof colorThemes];
			if (!colors) return;

			const isDarkTheme = darkThemes.includes(theme);

			// Update CSS custom properties
			document.documentElement.style.setProperty(
				"--color-bg",
				isDarkTheme ? "#1a1a1a" : "#f5f5f5"
			);
			document.documentElement.style.setProperty(
				"--color-text",
				isDarkTheme ? "#ffffff" : "#333"
			);
			document.documentElement.style.setProperty(
				"--color-text-light",
				isDarkTheme ? "#cccccc" : "#666"
			);
			document.documentElement.style.setProperty(
				"--color-text-lighter",
				isDarkTheme ? "#999999" : "#999"
			);

			// Update gradient colors
			colors.forEach((color, index) => {
				document.documentElement.style.setProperty(
					`--grad-color-${index + 1}`,
					color
				);
			});

			updateGradients(theme);
		},
		[updateGradients]
	);

	const generateRandomColor = useCallback(() => {
		const hue = Math.floor(Math.random() * 360);
		const saturation = Math.floor(Math.random() * 40) + 60;
		const lightness = Math.floor(Math.random() * 50) + 30;
		return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
	}, []);

	const randomizeColors = useCallback(() => {
		playSound("glitch");
		const randomColors = Array.from({ length: 8 }, () =>
			generateRandomColor()
		);

		// Update gradients with random colors
		for (let i = 0; i < 9; i++) {
			const gradient = document.getElementById(`grad${i}`);
			if (gradient) {
				const stops = gradient.querySelectorAll("stop");
				stops.forEach((stop, idx) => {
					if (randomColors[idx]) {
						stop.setAttribute("stop-color", randomColors[idx]);
					} else if (randomColors[randomColors.length - 1]) {
						stop.setAttribute(
							"stop-color",
							randomColors[randomColors.length - 1]
						);
					}
				});
			}
		}

		// Animate SVG container
		if (svgContainerRef.current) {
			gsap.to(svgContainerRef.current, {
				scale: 1.02,
				duration: 0.2,
				yoyo: true,
				repeat: 1,
				ease: "power2.inOut",
			});
		}
	}, [playSound, generateRandomColor]);

	const toggleBlur = useCallback(() => {
		const svgGroup = document.querySelector('g[clip-path="url(#clip)"]');
		playSound("whoosh");

		if (blurEnabled) {
			svgGroup?.removeAttribute("filter");
			setBlurEnabled(false);
		} else {
			svgGroup?.setAttribute("filter", "url(#blur)");
			setBlurEnabled(true);
		}
	}, [blurEnabled, playSound]);

	const toggleSound = useCallback(() => {
		setSoundEnabled(!soundEnabled);
	}, [soundEnabled]);

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
					scrub: 1,
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
			});

			// Step 1: Spectrum appears first (early in scroll)
			scrollTl
				.to(
					svgContainerRef.current,
					{
						opacity: 1,
						scaleY: 1,
						y: 0,
						duration: 0.3,
						ease: "power2.out",
					},
					0
				)
				// Step 2: Text grid container becomes visible
				.to(
					`.${styles.textGrid}`,
					{
						opacity: 1,
						duration: 0.1,
						ease: "power2.out",
					},
					0.2
				);

			// Step 3: Animate wavelength titles in stagger (after spectrum appears)
			scrollTl.to(
				`.${styles.wavelengthLabel}, .wavelength-label`,
				{
					opacity: 1,
					y: 0,
					filter: "blur(0px)",
					duration: 0.4,
					stagger: {
						amount: 0.6, // Total time for all staggers
						from: "center", // Stagger from center outward
						ease: "power2.out",
					},
					ease: "power2.out",
				},
				0.3 // Start after spectrum appears
			);

			// Step 4: Animate main title after wavelength titles
			scrollTl.to(
				`.${styles.mainTitle}`,
				{
					opacity: 1,
					y: 0,
					filter: "blur(0px)",
					duration: 0.4,
					ease: "power2.out",
				},
				0.9 // Start after wavelength stagger completes
			);

			// Step 5: Animate spectrum levels (depth effect)
			const levelAnimationStart = 0.7; // Start slightly before main title
			scrollTl
				.to(
					".level-5",
					{ y: "-25vh", duration: 0.8, ease: "power2.out" },
					levelAnimationStart
				)
				.to(
					".level-4",
					{ y: "-20vh", duration: 0.8, ease: "power2.out" },
					levelAnimationStart
				)
				.to(
					".level-3",
					{ y: "-15vh", duration: 0.8, ease: "power2.out" },
					levelAnimationStart
				)
				.to(
					".level-2",
					{ y: "-10vh", duration: 0.8, ease: "power2.out" },
					levelAnimationStart
				)
				.to(
					".level-1",
					{ y: "-5vh", duration: 0.8, ease: "power2.out" },
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

			{/* Color Switcher */}
			<header className={styles.header}>
				<div className={styles.colorSwitcher}>
					{Object.keys(colorThemes).map((theme) => (
						<div
							key={theme}
							className={`${styles.colorBtn} ${
								styles[
									`theme${
										theme.charAt(0).toUpperCase() +
										theme
											.slice(1)
											.replace(/-([a-z])/g, (g) =>
												g[1].toUpperCase()
											)
									}`
								]
							} ${currentTheme === theme ? styles.active : ""}`}
							onClick={() => {
								setCurrentTheme(theme);
								updateColors(theme);
								playSound("reverb");
								if (svgContainerRef.current) {
									gsap.to(svgContainerRef.current, {
										scale: 1.02,
										duration: 0.2,
										yoyo: true,
										repeat: 1,
										ease: "power2.inOut",
									});
								}
							}}
						/>
					))}
				</div>

				<div className={styles.blurToggle}>
					<span className={styles.blurBtn} onClick={toggleBlur}>
						{blurEnabled ? "Blur Off" : "Blur On"}
					</span>
				</div>

				<div className={styles.randomizeToggle}>
					<span
						className={styles.randomizeBtn}
						onClick={randomizeColors}
					>
						Randomize
					</span>
				</div>

				<div className={`${styles.navItem} ${styles.navTopLeft}`}>
					Cosmic Spectrum
				</div>
				<div className={`${styles.navItem} ${styles.navTopRight}`}>
					<span>
						<a
							href="mailto:hi@prismaeon.com"
							className={styles.emailLink}
						>
							hi@prismaeon.com
						</a>{" "}
						— 2024
					</span>
					<div className={styles.soundToggle} onClick={toggleSound}>
						<svg className={styles.soundWave} viewBox="0 0 20 12">
							<path
								className={`${styles.waveLine} ${
									soundEnabled ? styles.waveAnimated : ""
								}`}
								d="M2 6 Q4 2 6 6 Q8 10 10 6 Q12 2 14 6 Q16 10 18 6"
							/>
						</svg>
					</div>
				</div>
				<div className={`${styles.navItem} ${styles.navBottomLeft}`}>
					Stellar Radiation
				</div>
				<div className={`${styles.navItem} ${styles.navBottomCenter}`}>
					Scroll to explore
				</div>
				<div className={`${styles.navItem} ${styles.navBottomRight}`}>
					Color Wavelengths
				</div>
			</header>

			{/* Hero Section */}
			<section className={styles.heroSection}>
				<h1 ref={heroTitleRef} className={styles.heroTitle}>
					Light Frequencies
				</h1>

				<div className={styles.heroContent}>
					<div className={styles.heroNav}>
						{[
							"Wave",
							"Photons",
							"Spectrum",
							"Frequencies",
							"Electromagnetic",
							"Wavelength",
							"Radiation",
							"Energy",
							"Light",
						].map((item, index) => (
							<div key={index} className={styles.heroNavItem}>
								{item}
							</div>
						))}
					</div>

					<div className={styles.heroTextContent}>
						<div className={styles.heroText}>
							In a universe where light becomes the language of
							existence, our cosmic spectrum emerges as a bridge
							between the seen and unseen. We capture wavelengths
							that define reality, blending electromagnetic
							frequencies with visual poetry.
						</div>
						<div className={styles.heroText}>
							Our collection is inspired by the raw energy of
							distant galaxies, where physics meets pure beauty.
							From violet waves to infrared radiation, we
							reimagine the electromagnetic spectrum for the
							curious minds.
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
