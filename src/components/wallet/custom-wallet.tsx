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
                    className="wallet__button wallet__button--primary"
                  >
                    <Wallet className="wallet__icon" />
                    <span>Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="wallet__button wallet__button--danger"
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
                <div className="wallet">
                  {/* Balance Display */}
                  {isPending ? (
                    <LoadingState balance />
                  ) : displayBalance ? (
                    <div className="navbar__balance">
                      <span className="navbar__balance-label">Balance</span>
                      <span className="navbar__balance-value">
                        {displayBalance} {symbol}
                      </span>
                    </div>
                  ) : null}

                  <button
                    onClick={openChainModal}
                    type="button"
                    className="wallet__button wallet__button--chain"
                  >
                    {chain.hasIcon && (
                      <div
                        className="wallet__chain-icon-wrapper"
                        style={{ background: chain.iconBackground }}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            width={24}
                            height={24}
                            className="wallet__chain-icon-img"
                          />
                        )}
                      </div>
                    )}
                    <span>{chain.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="wallet__button wallet__button--account"
                  >
                    <span className="wallet__account-text">
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