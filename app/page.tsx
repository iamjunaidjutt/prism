import { Suspense, lazy } from "react";

// Lazy load components for code splitting
const FutureCircle = lazy(() => import("@/components/future-circle"));
const Spectrum = lazy(() => import("@/components/spectrum"));
const GlitchAnimation = lazy(() => import("@/components/glitch"));

// Loading component
const ComponentLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-primary-bg">
    <div className="animate-pulse">
      <div className="w-8 h-8 border-2 border-primary-text border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

export default function Home() {
  return (
    <>
      <Suspense fallback={<ComponentLoader />}>
        <FutureCircle />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <Spectrum />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <GlitchAnimation />
      </Suspense>
    </>
  );
}