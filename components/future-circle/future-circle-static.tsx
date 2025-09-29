"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./future-circle.module.scss";
import Image from "next/image";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const FutureCircleStatic = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const logo = container.querySelector("#logo-image-static");

		if (!logo) return;

		// Only animate the logo with scroll effects
		gsap.fromTo(
			logo,
			{
				scale: 0,
				rotation: 0,
				opacity: 0,
			},
			{
				scale: 1,
				rotation: 360,
				opacity: 1,
				duration: 2,
				ease: "back.out(1.7)",
				scrollTrigger: {
					trigger: container,
					start: "top 80%",
					end: "center center",
					scrub: 1,
				},
			}
		);

		// Add floating effect to logo
		gsap.to(logo, {
			y: -20,
			duration: 2,
			ease: "sine.inOut",
			repeat: -1,
			yoyo: true,
			delay: 1,
		});

		// Cleanup function
		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			gsap.killTweensOf(logo);
		};
	}, []);

	return (
		<div ref={containerRef} className={styles.container}>
			<Image
				id="logo-image-static"
				src="/logo-1.png"
				alt="Logo"
				width={200}
				height={200}
				className={styles.logo}
			/>
			<svg
				id="future-svg-static"
				className={styles.svg}
				viewBox="0 0 500 500"
			>
				<circle
					className={styles.outer}
					stroke="#FFF"
					cy="250"
					cx="250"
					r="180"
					fill="none"
				></circle>
				<circle
					className={styles.dotted}
					stroke="#FFF"
					cy="250"
					cx="250"
					r="180"
					fill="none"
				></circle>
				<circle
					className={styles.inner_slim}
					stroke="#FFF"
					cy="250"
					cx="250"
					r="180"
					fill="none"
				></circle>
				<circle
					className={styles.inner_fat}
					stroke="#FFF"
					cy="250"
					cx="250"
					r="180"
					fill="none"
				></circle>
			</svg>
		</div>
	);
};

export default FutureCircleStatic;
