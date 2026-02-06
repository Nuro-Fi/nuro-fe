export type StatsMode =
  | "supply-liquidity"
  | "supply-collateral"
  | "withdraw-liquidity"
  | "withdraw-collateral"
  | "borrow"
  | "repay";

export interface StatsSectionProps {
  poolAddress: string;
  ltv: string;
  mode?: StatsMode;
  tokenAddress?: string;
  tokenSymbol?: string;
  tokenDecimals?: number;
  maxBorrowAmount?: string;
  borrowSymbol?: string;
  borrowTokenDecimals?: number;
  exchangeRate?: number | null;
  exchangeRateLoading?: boolean;
  fromTokenSymbol?: string;
  toTokenSymbol?: string;
  inputAmount?: string;
  calculatedAmountOut?: string | null;
  simulatedHealthFactor?:
    | import("@/hooks/use-health-factor").SimulatedHealthFactor
    | null;
  crossChainFee?: bigint;
  isCrossChain?: boolean;
}
