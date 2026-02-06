export type PoolSortOption =
  | "popular"
  | "latest"
  | "highest-apy"
  | "lowest-apy"
  | "highest-liquidity"
  | "lowest-liquidity"
  | "custom";

export interface PoolFilterOption {
  value: PoolSortOption;
  label: string;
}

export const POOL_FILTER_OPTIONS: PoolFilterOption[] = [
  { value: "popular", label: "Popular" },
  { value: "latest", label: "Latest" },
  { value: "highest-apy", label: "Highest APY" },
  { value: "lowest-apy", label: "Lowest APY" },
  { value: "highest-liquidity", label: "Highest Liquidity" },
  { value: "lowest-liquidity", label: "Lowest Liquidity" },
  { value: "custom", label: "Custom" },
];

export type PoolSortColumn =
  | "pool"
  | "liquidity"
  | "apy"
  | "borrowed"
  | "borrowApy"
  | "ltv";

export type PoolSortDirection = "asc" | "desc";

export interface PoolTableSort {
  column: PoolSortColumn;
  direction: PoolSortDirection;
}
