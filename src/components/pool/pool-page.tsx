"use client";

import { useParams } from "next/navigation";
import CardSupply from "@/components/card/supply-card";
import { usePoolByAddress } from "@/hooks/graphql/use-pools";
import { formatCompactNumber, formatLtvFromRaw } from "@/lib/format/pool";
import { PageContainer } from "@/components/layout/page-container";
import { useReadTotalSupplyAssets } from "@/hooks/balance/use-total-supply-assets";
import { PoolStatsGrid } from "./pool-stats-grid";
import { PoolPageSkeleton } from "@/components/skeleton/pool-page-skeleton";
import { PoolLoadError } from "@/components/error/pool-load-error";
import { PoolNotFound } from "@/components/error/pool-not-found";
import { PoolHistorySection } from "./pool-history-section";
import {
  usePoolRateByAddress,
  formatTotalSupply,
  formatTotalBorrow,
  formatInterestRate,
} from "@/hooks/graphql/use-pool-rates";
import { InterestRateChart } from "@/components/interest-rate-model/interest-rate-chart";
import PoolHeader from "./pool-header";

export const PoolPage = () => {
  const params = useParams<{ poolAddress: string }>();
  const poolAddress = params.poolAddress;

  const {
    data: pool,
    isLoading: isPoolLoading,
    isError,
    error,
    refetch,
  } = usePoolByAddress(poolAddress);
  const { data: poolRate, isLoading: isRatesLoading } =
    usePoolRateByAddress(poolAddress);

  const isLoading = isPoolLoading || isRatesLoading;

  const { totalSupplyAssetsFormatted, totalSupplyAssetsLoading } =
    useReadTotalSupplyAssets(
      pool?.lendingPool as `0x${string}`,
      pool?.borrow.decimals || 18,
    );

  if (isLoading) {
    return <PoolPageSkeleton />;
  }

  if (isError) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to load pool:", error);
    }

    return <PoolLoadError onRetry={() => refetch()} />;
  }

  if (!pool) return <PoolNotFound />;

  const borrowDecimals = pool.borrow.decimals;
  const totalLiquidity = poolRate?.totalLiquidity
    ? formatTotalSupply(poolRate.totalLiquidity, borrowDecimals)
    : 0;
  const totalBorrow = poolRate?.totalBorrowAssets
    ? formatTotalBorrow(poolRate.totalBorrowAssets, borrowDecimals)
    : 0;
  const supplyApy = poolRate?.apy ? formatInterestRate(poolRate.apy) : 0;

  return (
    <PageContainer>
      <div className="flex flex-col gap-8 lg:flex-row">
        <section className="flex-1 space-y-8">
          <PoolHeader />
          <PoolStatsGrid
            totalLiquidity={formatCompactNumber(totalLiquidity)}
            totalBorrow={formatCompactNumber(totalBorrow)}
            ltv={formatLtvFromRaw(pool.ltv)}
            supplyApy={supplyApy.toFixed(2)}
            totalSupplyAssets={totalSupplyAssetsFormatted}
            liquidationThreshold={formatLtvFromRaw(pool.liquidationThreshold)}
            borrowSymbol={pool.borrow.symbol}
            totalSupplyAssetsLoading={totalSupplyAssetsLoading}
          />

          {poolRate && (
            <InterestRateChart
              baseRate={poolRate.lendingPoolBaseRate}
              optimalUtilization={poolRate.lendingPoolOptimalUtilization}
              rateAtOptimal={poolRate.lendingPoolRateAtOptimal}
              maxRate={poolRate.lendingPoolMaxRate}
              currentUtilization={poolRate.utilizationRate}
              currentBorrowRate={poolRate.borrowRate}
              reserveFactor={poolRate.tokenReserveFactor}
            />
          )}

          <PoolHistorySection poolAddress={pool.lendingPool} />
        </section>

        <aside className="w-full shrink-0 lg:w-104">
          <div className="sticky top-24">
            <CardSupply
              poolAddress={pool.lendingPool as `0x${string}`}
              collateralTokenAddress={pool.collateral.address as `0x${string}`}
              borrowTokenAddress={pool.borrow.address as `0x${string}`}
              collateralSymbol={pool.collateral.symbol}
              borrowSymbol={pool.borrow.symbol}
              collateralLogoUrl={pool.collateral.logoUrl}
              borrowLogoUrl={pool.borrow.logoUrl}
              borrowTokenDecimals={pool.borrow.decimals}
              collateralTokenDecimals={pool.collateral.decimals}
              ltv={formatLtvFromRaw(pool.ltv)}
              liquidationThreshold={formatLtvFromRaw(pool.liquidationThreshold)}
            />
          </div>
        </aside>
      </div>
    </PageContainer>
  );
};
