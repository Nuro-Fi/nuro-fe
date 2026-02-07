"use client";

import { PageContainer } from "@/components/layout/page-container";
import { FaucetList } from "./faucet-list";
import {
  ConnectionGuard,
  useIsConnected,
} from "@/components/wallet/connection-guard";
import type { HexAddress } from "@/types";

const FaucetContent = () => {
  const { address } = useIsConnected();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-text-heading">
              Testnet Faucet
            </h1>
            <p className="text-sm text-text-secondary">
              Claim free testnet tokens to explore the platform
            </p>
          </div>
        </div>
      </header>

      <FaucetList userAddress={address as HexAddress} />
    </section>
  );
};

export const FaucetPage = () => (
  <PageContainer>
    <ConnectionGuard
      variant="fullpage"
      showLoading
      promptTitle="Connect Your Wallet"
      promptDescription="Connect your wallet to claim testnet tokens from the faucet."
    >
      <FaucetContent />
    </ConnectionGuard>
  </PageContainer>
);

export default FaucetPage;
