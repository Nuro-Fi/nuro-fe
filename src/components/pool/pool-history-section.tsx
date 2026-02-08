"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePoolHistory } from "@/hooks/graphql/use-history";
import { PoolHistoryHeader } from "./pool-history-header";
import { PoolHistoryContent } from "./pool-history-content";

const PAGE_SIZE = 10;

interface PoolHistorySectionProps {
  poolAddress: string;
}

export const PoolHistorySection = ({
  poolAddress,
}: PoolHistorySectionProps) => {
  const { data: history, isLoading, isError } = usePoolHistory(poolAddress);
  const [page, setPage] = useState(0);

  const totalItems = history?.length ?? 0;
  const pageCount = Math.ceil(totalItems / PAGE_SIZE);

  const paginatedHistory = useMemo(() => {
    if (!history) return undefined;
    const start = page * PAGE_SIZE;
    return history.slice(start, start + PAGE_SIZE);
  }, [history, page]);

  const canPrev = page > 0;
  const canNext = page < pageCount - 1;

  const goFirst = useCallback(() => setPage(0), []);
  const goPrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
  const goNext = useCallback(
    () => setPage((p) => Math.min(pageCount - 1, p + 1)),
    [pageCount],
  );
  const goLast = useCallback(
    () => setPage(pageCount - 1),
    [pageCount],
  );

  const startItem = totalItems > 0 ? page * PAGE_SIZE + 1 : 0;
  const endItem = Math.min((page + 1) * PAGE_SIZE, totalItems);

  return (
    <section className="mt-8">
      <div className="border border-border-primary bg-surface-primary/50">
        <PoolHistoryHeader
          totalTransactions={totalItems}
          isLoading={isLoading}
        />
        <PoolHistoryContent
          history={paginatedHistory}
          isLoading={isLoading}
          isError={isError}
        />

        {!isLoading && pageCount > 1 && (
          <div className="relative z-10 flex items-center justify-between border-t border-border-primary bg-surface-primary/60 px-4 py-3">
            <div className="text-sm text-text-muted">
              Showing{" "}
              <span className="font-medium text-text-secondary">
                {startItem}
              </span>{" "}
              to{" "}
              <span className="font-medium text-text-secondary">
                {endItem}
              </span>{" "}
              of{" "}
              <span className="font-medium text-text-secondary">
                {totalItems}
              </span>{" "}
              transactions
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goFirst}
                disabled={!canPrev}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border-secondary bg-surface-primary text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-primary"
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={goPrev}
                disabled={!canPrev}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border-secondary bg-surface-primary text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-primary"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex h-8 items-center gap-1 px-3 text-sm text-text-secondary">
                <span>Page</span>
                <span className="font-medium text-text-primary">
                  {page + 1}
                </span>
                <span>of</span>
                <span className="font-medium text-text-primary">
                  {pageCount}
                </span>
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={!canNext}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border-secondary bg-surface-primary text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-primary"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={goLast}
                disabled={!canNext}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border-secondary bg-surface-primary text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-primary"
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
