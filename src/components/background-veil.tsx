"use client";

import dynamic from "next/dynamic";

const DarkVeil = dynamic(() => import("@/components/DarkVeil"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black/20" />,
});

export function BackgroundVeil() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0  rotate-180">
        <DarkVeil
          hueShift={45}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={3}
          scanlineFrequency={0}
          warpAmount={0}
        />
      </div>
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
