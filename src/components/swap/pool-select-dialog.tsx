"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { InlineState } from "@/components/error/inline-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PoolWithTokens } from "@/hooks/graphql/use-pools";
import type { PoolSelectDialogProps } from "./types";

export const PoolSelectDialog = ({
  open,
  onOpenChange,
  pools,
  onSelect,
  title = "Select Pool",
}: Omit<PoolSelectDialogProps, "selectedPool">) => {
  const [search, setSearch] = useState("");

  const filteredPools = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pools.filter((pool) => {
      if (!q) return true;
      return (
        pool.collateral.symbol.toLowerCase().includes(q) ||
        pool.collateral.name.toLowerCase().includes(q) ||
        pool.borrow.symbol.toLowerCase().includes(q) ||
        pool.borrow.name.toLowerCase().includes(q) ||
        pool.lendingPool.toLowerCase().includes(q)
      );
    });
  }, [search, pools]);

  const handleSelect = (pool: PoolWithTokens) => {
    onSelect(pool);
    onOpenChange(false);
    setSearch("");
  };

  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-border-primary bg-surface-primary p-0 text-text-heading sm:max-w-md">
        <DialogHeader className="border-b border-border-primary px-6 py-4">
          <DialogTitle className="text-lg font-semibold text-text-heading">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by token or address..."
              className="h-10 w-full rounded-none border border-border-primary bg-surface-secondary pl-10 pr-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-border-secondary"
            />
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {filteredPools.length === 0 ? (
            <InlineState
              padding="none"
              className="px-6 py-8"
              variant="empty"
              message="No pools found"
            />
          ) : (
            <div className="space-y-1 px-3 pb-3">
              {filteredPools.map((pool) => {
                return (
                  <button
                    key={pool.lendingPool}
                    type="button"
                    onClick={() => handleSelect(pool)}
                    className="flex w-full items-center gap-3 rounded-none px-3 py-3 text-left transition-colors hover:bg-surface-secondary/70"
                  >
                    <div className="relative flex shrink-0">
                      <div className="h-8 w-8 overflow-hidden rounded-full border border-border-primary bg-surface-secondary">
                        <Image
                          src={pool.collateral.logoUrl}
                          alt={pool.collateral.symbol}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      </div>
                      <div className="-ml-2 h-8 w-8 overflow-hidden rounded-full border border-border-primary bg-surface-secondary">
                        <Image
                          src={pool.borrow.logoUrl}
                          alt={pool.borrow.symbol}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col overflow-hidden">
                      <span className="text-sm font-semibold text-text-primary">
                        {pool.collateral.symbol} / {pool.borrow.symbol}
                      </span>
                      <span className="truncate text-xs text-text-secondary">
                        {formatAddress(pool.lendingPool)}
                      </span>
                    </div>

                    <div className="shrink-0">
                      <span className="rounded-none border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                        LTV {(Number(pool.ltv) / 1e16).toFixed(0)}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PoolSelectDialog;
