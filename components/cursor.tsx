"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Cursor: React.FC = () => {
	const cursorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const cursor = cursorRef.current;
		if (!cursor) return;

		let mouseX = window.innerWidth / 2;
		let mouseY = window.innerHeight / 2;

		const moveCursor = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		window.addEventListener("mousemove", moveCursor);

		// GSAP animation loop
		gsap.ticker.add(() => {
			gsap.to(cursor, {
				x: mouseX,
				y: mouseY,
				duration: 0.2,
				ease: "power3.out",
			});
		});

		// Scale on click
		const handleClick = () => {
			gsap.to(cursor, {
				scale: 1.5,
				duration: 0.15,
				yoyo: true,
				repeat: 1,
			});
		};
		window.addEventListener("mousedown", handleClick);

		// Cleanup
		return () => {
			window.removeEventListener("mousemove", moveCursor);
			window.removeEventListener("mousedown", handleClick);
			gsap.ticker.remove(moveCursor);
		};
	}, []);

	return (
		<div
			ref={cursorRef}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: 32,
				height: 32,
				borderRadius: "50%",
				background: "rgba(79,70,229,0.7)",
				pointerEvents: "none",
				zIndex: 9999,
				mixBlendMode: "difference",
				transform: "translate(-50%, -50%)",
				willChange: "transform",
			}}
		/>
	);
};

export default Cursor;
