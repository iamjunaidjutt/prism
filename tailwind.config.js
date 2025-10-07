module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css,scss}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: "320px",
      mSm: "330px",
      lSm: "375px",
      llSm: "425px",
      minTab: "575px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "2xlM": "1700px",
      "3xl": "1920px",
    },
    extend: {
      // Color Palette
      colors: {
        primary: {
          bg: "#1a1a1a",
          text: "#ffffff",
          "text-light": "#e5e5e5",
          "text-lighter": "#cccccc",
          "text-dark": "#2d2d2d",
        },
        chrome: {
          "dark-gray": "#1A1A1A",
          gray: "#404040",
          "medium-gray": "#666666",
          "light-gray": "#b0b0b0",
          "lighter-gray": "#999999",
          "lightest-gray": "#CCCCCC",
          silver: "#E5E5E5",
          "light-silver": "#F5F5F5",
        },
        champagne: {
          light: "#f7e7ce",
          DEFAULT: "#f7e7ce",
        },
      },

      // Font Families
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
        "supply-mono": ["PPSupplyMono", "monospace"],
        "neue-montreal": ["PP Neue Montreal", "sans-serif"],
      },

      // Font Sizes
      fontSize: {
        "2xs": "0.65rem",
        "3xs": "0.5rem",
        "4xs": "7px",
        "5xs": "5px",
        "6xs": "3px",
        "7px": "7px",
        "9px": "9px",
        "10px": "10px",
        "11px": "11px",
        "12px": "12px",
        "14px": "14px",
        "17px": "17px",
        "18px": "18px",
        "20px": "20px",
        "22px": "22px",
        "25px": "25px",
        "28px": "28px",
        "30px": "30px",
        "33px": "33px",
        "36px": "36px",
        "38px": "38px",
        "45px": "45px",
        "48px": "48px",
        "1rem": "1rem",
        "1.2rem": "1.2rem",
        "1.4rem": "1.4rem",
        "1.5rem": "1.5rem",
        "1.8rem": "1.8rem",
        "2rem": "2rem",
        "4rem": "4rem",
        "2.5vw": "2.5vw",
        "3vw": "3vw",
        "4.5vw": "4.5vw",
        "5vw": "5vw",
      },

      // Letter Spacing
      letterSpacing: {
        "tight-1": "-0.02vw",
        "tight-2": "-0.02em",
        "wide-1": "0.05em",
        "wide-2": "0.1em",
        "wide-3": "0.15em",
        "wide-4": "0.2em",
        "0.3px": "0.3px",
        "0.5px": "0.5px",
      },

      // Spacing & Sizing
      spacing: {
        "300px": "300px",
        "350px": "350px",
        "400px": "400px",
        "450px": "450px",
        "500px": "500px",
        "550px": "550px",
        "600px": "600px",
        "650px": "650px",
        "700px": "700px",
        "750px": "750px",
        "800px": "800px",
      },

      // Positioning
      inset: {
        "2%": "2%",
        "10%": "10%",
        "-10%": "-10%",
        "-15%": "-15%",
        "-20%": "-20%",
        "-25%": "-25%",
        "12%": "12%",
        "18%": "18%",
        "20%": "20%",
        "30%": "30%",
      },

      // Heights
      height: {
        "50vh": "50vh",
        "70vh": "70vh",
        "80vh": "80vh",
        "100vh": "100vh",
        "150vh": "150vh",
        "250vh": "250vh",
        "18px": "18px",
        "20px": "20px",
        "24px": "24px",
        "50px": "50px",
        "60px": "60px",
        "70px": "70px",
        "250px": "250px",
        "280px": "280px",
      },

      // Widths
      width: {
        "25%": "25%",
        "35%": "35%",
        "40%": "40%",
        "45%": "45%",
        "50%": "50%",
        "55%": "55%",
        "60%": "60%",
        "65%": "65%",
        "75%": "75%",
        "80%": "80%",
        "150%": "150%",
        "140%": "140%",
        "150px": "150px",
        "180px": "180px",
        "200px": "200px",
        "220px": "220px",
        "250px": "250px",
        "280px": "280px",
        "300px": "300px",
        "350px": "350px",
        "400px": "400px",
        "450px": "450px",
        "500px": "500px",
        fit: "fit-content",
      },

      // Max Widths
      maxWidth: {
        "250px": "250px",
        "300px": "300px",
      },

      // Z-index
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        5: "5",
        10: "10",
        15: "15",
        20: "20",
        100: "100",
        1000: "1000",
      },

      // Opacity
      opacity: {
        15: "0.15",
        75: "0.75",
        100: "1",
      },

      // Border Radius
      borderRadius: {
        "999rem": "999rem",
      },

      // Transitions
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.23, 1, 0.32, 1)",
        "bounce-out": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "power2-out": "cubic-bezier(0.215, 0.61, 0.355, 1)",
        expo: "cubic-bezier(0.87, 0, 0.13, 1)",
      },

      // Transition Duration
      transitionDuration: {
        200: "200ms",
        300: "300ms",
        400: "400ms",
        600: "600ms",
        800: "800ms",
        1000: "1000ms",
        1500: "1500ms",
      },

      // Transition Property
      transitionProperty: {
        "transform-color": "transform, color",
        "opacity-color": "opacity, color",
        width: "width",
        all: "all",
      },

      // Animations
      keyframes: {
        auraGlow: {
          "0%": { backgroundPosition: "0 100%" },
          "100%": { backgroundPosition: "0 300%" },
        },
      },
      animation: {
        "aura-glow": "auraGlow 5s infinite linear",
      },

      // Blur
      blur: {
        "1px": "1px",
        "3px": "3px",
        "4px": "4px",
        "8px": "8px",
        "15px": "15px",
        "40px": "40px",
        "60px": "60px",
      },

      // Box Shadow (for glows and depth)
      boxShadow: {
        glow: "0 0 60px rgba(247, 231, 206, 0.3)",
      },

      // Background Images (gradients)
      backgroundImage: {
        "radial-dark":
          "radial-gradient(ellipse at 50% 55%, transparent 10%, #303030 50%)",
        "radial-champagne":
          "radial-gradient(ellipse at 50% 75%, #f7e7ce 20%, transparent 75%)",
        "aura-gradient":
          "linear-gradient(15deg, #f7e7ce, #b0b0b0 16.5%, #f7e7ce80 33%, #b0b0b020 49.5%, #f7e7ce 66%, #b0b0b060 85.5%, #f7e7ce 100%)",
      },

      // Background Size
      backgroundSize: {
        "100-200": "100% 200%",
      },

      // Mix Blend Mode
      mixBlendMode: {
        overlay: "overlay",
        "plus-lighter": "plus-lighter",
      },

      // Transform Origin
      transformOrigin: {
        bottom: "bottom",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-wrap-balance": {
          "text-wrap": "balance",
        },
        ".will-change-transform-opacity-filter": {
          "will-change": "transform, opacity, filter",
        },
        ".will-change-transform-opacity-filter-color": {
          "will-change": "transform, opacity, filter, color",
        },
        ".will-change-clip-path": {
          "will-change": "clip-path",
        },
        ".will-change-transform": {
          "will-change": "transform",
        },
        ".will-change-opacity-filter": {
          "will-change": "opacity, filter",
        },
        ".mix-blend-overlay": {
          "mix-blend-mode": "overlay",
        },
        ".mix-blend-plus-lighter": {
          "mix-blend-mode": "plus-lighter",
        },
        ".hyphens-auto": {
          hyphens: "auto",
        },
      });
    },
  ],
};
