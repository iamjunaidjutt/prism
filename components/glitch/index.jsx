"use client";

import React from "react";
import styles from "./glitch.module.scss";
import GlitchSlider from "./GlitchSlider";

const GlitchAnimation = () => {
  return (
    <div className={styles.glitchContainer}>
      <GlitchSlider />
    </div>
  );
};

export default GlitchAnimation;
