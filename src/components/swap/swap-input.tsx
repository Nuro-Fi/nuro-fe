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

const AVAILABLE_TOKENS: TokenConfig[] = getTokensArray(Network.ARC );

interface SwapInputProps {
  label: string;
  token: TokenConfig | null;
  onTokenSelect: (token: TokenConfig) => void;
  amount: string;
  onAmountChange?: (value: string) => void;
  excludeAddress?: string;
  disabled?: boolean;
  readOnly?: boolean;
  estimatedValue?: string;
  balance?: string;
  onMaxClick?: () => void;

  dialogShowBalance?: boolean;
  dialogBalanceType?: TokenSelectBalanceType;
  dialogPoolAddress?: `0x${string}`;
}

export const SwapInput = ({
  label,
  token,
  onTokenSelect,
  amount,
  onAmountChange,
  excludeAddress,
  disabled = false,
  readOnly = false,
  estimatedValue,
  balance,
  onMaxClick,
  dialogShowBalance = false,
  dialogBalanceType = "wallet",
  dialogPoolAddress,
}: SwapInputProps) => {
  const [open, setOpen] = useState(false);

  const handleAmountChange = (value: string) => {
    if (readOnly || !onAmountChange) return;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onAmountChange(value);
    }
  };

  return (
    <div className="rounded-none border border-border-primary bg-surface-secondary/60 p-4 transition-all hover:border-border-secondary">
      {/* Header Row */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted">{label}</span>
        {balance && (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>Balance: {balance}</span>
            {onMaxClick && (
              <button
                type="button"
                onClick={onMaxClick}
                className="rounded-none bg-primary/20 px-1.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/30"
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Input Row */}
      <div className="flex items-center gap-3">
        {/* Amount Input */}
        <div className="flex-1">
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0"
            disabled={disabled}
            readOnly={readOnly}
            className={`w-full bg-transparent text-3xl font-semibold text-text-primary outline-none placeholder:text-text-disabled ${
              readOnly ? "cursor-default" : ""
            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          />
          {estimatedValue && (
            <div className="mt-1 text-sm text-text-muted">
              ≈ ${estimatedValue}
            </div>
          )}
        </div>

        {/* Token Selector Button */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={disabled}
          className="flex min-w-[120px] shrink-0 items-center justify-between gap-2 rounded-none border border-border-secondary bg-surface-tertiary py-2 pl-2 pr-3 transition-all hover:border-border-hover hover:bg-surface-active disabled:cursor-not-allowed disabled:opacity-50"
        >
          {token ? (
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-border-hover">
                <Image
                  src={token.logo}
                  alt={token.symbol}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
              </div>
              <span className="min-w-[40px] text-base font-semibold text-text-primary">
                {token.symbol}
              </span>
            </div>
          ) : (
            <span className="px-1 text-sm font-medium text-text-secondary">
              Select token
            </span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0 text-text-secondary" />
        </button>
      </div>

      <TokenSelectDialog
        open={open}
        onOpenChange={setOpen}
        tokens={AVAILABLE_TOKENS}
        onSelect={onTokenSelect}
        excludeAddress={excludeAddress}
        title={`Select ${label.toLowerCase()} token`}
        showBalance={dialogShowBalance}
        balanceType={dialogBalanceType}
        poolAddress={dialogPoolAddress}
      />
    </div>
  );
};
