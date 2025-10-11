"use client";

import { useEffect, useRef, createContext, useContext, useCallback } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

// Debounce utility for performance
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout;
  
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  
  debounced.cancel = () => clearTimeout(timeout);
  
  return debounced as T & { cancel: () => void };
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
		try {
			// Initialize Lenis with optimized settings
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

			// Debounced scroll update for better performance
			const debouncedScrollUpdate = debounce(() => {
				ScrollTrigger.update();
			}, 16); // ~60fps

			// Connect Lenis scroll to GSAP ScrollTrigger
			lenis.on("scroll", debouncedScrollUpdate);

			// Optimized ticker function
			const tickerFunction = (time: number) => {
				lenis.raf(time * 1000);
			};

			gsap.ticker.add(tickerFunction);
			gsap.ticker.lagSmoothing(0);

			// Cleanup
			return () => {
				lenis.destroy();
				gsap.ticker.remove(tickerFunction);
				debouncedScrollUpdate.cancel();
			};
		} catch (error) {
			console.error("SmoothScroll initialization failed:", error);
		}
	}, []);

	return (
		<LenisContext.Provider value={lenisRef.current}>
			{children}
		</LenisContext.Provider>
	);
}
