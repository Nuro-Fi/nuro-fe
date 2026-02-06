"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { TokenConfig } from "@/lib/addresses/types";

export interface PoolPreviewProps {
  collateral: TokenConfig;
  borrow: TokenConfig;
  ltv?: string;
  className?: string;
}

export const PoolPreview = ({ collateral, borrow, ltv, className }: PoolPreviewProps) => {
  return (
    <div className={cn("rounded-none border border-border-primary bg-surface-secondary/30 p-4", className)}>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
        Pool Preview
      </p>
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-20">
          <div className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 overflow-hidden rounded-full border-2 border-border-primary bg-surface-secondary">
            <Image
              src={collateral.logo}
              alt={collateral.symbol}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
          <div className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 overflow-hidden rounded-full border-2 border-border-primary bg-surface-secondary">
            <Image
              src={borrow.logo}
              alt={borrow.symbol}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-lg font-bold text-text-primary">
            {collateral.symbol} / {borrow.symbol}
          </span>
          {ltv && (
            <span className="text-xs text-text-secondary">LTV: {ltv}%</span>
          )}
        </div>
      </div>
    </div>
  );
};
