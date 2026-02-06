"use client";

import { usePoolHistory } from "@/hooks/graphql/use-history";
import { PoolHistoryHeader } from "./pool-history-header";
import { PoolHistoryContent } from "./pool-history-content";

interface PoolHistorySectionProps {
  poolAddress: string;
}

export const PoolHistorySection = ({
  poolAddress,
}: PoolHistorySectionProps) => {
  const { data: history, isLoading, isError } = usePoolHistory(poolAddress, 5);

  return (
    <section className="mt-8">
      <div className="border border-border-primary bg-surface-primary/50">
        <PoolHistoryHeader
          totalTransactions={history?.length || 0}
          isLoading={isLoading}
        />
        <PoolHistoryContent
          history={history}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </section>
  );
};
