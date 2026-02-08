"use client";

import { useMemo, useState } from "react";
import type { TransactionType } from "@/hooks/graphql/use-history";
import { useHistory } from "@/hooks/graphql/use-history";
import { HistoryTable } from "../history-table";
import { InlineState } from "@/components/error/inline-state";
import { HistoryTableSkeleton } from "@/components/skeleton/history-table-skeleton";
import { HistoryTableEmpty } from "../history-table-empty";
import { HistoryTableError } from "../history-table-error";
import { SearchFilterBar } from "./search-filter-bar";
import { filterHistory } from "../hooks/use-history-filter";

interface HistoryContentProps {
  userAddress?: string;
}

export const HistoryContent = ({ userAddress }: HistoryContentProps) => {
  const {
    data: historyData,
    isLoading,
    isPending,
    isError,
  } = useHistory(userAddress);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TransactionType | "all">("all");

  const filteredData = useMemo(
    () => filterHistory(historyData, search, filter),
    [historyData, search, filter],
  );

  if (isLoading || isPending) {
    return (
      <div className="overflow-hidden rounded-lg border border-border-primary bg-surface-primary/50">
        <HistoryTableSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="overflow-hidden rounded-lg border border-border-primary bg-surface-primary/50">
        <HistoryTableError />
      </div>
    );
  }

  if (!historyData?.length) {
    return (
      <div className="overflow-hidden rounded-lg border border-border-primary bg-surface-primary/50">
        <HistoryTableEmpty />
      </div>
    );
  }

  const showFilteredEmpty = filteredData.length === 0;

  return (
    <>
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        totalCount={historyData?.length ?? 0}
        filteredCount={filteredData.length}
      />

      <div className="overflow-hidden rounded-lg border border-border-primary bg-surface-primary/50">
        {showFilteredEmpty ? (
          <InlineState
            padding="none"
            className="py-16"
            variant="empty"
            message="No transactions match your search criteria"
          />
        ) : (
          <HistoryTable items={filteredData} />
        )}
      </div>
    </>
  );
};
