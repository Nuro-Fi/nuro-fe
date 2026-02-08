"use client";

import Image from "next/image";

export const HeroSection = () => {
  // Circle SDK wallet doesn't expose chain icon in the same way
  // Just show the title without chain icon for now
  return (
    <section className="hero-section">
      <div className="z-10 flex items-center gap-3">
        <h1 className="hero-title">Lending Markets</h1>
        <div className="flex items-center justify-center opacity-80 transition-opacity hover:opacity-100">
          <div className="overflow-hidden rounded-full border border-white/10">
            <Image
              alt="ARC Testnet"
              src="/chain/arc.png"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
