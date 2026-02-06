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
} from "@/lib/constants/chain";

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
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__left">
          <div className="navbar__brand">
            <Image
              src="/senja.png"
              alt="senja"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>

          <nav className="navbar__nav" aria-label="Main navigation">
            {navItems.map((item) => {
              const href = `/${currentChainSlug}${item.href}`;
              const isActive = pathname?.startsWith(href);

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={`navbar__link${
                    isActive ? " navbar__link--active" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="navbar__right">
          <WalletButton />
        </div>
      </div>
    </header>
  );
};