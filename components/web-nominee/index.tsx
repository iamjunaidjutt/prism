"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import styles from "./web-nominee.module.scss";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Easing functions (replacing easing-utils)
const easingFunctions = {
	linear: (t: number) => t,
	easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
	easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
	easeInCubic: (t: number) => t * t * t,
};

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

const WebNominee = () => {
	const containerRef = useRef<HTMLDivElement>(null);
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
			ease: keyof typeof easingFunctions = "linear"
		) => {
			const delta = end - start;
			const easeFn = easingFunctions[ease];
			return start + delta * easeFn(p);
		},
		[]
	);

	// Set canvas size
	const setSize = useCallback(() => {
		if (!containerRef.current || !canvasRef.current || !badgeRef.current)
			return;

		const rect = containerRef.current.getBoundingClientRect();
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
			disc.x = tweenValue(
				startDiscRef.current.x,
				endDiscRef.current.x,
				disc.p
			);
			disc.y = tweenValue(
				startDiscRef.current.y,
				endDiscRef.current.y,
				disc.p,
				"easeInExpo"
			);
			disc.w = tweenValue(
				startDiscRef.current.w,
				endDiscRef.current.w,
				disc.p,
				"easeOutCubic"
			);
			disc.h = tweenValue(
				startDiscRef.current.h,
				endDiscRef.current.h,
				disc.p,
				"easeOutCubic"
			);
			return disc;
		},
		[tweenValue]
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
				(linesRef.current.length - 1) * Math.random()
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
			Math.PI * 2
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
	}, [
		moveDiscs,
		moveParticles,
		setLines,
		drawDiscs,
		drawLines,
		drawParticles,
	]);

	// Resize handler
	const handleResize = useCallback(() => {
		setSize();
		setDiscs();
		setLines();
		setParticles();
	}, [setSize, setDiscs, setLines, setParticles]);

	// Initialize component
	useEffect(() => {
		setSize();
		setDiscs();
		setLines();
		setParticles();

		window.addEventListener("resize", handleResize);

		// ScrollTrigger for canvas animation
		let animationActive = false;

		ScrollTrigger.create({
			trigger: containerRef.current,
			start: "top 80%",
			end: "bottom 20%",
			onEnter: () => {
				if (!animationActive) {
					animationActive = true;
					animationFrameRef.current = requestAnimationFrame(tick);
				}
			},
			onLeave: () => {
				animationActive = false;
				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current);
				}
			},
			onEnterBack: () => {
				if (!animationActive) {
					animationActive = true;
					animationFrameRef.current = requestAnimationFrame(tick);
				}
			},
			onLeaveBack: () => {
				animationActive = false;
				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current);
				}
			},
		});

		// Badge animation with ScrollTrigger
		gsap.fromTo(
			badgeRef.current,
			{
				scale: 0,
				rotation: 180,
				opacity: 0,
			},
			{
				scale: 1,
				rotation: 0,
				opacity: 1,
				duration: 1.5,
				ease: "back.out(1.7)",
				scrollTrigger: {
					trigger: containerRef.current,
					start: "top 70%",
					end: "center center",
					scrub: 1,
				},
			}
		);

		return () => {
			window.removeEventListener("resize", handleResize);
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [handleResize, tick, setSize, setDiscs, setLines, setParticles]);

	return (
		<div ref={containerRef} className={styles.container}>
			<div className={styles.webbyNominee}>
				<div ref={badgeRef} className={styles.badge}>
					<Image
						src="/logo-2.png"
						alt="Webby Nominee Badge"
						width={300}
						height={300}
						className={styles.badgeImg}
					/>
					<span className={styles.badgeVote}>Vote Now!</span>
				</div>

				<div className={styles.aura}></div>
				<div className={styles.overlay}></div>
				<canvas ref={canvasRef} className={styles.canvas}></canvas>
			</div>
		</div>
	);
};

export default WebNominee;
