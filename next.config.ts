import type { NextConfig } from "next";

// Bundle analyzer
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Bundle optimization
  experimental: {
    optimizePackageImports: ["gsap", "three", "@gsap/react"],
    optimizeServerReact: true,
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          maxSize: 200000, // 200KB chunks for better performance
          minSize: 20000, // 20KB minimum chunk size
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              maxSize: 200000,
            },
            gsap: {
              test: /[\\/]node_modules[\\/](gsap|@gsap)[\\/]/,
              name: "gsap",
              chunks: "all",
              priority: 20,
              maxSize: 150000, // Smaller GSAP chunks
            },
            three: {
              test: /[\\/]node_modules[\\/]three[\\/]/,
              name: "three",
              chunks: "all",
              priority: 20,
              maxSize: 100000, // Smaller Three.js chunks
            },
            shaders: {
              test: /[\\/]shaders[\\/]/,
              name: "shaders",
              chunks: "all",
              priority: 15,
              maxSize: 50000, // Small shader chunks
            },
            glitchEffects: {
              test: /[\\/]components[\\/]glitch[\\/]/,
              name: "glitch-effects",
              chunks: "all",
              priority: 10,
              maxSize: 100000, // Split glitch components
            },
          },
        },
        // Reduce main thread blocking
        minimize: true,
        minimizer: [
          ...config.optimization.minimizer,
        ],
      };

      // Tree shaking optimizations
      config.resolve.alias = {
        ...config.resolve.alias,
        // Use lighter alternatives where possible
        'three': 'three',
      };
    }

    // Add performance hints with stricter limits
    config.performance = {
      hints: 'warning',
      maxEntrypointSize: 300000, // 300KB (reduced from 512KB)
      maxAssetSize: 200000, // 200KB (reduced from 512KB)
    };

    return config;
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
