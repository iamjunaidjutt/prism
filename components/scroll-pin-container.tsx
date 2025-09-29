"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ScrollPinContainerProps {
	children: React.ReactNode[];
}

const ScrollPinContainer: React.FC<ScrollPinContainerProps> = ({
	children,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;

		// Wait for components to initialize before setting up pins
		const timeout = setTimeout(() => {
			const sections = container.querySelectorAll(".pin-section");

			// Create pin effect for each section
			sections.forEach((section) => {
				ScrollTrigger.create({
					trigger: section,
					start: "top top",
					end: "bottom top",
					pin: true,
					pinSpacing: true,
					anticipatePin: 1,
					invalidateOnRefresh: true,
				});
			});
		}, 200); // Increased timeout to ensure components load

		// Cleanup
		return () => {
			clearTimeout(timeout);
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	}, []);

	return (
		<div ref={containerRef} style={{ width: "100%" }}>
			{children.map((child, index) => (
				<div
					key={index}
					className="pin-section"
					// style={{
					// 	width: "100vw",
					// 	height: "100vh",
					// 	position: "relative",
					// 	display: "flex",
					// 	alignItems: "center",
					// 	justifyContent: "center",
					// 	zIndex: 1,
					// }}
				>
					{child}
				</div>
			))}
		</div>
	);
};

export default ScrollPinContainer;
