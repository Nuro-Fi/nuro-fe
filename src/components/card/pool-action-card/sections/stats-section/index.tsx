import {
  usePoolRateByAddress,
  formatInterestRate,
} from "@/hooks/graphql/use-pool-rates";
import { useReadUserBorrowShares } from "@/hooks/balance/use-user-borrow-shares";
import { usePoolByAddress } from "@/hooks/graphql/use-pools";
import { useHealthFactor } from "@/hooks/use-health-factor";
import { useConnection } from "wagmi";
import type { HexAddress } from "@/types";
import type { StatsSectionProps } from "./types";
import { useUserBalance } from "./use-user-balance";
import { HealthFactorDisplay } from "./components/health-factor-display";
import { BorrowStats } from "./components/borrow-stats";
import { SupplyStats } from "./components/supply-stats";

export const StatsSection = ({
  poolAddress,
  ltv,
  mode,
  tokenAddress,
  tokenSymbol,
  tokenDecimals = 18,
  maxBorrowAmount,
  borrowSymbol,
  borrowTokenDecimals = 18,
  exchangeRate,
  exchangeRateLoading = false,
  fromTokenSymbol,
  toTokenSymbol,
  inputAmount,
  calculatedAmountOut,
  simulatedHealthFactor,
  crossChainFee,
  isCrossChain = false,
}: StatsSectionProps) => {
  const { data: poolRate } = usePoolRateByAddress(poolAddress);
  const { data: pool } = usePoolByAddress(poolAddress);
  const routerAddress = pool?.router;
  const { address } = useConnection();

  const { data: healthFactorData, isLoading: isHealthFactorLoading } =
    useHealthFactor(address as HexAddress, poolAddress as HexAddress);

  const { borrowSharesFormatted, isLoadingBorrowShares } =
    useReadUserBorrowShares(
      routerAddress as `0x${string}` | undefined,
      borrowTokenDecimals,
    );

  const userBalance = useUserBalance(
    poolAddress,
    tokenAddress,
    tokenDecimals,
    mode,
  );

  const supplyApy = poolRate?.apy ? formatInterestRate(poolRate.apy) : 0;
  const interestRate = poolRate?.borrowRate
    ? formatInterestRate(poolRate.borrowRate)
    : 0;

  const showInterestRate = mode === "borrow" || mode === "repay";
  const showHealthFactor =
    mode === "borrow" ||
    mode === "repay" ||
    mode === "supply-collateral" ||
    mode === "withdraw-collateral";

  const renderHealthFactor = () => (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1">Health Factor</span>
      <span className="font-medium">
        <HealthFactorDisplay
          healthFactorData={healthFactorData}
          simulatedHealthFactor={simulatedHealthFactor}
          isLoading={isHealthFactorLoading}
        />
      </span>
    </div>
  );

  return (
    <div className="space-y-1 border border-border-primary bg-surface-secondary p-3 text-sm text-text-secondary">
      {showInterestRate ? (
        <BorrowStats
          maxBorrowAmount={maxBorrowAmount}
          borrowSymbol={borrowSymbol}
          borrowSharesFormatted={borrowSharesFormatted}
          isLoadingBorrowShares={isLoadingBorrowShares}
          exchangeRate={exchangeRate}
          exchangeRateLoading={exchangeRateLoading}
          fromTokenSymbol={fromTokenSymbol}
          toTokenSymbol={toTokenSymbol}
          inputAmount={inputAmount}
          calculatedAmountOut={calculatedAmountOut}
          interestRate={interestRate}
          isCrossChain={isCrossChain}
          crossChainFee={crossChainFee}
          ltv={ltv}
          showHealthFactor={showHealthFactor}
          renderHealthFactor={renderHealthFactor}
        />
      ) : (
        <SupplyStats
          supplyApy={supplyApy}
          ltv={ltv}
          userBalanceLabel={userBalance.label}
          userBalanceLoading={userBalance.loading}
          userBalance={userBalance.balance}
          tokenSymbol={tokenSymbol}
          showHealthFactor={showHealthFactor}
          renderHealthFactor={renderHealthFactor}
        />
      )}
    </div>
  );
};
