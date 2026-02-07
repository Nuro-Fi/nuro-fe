"use client";

import { PageContainer } from "@/components/layout/page-container";
import { TokenPriceChart } from "./token-price-chart/index";
import { SwapCard } from "./swap-card";
import { useChartTokens } from "./use-chart-tokens";
import { usePools } from "@/hooks/graphql/use-pools";
import { SwapPageSkeleton } from "@/components/skeleton/swap-page-skeleton";
import { ConnectionGuard } from "@/components/wallet/connection-guard";

const SwapContent = () => {
  const { baseToken, quoteToken, setBaseToken, setQuoteToken } =
    useChartTokens();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-text-heading">Swap</h1>
        <p className="text-sm text-text-secondary">
          Swap your position collateral and monitor live market prices.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <TokenPriceChart
          baseToken={baseToken}
          quoteToken={quoteToken}
          onChangeBaseToken={setBaseToken}
          onChangeQuoteToken={setQuoteToken}
        />
        <SwapCard />
      </div>
    </section>
  );
};

export const SwapPage = () => {
  const { isLoading: isLoadingPools } = usePools();

  if (isLoadingPools) {
    return <SwapPageSkeleton />;
  }

  return (
    <PageContainer>
      <ConnectionGuard
        variant="fullpage"
        showLoading
        promptTitle="Connect Your Wallet"
        promptDescription="Connect your wallet to access the swap feature and exchange your tokens."
      >
        <SwapContent />
      </ConnectionGuard>
    </PageContainer>
  );
};

export default SwapPage;
