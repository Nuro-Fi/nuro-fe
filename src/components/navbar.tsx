"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { WalletButton } from "@/components/wallet/custom-wallet";
import Image from "next/image";
import { useUserAddress } from "@/hooks/use-user-address";
import { useEffect } from "react";
import {
  DEFAULT_CHAIN,
  getChainBySlug,
  getChainById,
} from "@/lib/constants/chains";
import { useConnection } from "wagmi";

const navItems = [
  { label: "Markets", href: "/markets" },
  { label: "Swap", href: "/swap" },
  { label: "History", href: "/history" },
  { label: "Faucet", href: "/faucet" },
];

export const Navbar = () => {
  useConnection();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useUserAddress();
  // For Circle SDK, we use the default chain since the wallet is on ARC Testnet
  const chainId = 5042002; // ARC Testnet chain ID

  const chainParam = params?.chain as string;

  const currentChainConfig =
    getChainBySlug(chainParam) ||
    getChainById(Number(chainParam)) ||
    DEFAULT_CHAIN;

  const currentChainSlug = currentChainConfig?.slug || DEFAULT_CHAIN.slug;

  useEffect(() => {
    if (currentChainConfig) {
      if (chainParam === currentChainConfig.chainIdNumber.toString()) {
        const newPath = pathname.replace(
          `/${chainParam}`,
          `/${currentChainConfig.slug}`,
        );
        router.replace(newPath);
        return;
      }

      if (
        isConnected &&
        chainId &&
        chainId !== currentChainConfig.chainIdNumber
      ) {
        const targetChainConfig = getChainById(chainId);
        if (targetChainConfig) {
          const newPath = pathname.replace(
            `/${chainParam}`,
            `/${targetChainConfig.slug}`,
          );
          router.replace(newPath);
        }
      }
    }
  }, [isConnected, chainId, currentChainConfig, chainParam, pathname, router]);

  return (
    <header className="sticky top-0 z-50 flex justify-center px-2 pt-4 pb-2 pointer-events-none">
      <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full border border-white/15 bg-white/6 px-6 py-2.5 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <Link href={`/${currentChainSlug}/markets`} className="flex items-center gap-2.5">
          <Image
            src="/nurologo-tg.png"
            alt="NuroFi"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="text-lg font-bold tracking-tight text-white">
            NuroFi
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const href = `/${currentChainSlug}${item.href}`;
            const isActive = pathname?.startsWith(href);

            return (
              <Link
                key={item.href}
                href={href}
                className={`font-normal text-sm uppercase tracking-wider transition-colors hover:text-white ${
                  isActive ? "text-white" : "text-white/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center">
          <WalletButton />
        </div>
      </div>
    </header>
  );
};
