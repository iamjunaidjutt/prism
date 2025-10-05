"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

// Create context for Lenis instance
const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => {
	const lenis = useContext(LenisContext);
	return lenis;
};

export default function SmoothScroll({
	children,
}: {
	children: React.ReactNode;
}) {
	const lenisRef = useRef<Lenis | null>(null);

	useEffect(() => {
		// Initialize Lenis
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: "vertical",
			gestureOrientation: "vertical",
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
			infinite: false,
		});

		lenisRef.current = lenis;

		// Connect Lenis scroll to GSAP ScrollTrigger
		lenis.on("scroll", ScrollTrigger.update);

		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});

		gsap.ticker.lagSmoothing(0);

		// Cleanup
		return () => {
			lenis.destroy();
			gsap.ticker.remove((time) => {
				lenis.raf(time * 1000);
			});
		};
	}, []);

	return (
		<LenisContext.Provider value={lenisRef.current}>
			{children}
		</LenisContext.Provider>
	);
}
