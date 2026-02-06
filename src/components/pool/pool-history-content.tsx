import { InlineState } from "@/components/error/inline-state";
import { HistoryTable } from "@/components/history/history-table";
import { HistoryTableSkeleton } from "@/components/skeleton/history-table-skeleton";
import type { HistoryItem } from "@/hooks/graphql/use-history";

interface PoolHistoryContentProps {
  history: HistoryItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const PoolHistoryContent = ({
  history,
  isLoading,
  isError,
}: PoolHistoryContentProps) => {
  if (isLoading) {
    return <HistoryTableSkeleton />;
  }

  if (isError) {
    return (
      <InlineState variant="empty" message="Failed to load pool history" />
    );
  }

  if (!history || history.length === 0) {
    return (
      <InlineState
        variant="empty"
        message="No transactions found for this pool yet"
      />
    );
  }

  return <HistoryTable items={history} hidePagination />;
};
