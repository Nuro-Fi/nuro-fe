"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { InlineState } from "@/components/error/inline-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TokenConfig } from "@/lib/addresses/types";
import { TokenSelectDialogRow } from "@/components/pool/token-select-dialog-row";

export type TokenSelectBalanceType = "wallet" | "collateral";

interface TokenSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokens: TokenConfig[];
  onSelect: (token: TokenConfig) => void;
  excludeAddress?: string;
  title?: string;
  showBalance?: boolean;
  balanceType?: TokenSelectBalanceType;
  poolAddress?: `0x${string}`;
}

export const TokenSelectDialog = ({
  open,
  onOpenChange,
  tokens,
  onSelect,
  excludeAddress,
  title = "Select Token",
  showBalance = false,
  balanceType = "wallet",
  poolAddress,
}: TokenSelectDialogProps) => {
  const [search, setSearch] = useState("");

  const filteredTokens = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tokens.filter((token) => {
      if (
        excludeAddress &&
        token.address.toLowerCase() === excludeAddress.toLowerCase()
      ) {
        return false;
      }
      if (!q) return true;
      return (
        token.symbol.toLowerCase().includes(q) ||
        token.name.toLowerCase().includes(q) ||
        token.address.toLowerCase().includes(q)
      );
    });
  }, [search, excludeAddress, tokens]);

  const shouldLoadBalances = open && showBalance;

  const handleSelect = (token: TokenConfig) => {
    onSelect(token);
    onOpenChange(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-border-primary bg-surface-primary p-0 text-text-heading sm:max-w-md">
        <DialogHeader className="border-b border-border-primary px-6 py-4">
          <DialogTitle className="text-lg font-semibold text-text-heading">
            {title}
          </DialogTitle>
        </DialogHeader>

        <section className="px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or symbol..."
              className="h-10 w-full rounded-none border border-border-primary bg-surface-secondary pl-10 pr-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-border-secondary"
            />
          </div>
        </section>

        <section className="max-h-100 overflow-y-auto">
          {filteredTokens.length === 0 ? (
            <InlineState
              padding="none"
              className="px-6 py-8"
              variant="empty"
              message="No tokens found"
            />
          ) : (
            <div className="space-y-1 px-3 pb-3">
              {filteredTokens.map((token) => (
                <TokenSelectDialogRow
                  key={token.address}
                  token={token}
                  onSelect={handleSelect}
                  showBalance={showBalance}
                  balanceType={balanceType}
                  shouldLoadBalances={shouldLoadBalances}
                  poolAddress={poolAddress}
                />
              ))}
            </div>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
};
