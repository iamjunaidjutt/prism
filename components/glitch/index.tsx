"use client";

import React from "react";
import styles from "./glitch.module.scss";
import dynamic from "next/dynamic";
import LoadingAnimation from "./LoadingAnimation";

// Import will be done dynamically to avoid SSR issues with Three.js
const GlitchSlider = dynamic(() => import("./GlitchSlider"), {
	ssr: false,
	loading: () => <LoadingAnimation />,
});

const GlitchAnimation = () => {
	return (
		<div className={styles.glitchContainer}>
			<GlitchSlider />
		</div>
	);
};

export default GlitchAnimation;
