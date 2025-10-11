"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

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

const Cursor: React.FC = () => {
  const [showCursor, setShowCursor] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Optimized resize handler
  const checkCursorVisibility = useCallback(() => {
    setShowCursor(window.innerWidth >= 1024);
  }, []);

  const debouncedResize = useCallback(
    debounce(checkCursorVisibility, 100),
    [checkCursorVisibility]
  );

  // Only show on desktop with optimized resize handling
  useEffect(() => {
    checkCursorVisibility();
    window.addEventListener("resize", debouncedResize, { passive: true });
    return () => {
      window.removeEventListener("resize", debouncedResize);
      debouncedResize.cancel();
    };
  }, [checkCursorVisibility, debouncedResize]);

  useGSAP(() => {
    if (!showCursor) return;
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
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleClick);
    };
  }, [showCursor]);

  if (!showCursor) return null;

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
        background: "#f7e7ce",
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
