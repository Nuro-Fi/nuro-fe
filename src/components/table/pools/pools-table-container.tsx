import { ReactNode } from "react";
import { PoolsTableHeader } from "@/components/table/pools/pools-table-header";
import type { PoolSortOption } from "./pools-table-types";

interface TokenFilterOption {
  value: string;
  label: string;
}

interface PoolsTableContainerProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: PoolSortOption;
  onFilterChange: (filter: PoolSortOption) => void;
  tokenFilter: string;
  tokenOptions: TokenFilterOption[];
  onTokenFilterChange: (token: string) => void;
  children: ReactNode;
}

export const PoolsTableContainer = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  tokenFilter,
  tokenOptions,
  onTokenFilterChange,
  children,
}: PoolsTableContainerProps) => {
  return (
    <div className="mt-8 space-y-3">
      <PoolsTableHeader
        search={search}
        onSearchChange={onSearchChange}
        filter={filter}
        onFilterChange={onFilterChange}
        tokenFilter={tokenFilter}
        tokenOptions={tokenOptions}
        onTokenFilterChange={onTokenFilterChange}
      />
      {children}
    </div>
  );
};
