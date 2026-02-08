"use client";
import {
  ConnectionGuard,
  useIsConnected,
} from "@/components/wallet/connection-guard";
import { PageHeader } from "./components/page-header";
import { HistoryContent } from "./components/history-content";

interface HistoryPageProps {
  userAddress?: string;
}

const HistoryInner = ({ propUserAddress }: { propUserAddress?: string }) => {
  const { address } = useIsConnected();
  const activeAddress = propUserAddress || address || undefined;

  return (
    <div className="flex flex-col gap-6">
      <HistoryContent userAddress={activeAddress} />
    </div>
  );
};

export const HistoryPage = ({
  userAddress: propUserAddress,
}: HistoryPageProps) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader />
      <ConnectionGuard
        variant="fullpage"
        showLoading
        promptTitle="Connect Your Wallet"
        promptDescription="Connect your wallet to view your transaction history."
      >
        <HistoryInner propUserAddress={propUserAddress} />
      </ConnectionGuard>
    </div>
  );
};

export default HistoryPage;
