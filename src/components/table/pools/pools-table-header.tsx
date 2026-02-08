"use client";

import { CreatePoolButton } from "@/components/pools/create-pool-dialog";
import { PoolsTableFilter } from "./pools-table-filter";
import { PoolsTableTokenFilter } from "./pools-table-token-filter";
import type { PoolSortOption } from "./pools-table-types";

interface TokenFilterOption {
  value: string;
  label: string;
}

interface PoolsTableHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: PoolSortOption;
  onFilterChange: (filter: PoolSortOption) => void;
  tokenFilter: string;
  tokenOptions: TokenFilterOption[];
  onTokenFilterChange: (token: string) => void;
}

export const PoolsTableHeader = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  tokenFilter,
  tokenOptions,
  onTokenFilterChange,
}: PoolsTableHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-1 items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by pair or address..."
          className="h-9 w-full max-w-xs rounded-lg border border-border-secondary bg-surface-primary px-3 text-xs text-text-primary outline-none placeholder:text-text-disabled transition-colors focus:border-border-hover"
          aria-label="Search pools"
        />
        <PoolsTableFilter selected={filter} onFilterChange={onFilterChange} />
        <PoolsTableTokenFilter
          selected={tokenFilter}
          options={tokenOptions}
          onTokenChange={onTokenFilterChange}
        />
      </div>
      <CreatePoolButton />
    </div>
  );
};
