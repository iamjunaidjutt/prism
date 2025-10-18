# Prism — Creative WebGL & Motion Showcase

A creative web showcase featuring interactive Three.js 3D shaders, GSAP motion, glitch effects, and Lenis smooth scrolling built on Next.js 15.

---

## Overview

Prism is an experimental, award-worthy creative web application exploring the intersection of modern 3D graphics, procedural shader effects, and fluid typography. It demonstrates high-performance WebGL rendering with React Three Fiber, synchronized GSAP timelines, and tactile cursor interactions.

---

## Core Visual Experiences

- **FutureCircle**: Procedural WebGL circular shader with real-time parameter tweaking via Tweakpane and kinetic entrance motion.
- **Spectrum**: Interactive 3D light dispersion and chromatic refraction built using Three.js and `@react-three/fiber`.
- **GlitchAnimation**: Interactive image displacement slider featuring digital scanlines and chromatic aberration.
- **Hardware-Accelerated Cursor**: Dual-element magnetic pointer tracking reactive to interactive canvas elements.
- **Lenis Smooth Scroll**: Unified inertial momentum scrolling synchronized with GSAP animation frames.

---

## Tech Stack

- **Framework**: Next.js 15 (Turbopack, App Router)
- **Runtime**: React 19
- **3D & Shaders**: Three.js, `@react-three/fiber`
- **Animation**: GSAP 3 (`@gsap/react`, ScrollTrigger)
- **Smooth Scrolling**: Lenis
- **Parameter Controls**: Tweakpane
- **Styling**: Sass (`.module.scss`), Tailwind CSS

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/iamjunaidjutt/prism.git
cd prism
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` to interact with the 3D scenes and motion components.

---

## Available Scripts

- `npm run dev` — Starts the Next.js local server with Turbopack.
- `npm run build` — Compiles and optimizes assets for production.
- `npm run build:analyze` — Generates a bundle visualization report via `@next/bundle-analyzer`.
- `npm run format` — Formats files using Prettier.
- `npm run lint` — Runs ESLint code quality rules.

---

## Project Structure

```
prism/
├── app/
│   ├── layout.jsx         # Root HTML layout and global providers
│   ├── page.jsx           # Main page mounting visual components with Suspense
│   ├── manifest.js        # Web application manifest
│   ├── robots.js          # Search crawler directives
│   └── sitemap.js         # Dynamic sitemap generator
├── components/
│   ├── cursor.jsx         # Hardware-accelerated interactive custom cursor
│   ├── future-circle/     # Interactive procedural circle shader
│   ├── glitch/            # Chromatic aberration and glitch slider
│   ├── spectrum/          # Three.js 3D spectrum light scene
│   ├── smooth-scroll.jsx  # Lenis smooth scrolling provider
│   └── error-boundary.jsx # Component-level error handling
├── package.json           # Dependencies and scripts
└── tailwind.config.js     # Tailwind CSS theme configuration
```

---

## License

This project is open-source and available under the [MIT License](LICENSE).
