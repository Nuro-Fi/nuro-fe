"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { WalletButton } from "@/components/wallet/custom-wallet";
import Image from "next/image";
import { useConnection } from "wagmi";
import { useEffect } from "react";
import {
  DEFAULT_CHAIN,
  getChainBySlug,
  getChainById,
} from "@/lib/constants/chains";

const navItems = [
  { label: "Markets", href: "/markets" },
  { label: "Swap", href: "/swap" },
  { label: "History", href: "/history" },
  { label: "Faucet", href: "/faucet" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { chainId, isConnected } = useConnection();

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
    <header className="sticky top-0 z-40 bg-white text-blue-900 border-b border-blue-200/50 backdrop-blur-xl shadow-sm">
      <div className="w-full px-4 md:px-16 py-3 flex items-center justify-between gap-5">
        <div className="flex items-center flex-1 min-w-0 gap-7">
          <div className="flex items-center gap-2 font-semibold tracking-widest uppercase text-sm">
            <Image
              src="/nuro.png"
              alt="nuro"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>

          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const href = `/${currentChainSlug}${item.href}`;
              const isActive = pathname?.startsWith(href);

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={`
                    relative text-sm font-semibold uppercase tracking-[0.16em] py-0.5 transition-colors duration-150
                    after:content-[''] after:absolute after:left-0 after:bottom-[-0.35rem] after:w-0 after:h-[2px] 
                    after:bg-linear-to-r after:from-blue-600 after:to-blue-400 after:transition-[width] after:duration-180 
                    hover:text-blue-700 hover:after:w-full
                    ${isActive ? "text-blue-600 after:w-full font-bold" : "text-blue-500"}
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <WalletButton />
        </div>
      </div>
    </header>
  );
};
