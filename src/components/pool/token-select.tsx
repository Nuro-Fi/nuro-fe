"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {
  TokenSelectDialog,
  type TokenSelectBalanceType,
} from "@/components/pool/token-select-dialog";
import { getTokensArray } from "@/lib/addresses/tokens";
import { Network, type TokenConfig } from "@/lib/addresses/types";

const AVAILABLE_TOKENS: TokenConfig[] = getTokensArray(Network.ARC);

interface TokenSelectProps {
  label: string;
  selected: TokenConfig | null;
  onSelect: (token: TokenConfig) => void;
  excludeAddress?: string;
  showBalance?: boolean;
  balanceType?: TokenSelectBalanceType;
  poolAddress?: `0x${string}`;
}


export const TokenSelect = ({
  label,
  selected,
  onSelect,
  excludeAddress,
  showBalance = false,
  balanceType = "wallet",
  poolAddress,
}: TokenSelectProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-16 w-full items-center justify-between rounded-xl border border-border-primary bg-surface-secondary/50 px-4 text-sm text-text-primary transition-colors hover:border-border-secondary hover:bg-surface-secondary"
      >
        {selected ? (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border-secondary bg-surface-secondary">
              <Image
                src={selected.logo}
                alt={selected.symbol}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold text-text-primary">
                {selected.symbol}
              </span>
              <span className="text-xs text-text-secondary">{selected.name}</span>
            </div>
          </div>
        ) : (
          <span className="text-text-secondary">Select token</span>
        )}

        <ChevronDown className="h-5 w-5 text-text-muted" />
      </button>

      <TokenSelectDialog
        open={open}
        onOpenChange={setOpen}
        tokens={AVAILABLE_TOKENS}
        onSelect={onSelect}
        excludeAddress={excludeAddress}
        title={label}
        showBalance={showBalance}
        balanceType={balanceType}
        poolAddress={poolAddress}
      />
    </div>
  );
};
