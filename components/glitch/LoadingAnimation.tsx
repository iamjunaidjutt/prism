"use client";

import React, { useEffect, useRef } from "react";

const LoadingAnimation = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = 300;
		canvas.height = 300;

		let animationId: number;
		const startTime = Date.now();

		const animate = () => {
			const time = (Date.now() - startTime) * 0.001;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Simple loading animation
			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;

			// Draw center dot
			ctx.beginPath();
			ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
			ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
			ctx.fill();

			// Draw pulsing rings
			for (let i = 0; i < 5; i++) {
				const radius = 20 + i * 15;
				const count = 8 + i * 4;

				for (let j = 0; j < count; j++) {
					const angle = (j / count) * Math.PI * 2;
					const radiusPulse = Math.sin(time * 2 - i * 0.4) * 3;
					const x =
						centerX + Math.cos(angle) * (radius + radiusPulse);
					const y =
						centerY + Math.sin(angle) * (radius + radiusPulse);

					const opacity =
						0.4 + Math.sin(time * 2 - i * 0.4 + j * 0.2) * 0.6;

					ctx.beginPath();
					ctx.moveTo(centerX, centerY);
					ctx.lineTo(x, y);
					ctx.lineWidth = 0.8;
					ctx.strokeStyle = `rgba(255, 102, 102, ${opacity * 0.5})`;
					ctx.stroke();

					ctx.beginPath();
					ctx.arc(x, y, 2.5, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(255, 102, 102, ${opacity})`;
					ctx.fill();
				}
			}

			animationId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	}, []);

	return (
		<div
			style={{
				width: "100vw",
				height: "100vh",
				background: "#000",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<canvas ref={canvasRef} />
		</div>
	);
};

export default LoadingAnimation;
