import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PoolsTableRow } from "@/components/table/pools/pools-table-row";
import { PoolWithTokens } from "@/hooks/graphql/use-pools";
import { PoolRate } from "@/hooks/graphql/use-pool-rates";
import type { PoolSortColumn, PoolTableSort } from "./pools-table-types";

interface PoolsTableContentProps {
  pools: PoolWithTokens[];
  rates?: Record<string, PoolRate>;
  onPoolClick: (poolAddress: string) => void;
  sort: PoolTableSort | null;
  onSortChange: (column: PoolSortColumn) => void;
}

const SortIcon = ({
  active,
  direction,
}: {
  active: boolean;
  direction: "asc" | "desc";
}) => {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />;
  return direction === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5" />
  );
};

const TABLE_HEADERS: Array<{
  label: string;
  column: PoolSortColumn;
  align: "left" | "right";
}> = [
  { label: "Pool", column: "pool", align: "left" },
  { label: "Total Liquidity", column: "liquidity", align: "right" },
  { label: "APY", column: "apy", align: "right" },
  { label: "Total Borrowed", column: "borrowed", align: "right" },
  { label: "Borrow APY", column: "borrowApy", align: "right" },
  { label: "LTV", column: "ltv", align: "right" },
];

const HeaderButton = ({
  label,
  column,
  align = "left",
  sort,
  onSortChange,
}: {
  label: string;
  column: PoolSortColumn;
  align?: "left" | "right";
  sort: PoolTableSort | null;
  onSortChange: (column: PoolSortColumn) => void;
}) => {
  const active = sort?.column === column;
  const direction = active ? sort!.direction : "desc";

  return (
    <button
      type="button"
      onClick={() => onSortChange(column)}
      className={cn(
        "inline-flex w-full items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-200 hover:text-text-primary",
        align === "right" ? "justify-end" : "justify-start",
      )}
    >
      <span>{label}</span>
      <SortIcon active={active} direction={direction} />
    </button>
  );
};

export const PoolsTableContent = ({
  pools,
  rates,
  onPoolClick,
  sort,
  onSortChange,
}: PoolsTableContentProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-primary bg-surface-primary/60">
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h.column}
                  className={cn(
                    "px-4 py-3",
                    h.align === "right" ? "text-right" : "text-left",
                  )}
                >
                  <HeaderButton
                    label={h.label}
                    column={h.column}
                    align={h.align}
                    sort={sort}
                    onSortChange={onSortChange}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/50">
            {pools.map((pool) => {
              const poolRate = rates?.[pool.lendingPool.toLowerCase()];

              return (
                <PoolsTableRow
                  key={pool.lendingPool}
                  pool={pool}
                  rate={poolRate}
                  onClick={() => onPoolClick(pool.lendingPool)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
