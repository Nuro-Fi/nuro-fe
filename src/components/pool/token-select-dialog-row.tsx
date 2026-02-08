"use client";

import Image from "next/image";
import type { TokenConfig } from "@/lib/addresses/types";
import type { TokenSelectBalanceType } from "@/components/pool/token-select-dialog";
import {
  formatTokenAddress,
  isNativeTokenAddress,
} from "@/components/pool/token-select-dialog.utils";
import {
  CollateralBalanceCell,
  WalletBalanceCell,
} from "@/components/pool/token-select-dialog-balance";

interface TokenSelectDialogRowProps {
  token: TokenConfig;
  onSelect: (token: TokenConfig) => void;
  showBalance: boolean;
  balanceType: TokenSelectBalanceType;
  shouldLoadBalances: boolean;
  poolAddress?: `0x${string}`;
}

export const TokenSelectDialogRow = ({
  token,
  onSelect,
  showBalance,
  balanceType,
  shouldLoadBalances,
  poolAddress,
}: TokenSelectDialogRowProps) => {
  const isNative = isNativeTokenAddress(token.address);

  return (
    <button
      type="button"
      onClick={() => onSelect(token)}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-surface-secondary/70"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border-primary bg-surface-secondary">
        <Image
          src={token.logo}
          alt={token.symbol}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <span className="text-sm font-semibold text-text-primary">
          {token.symbol}
        </span>
        {!isNative ? (
          <span className="truncate text-[11px] font-mono text-text-muted">
            {formatTokenAddress(token.address)}
          </span>
        ) : (
          <span className="truncate text-[11px] text-text-muted">Native</span>
        )}
      </div>

      {showBalance && balanceType === "wallet" && (
        <WalletBalanceCell token={token} enabled={shouldLoadBalances} />
      )}

      {showBalance && balanceType === "collateral" && poolAddress && (
        <CollateralBalanceCell
          token={token}
          enabled={shouldLoadBalances}
          poolAddress={poolAddress}
        />
      )}
    </button>
  );
};
