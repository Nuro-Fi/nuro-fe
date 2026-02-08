import { Search, Filter } from "lucide-react";
import type { TransactionType } from "@/hooks/graphql/use-history";
import { FILTER_OPTIONS } from "../config/filter-options";

interface SearchFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: TransactionType | "all";
  onFilterChange: (value: TransactionType | "all") => void;
  totalCount: number;
  filteredCount: number;
}

export const SearchFilterBar = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  totalCount,
  filteredCount,
}: SearchFilterBarProps) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-1 items-center gap-3">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by address or tx hash..."
          className="h-9 w-full rounded-lg border border-border-secondary bg-surface-primary pl-10 pr-3 text-xs text-text-primary outline-none placeholder:text-text-disabled transition-colors focus:border-border-hover"
          aria-label="Search transactions"
        />
      </div>

      <div className="relative">
        <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <select
          value={filter}
          onChange={(e) =>
            onFilterChange(e.target.value as TransactionType | "all")
          }
          className="h-9 appearance-none rounded-lg border border-border-secondary bg-surface-primary pl-10 pr-8 text-xs text-text-primary outline-none transition-colors focus:border-border-hover"
          aria-label="Filter by type"
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>

    {totalCount > 0 && (
      <div className="text-sm text-text-muted">
        {filteredCount} of {totalCount} transactions
      </div>
    )}
  </div>
);
