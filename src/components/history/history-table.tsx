"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { HistoryTableRow } from "./history-table-row";
import type { HistoryItem } from "@/hooks/graphql/use-history";
import { useHistoryTable } from "./use-history-table";

interface HistoryTableProps {
  items: HistoryItem[];
  hidePagination?: boolean;
}

export const HistoryTable = ({ items, hidePagination = false }: HistoryTableProps) => {
  const table = useHistoryTable(items, hidePagination ? items.length : undefined);

  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalItems = items.length;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  return (
    <div className="overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-primary bg-surface-primary/60">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                Pool
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                Chain
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                Transaction
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/50">
            {table.getRowModel().rows.map((row) => (
              <HistoryTableRow key={row.original.id} item={row.original} />
            ))}
          </tbody>
        </table>
      </div>

      {!hidePagination && pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-border-primary bg-surface-primary/60 px-4 py-3">
          <div className="text-sm text-text-muted">
            Showing{" "}
            <span className="font-medium text-text-secondary">{startItem}</span>{" "}
            to{" "}
            <span className="font-medium text-text-secondary">{endItem}</span>{" "}
            of{" "}
            <span className="font-medium text-text-secondary">
              {totalItems}
            </span>{" "}
            transactions
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-secondary bg-surface-primary text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-primary"
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-secondary bg-surface-primary text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-primary"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex h-8 items-center gap-1 px-3 text-sm text-text-secondary">
              <span>Page</span>
              <span className="font-medium text-text-primary">
                {pageIndex + 1}
              </span>
              <span>of</span>
              <span className="font-medium text-text-primary">{pageCount}</span>
            </div>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-secondary bg-surface-primary text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-primary"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!table.getCanNextPage()}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-secondary bg-surface-primary text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-primary"
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
