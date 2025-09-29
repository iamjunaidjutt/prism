"use client";

import React, { useEffect } from "react";
import { gsap } from "gsap";
import styles from "./future-circle.module.scss";
import Image from "next/image";

const FutureCircle = () => {
	useEffect(() => {
		const elements = document.querySelectorAll("#future-svg circle");
		const logo = document.querySelector("#logo-image");
		const outer = document.querySelector("#outer-circle");
		const dotted = document.querySelector("#dotted-circle");
		const innerSlim = document.querySelector("#inner-slim-circle");
		const innerFat = document.querySelector("#inner-fat-circle");

		if (
			!elements.length ||
			!logo ||
			!outer ||
			!dotted ||
			!innerSlim ||
			!innerFat
		)
			return;

		function animateIn() {
			const timeline = gsap.timeline({
				onComplete: () => {
					setTimeout(animateOut, 3000);
				},
			});

			timeline.to([elements, logo], 1, {
				scale: 1,
			});

			timeline.to(innerFat, 1, {
				strokeDasharray: "188.5 377",
			});

			timeline.to(dotted, 1, {
				attr: {
					r: 210,
				},
			});

			timeline.to(
				outer,
				1,
				{
					attr: {
						r: 240,
					},
				},
				"-=1"
			);

			timeline.play();
		}

		function setRotation() {
			gsap.to(outer, {
				rotation: 360,
				duration: 30,
				ease: "none",
				repeat: -1,
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
		}

		function animateOut() {
			const timeline = gsap.timeline({
				onComplete: () => {
					setTimeout(animateIn, 3000);
				},
			});

			timeline.to(outer, 1, {
				attr: {
					r: 180,
				},
			});

			timeline.to(
				dotted,
				1,
				{
					attr: {
						r: 180,
					},
				},
				"-=1"
			);

			timeline.to(
				innerFat,
				1,
				{
					strokeDasharray: "1131 0",
				},
				"-=1"
			);

			timeline.to([elements, logo], 1, {
				scale: 0,
			});
		}

		// Initialize animations
		gsap.set([elements, logo], {
			scale: 0,
			transformOrigin: "50% 50%",
		});

		setRotation();
		animateIn();

		// Cleanup function
		return () => {
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
		<div className={styles.container}>
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
