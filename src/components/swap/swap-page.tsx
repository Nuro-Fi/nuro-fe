"use client";

import { PageContainer } from "@/components/layout/page-container";
import { SwapCard } from "./swap-card";
import { ConnectionGuard } from "@/components/wallet/connection-guard";

export const SwapPage = () => {
  return (
    <PageContainer>
      <ConnectionGuard
        variant="fullpage"
        showLoading
        promptTitle="Connect Your Wallet"
        promptDescription="Connect your wallet to access the swap feature and exchange your tokens."
      >
        <section className="space-y-6">
          <div className="mx-auto max-w-md">
            <SwapCard />
          </div>
        </section>
      </ConnectionGuard>
    </PageContainer>
  );
};

export default SwapPage;
