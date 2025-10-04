"use client";

import React from "react";
import styles from "./glitch.module.scss";
import dynamic from "next/dynamic";

// Import will be done dynamically to avoid SSR issues with Three.js
const GlitchSliderClient = dynamic(() => import("./GlitchSliderClient"), {
	ssr: false,
	loading: () => (
		<div
			style={{
				width: "100vw",
				height: "100vh",
				background: "#000",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "#fff",
			}}
		>
			Loading...
		</div>
	),
});

const GlitchAnimation = () => {
	return (
		<div className={styles.glitchContainer}>
			<GlitchSliderClient />
		</div>
	);
};

export default GlitchAnimation;
