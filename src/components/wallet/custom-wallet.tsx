"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Wallet } from "lucide-react";
import { formatUnits } from "viem";
import useUserBalance from "@/hooks/use-balance";
import { LoadingState } from "@/components/ui/spinner";

export const WalletButton = () => {
  const { balance, decimals, symbol, isPending } = useUserBalance();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="
                      relative inline-flex items-center justify-center gap-2 px-3.5 py-2
                      text-xs uppercase tracking-[0.14em] cursor-pointer
                      bg-transparent border border-blue-600 text-blue-600
                      hover:bg-blue-50 hover:border-blue-700 hover:text-blue-800
                      transition-all duration-150
                    "
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="
                      relative inline-flex items-center justify-center gap-2 px-3.5 py-2
                      text-xs uppercase tracking-[0.14em] cursor-pointer
                      border border-red-300 bg-red-50 text-red-600
                      hover:bg-red-100 transition-colors duration-150
                    "
                  >
                    Wrong Network
                  </button>
                );
              }

              // Format balance for display
              let displayBalance: string | null = null;
              if (balance && decimals != null) {
                const formatted = formatUnits(balance, decimals);
                try {
                  const num = Number(formatted);
                  displayBalance = Number.isNaN(num)
                    ? formatted
                    : num.toFixed(4);
                } catch {
                  displayBalance = formatted;
                }
              }

              return (
                <div className="inline-flex items-stretch gap-2">
                  {/* Balance Display */}
                  {isPending ? (
                    <LoadingState balance />
                  ) : displayBalance ? (
                    <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-xs uppercase tracking-[0.14em]">
                      <span className="text-slate-500">Balance</span>
                      <span className="text-blue-700 font-medium">
                        {displayBalance} {symbol}
                      </span>
                    </div>
                  ) : null}

                  <button
                    onClick={openChainModal}
                    type="button"
                    className="
                      relative inline-flex items-center justify-center gap-2 px-3.5 py-2
                      text-xs uppercase tracking-[0.14em] cursor-pointer
                      bg-white border border-slate-200 text-slate-700
                      hover:border-blue-400 hover:text-blue-700 hover:bg-slate-50
                      transition-all duration-150 shadow-sm
                    "
                  >
                    {chain.hasIcon && (
                      <div
                        className="w-[18px] h-[18px] overflow-hidden rounded-full"
                        style={{ background: chain.iconBackground }}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )}
                    <span>{chain.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="
                      relative inline-flex items-center justify-center gap-2 px-3.5 py-2
                      text-xs uppercase tracking-[0.14em] cursor-pointer
                      bg-white border border-slate-200 text-slate-700
                      hover:border-blue-400 hover:text-blue-700 hover:bg-slate-50
                      transition-all duration-150 shadow-sm
                    "
                  >
                    <span className="font-mono text-[0.7rem]">
                      {account.displayName}
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
