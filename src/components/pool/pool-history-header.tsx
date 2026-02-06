import { History } from "lucide-react";

interface PoolHistoryHeaderProps {
  totalTransactions: number;
  isLoading: boolean;
}

export const PoolHistoryHeader = ({
  totalTransactions,
  isLoading,
}: PoolHistoryHeaderProps) => {
  return (
    <div className="border-b border-border-primary bg-surface-secondary/50 px-4 py-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-text-heading uppercase tracking-wide">
          <History className="h-4 w-4" />
          Pool Activity History
        </h2>
        {!isLoading && totalTransactions > 0 && (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <History className="h-3.5 w-3.5" />
            <span>Total Transactions</span>
            <span className="font-medium text-text-primary">
              {totalTransactions}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
