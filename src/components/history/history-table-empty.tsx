"use client";

import { History } from "lucide-react";

export const HistoryTableEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary">
        <History className="h-8 w-8 text-text-muted" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-text-tertiary">
        No transactions yet
      </h3>
      <p className="max-w-sm text-center text-sm text-text-muted">
        Your transaction history will appear here once you start interacting
        with the lending pools.
      </p>
    </div>
  );
};
