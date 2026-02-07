import type { PoolWithTokens } from "@/hooks/graphql/use-pools";
import { PoolSelectButton } from "../pool-select-button";

interface PoolSelectorProps {
  pool: PoolWithTokens | null;
  pools: PoolWithTokens[];
  isLoading: boolean;
  onSelect: (pool: PoolWithTokens) => void;
}

export const PoolSelector = ({
  pool,
  pools,
  isLoading,
  onSelect,
}: PoolSelectorProps) => (
  <div className="mb-4 space-y-2">
    <label className="text-xs font-medium text-text-muted">Select Pool</label>
    <PoolSelectButton
      pool={pool}
      onSelect={onSelect}
      pools={pools}
      isLoading={isLoading}
    />
  </div>
);
