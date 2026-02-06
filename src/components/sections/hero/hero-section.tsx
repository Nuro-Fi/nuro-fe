"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="z-10 flex items-center gap-3">
        <h1 className="hero-title">Lending Markets</h1>

        <ConnectButton.Custom>
          {({ chain, mounted }) => {
            if (!mounted || !chain || chain.unsupported) return null;

            return (
              <div className="flex items-center justify-center opacity-80 transition-opacity hover:opacity-100">
                {chain.hasIcon && chain.iconUrl && (
                  <div className="overflow-hidden rounded-full shadow-[0_0_15px_rgba(255,108,12,0.2)]">
                    <Image
                      alt={chain.name ?? "Chain icon"}
                      src={chain.iconUrl}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </section>
  );
};
