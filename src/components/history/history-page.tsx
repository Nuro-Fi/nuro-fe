"use client";
import { HistoryTableSkeleton } from "@/components/skeleton/history-table-skeleton";
import {
  ConnectionGuard,
  useIsConnected,
} from "@/components/wallet/connection-guard";
import { PageHeader } from "./components/page-header";
import { HistoryContent } from "./components/history-content";

interface HistoryPageProps {
  userAddress?: string;
}

export const HistoryPage = ({
  userAddress: propUserAddress,
}: HistoryPageProps) => {
  const { address, isConnecting } = useIsConnected();
  const activeAddress = propUserAddress || address;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader />
      <div className="flex flex-col gap-6">
        {!propUserAddress && isConnecting ? (
          <div className="overflow-hidden rounded-none border border-border-primary bg-surface-primary/50">
            <HistoryTableSkeleton />
          </div>
        ) : !propUserAddress && !activeAddress ? (
          <ConnectionGuard
            promptTitle="Connect Your Wallet"
            promptDescription="Connect your wallet to view your personal transaction history"
            showLoading={false}
          >
            <HistoryContent userAddress={activeAddress} />
          </ConnectionGuard>
        ) : (
          <HistoryContent userAddress={activeAddress} />
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
