"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./future-circle.module.scss";
import Image from "next/image";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const FutureCircle = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const elements = container.querySelectorAll("#future-svg circle");
		const logo = container.querySelector("#logo-image");
		const outer = container.querySelector("#outer-circle");
		const dotted = container.querySelector("#dotted-circle");
		const innerSlim = container.querySelector("#inner-slim-circle");
		const innerFat = container.querySelector("#inner-fat-circle");

		if (
			!elements.length ||
			!logo ||
			!outer ||
			!dotted ||
			!innerSlim ||
			!innerFat
		)
			return;

		// Initialize animations with ScrollTrigger
		gsap.set([elements, logo], {
			scale: 0,
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

		// ScrollTrigger animation
		const scrollTl = gsap.timeline({
			scrollTrigger: {
				trigger: container,
				// markers: true,
				start: "top 30%",
				end: "bottom 80%",
				scrub: 1,
				onEnter: () => rotationTimeline.play(),
				onLeave: () => rotationTimeline.pause(),
				onEnterBack: () => rotationTimeline.play(),
				onLeaveBack: () => rotationTimeline.pause(),
			},
		});

		// Scale in animation
		scrollTl.to([elements, logo], {
			scale: 1,
			duration: 1,
			ease: "power2.out",
		});

		// Morph animations
		scrollTl.to(
			innerFat,
			{
				strokeDasharray: "188.5 377",
				duration: 1,
			},
			"-=0.5"
		);

		scrollTl.to(
			dotted,
			{
				attr: { r: 210 },
				duration: 1,
			},
			"-=0.5"
		);

		scrollTl.to(
			outer,
			{
				attr: { r: 240 },
				duration: 1,
			},
			"-=1"
		);

		// Cleanup function
		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			gsap.killTweensOf([
				elements,
				logo,
				outer,
				dotted,
				innerSlim,
				innerFat,
			]);
		};
	}, []);

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
		</div>
	);
};

export default FutureCircle;
