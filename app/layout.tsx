import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.scss";

import Cursor from "@/components/cursor";
import SmoothScroll from "@/components/smooth-scroll";
import ErrorBoundary from "@/components/error-boundary";
import { initPerformanceMonitoring } from "@/utils/performance";

// Optimized font loading
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Only load when needed
});

export const metadata: Metadata = {
  title: {
    default: "PRÏSMAEON - 穿越化",
    template: "%s | PRÏSMAEON"
  },
  description: "PRÏSMAEON - 穿越化品牌创意与设计工作室，专注于品牌穿越化感官系统、产品包装设计、新媒体定制运维服务等全方位品牌解决方案。",
  keywords: ["PRÏSMAEON", "穿越化", "品牌设计", "创意设计", "包装设计", "品牌策略", "数据分析", "调研"],
  authors: [{ name: "PRÏSMAEON" }],
  creator: "PRÏSMAEON",
  publisher: "PRÏSMAEON",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://prismaeon.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://prismaeon.com",
    title: "PRÏSMAEON - 穿越化",
    description: "PRÏSMAEON - 穿越化品牌创意与设计工作室",
    siteName: "PRÏSMAEON",
  },
  twitter: {
    card: "summary_large_image",
    title: "PRÏSMAEON - 穿越化",
    description: "PRÏSMAEON - 穿越化品牌创意与设计工作室",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7e7ce" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize performance monitoring
  if (typeof window !== "undefined") {
    initPerformanceMonitoring();
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <SmoothScroll>
            <Cursor />
            {children}
          </SmoothScroll>
        </ErrorBoundary>
      </body>
    </html>
  );
}
