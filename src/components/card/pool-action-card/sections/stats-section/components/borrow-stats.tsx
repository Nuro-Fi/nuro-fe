import { formatUnits } from "viem";
import { StatRow, getExchangeRateDisplay } from "../../../ui/stat-row";

interface BorrowStatsProps {
  maxBorrowAmount?: string;
  borrowSymbol?: string;
  borrowSharesFormatted: string;
  isLoadingBorrowShares: boolean;
  exchangeRate?: number | null;
  exchangeRateLoading: boolean;
  fromTokenSymbol?: string;
  toTokenSymbol?: string;
  inputAmount?: string;
  calculatedAmountOut?: string | null;
  interestRate: number;
  isCrossChain: boolean;
  crossChainFee?: bigint;
  ltv: string;
  showHealthFactor: boolean;
  renderHealthFactor: () => React.ReactElement;
}

export const BorrowStats = ({
  maxBorrowAmount,
  borrowSymbol,
  borrowSharesFormatted,
  isLoadingBorrowShares,
  exchangeRate,
  exchangeRateLoading,
  fromTokenSymbol,
  toTokenSymbol,
  inputAmount,
  calculatedAmountOut,
  interestRate,
  isCrossChain,
  crossChainFee,
  ltv,
  showHealthFactor,
  renderHealthFactor,
}: BorrowStatsProps) => {
  return (
    <>
      <StatRow
        label="Your Borrow"
        value={isLoadingBorrowShares ? "Loading..." : borrowSharesFormatted}
        valueColor="text-amber-400"
      />
      {maxBorrowAmount && (
        <StatRow
          label="Max Borrow Amount"
          value={`${maxBorrowAmount} ${borrowSymbol}`}
        />
      )}
      {exchangeRate !== undefined && fromTokenSymbol && toTokenSymbol && (
        <StatRow
          label="Exchange Rate"
          value={getExchangeRateDisplay(
            exchangeRate,
            exchangeRateLoading,
            fromTokenSymbol,
            toTokenSymbol,
            inputAmount,
            calculatedAmountOut,
          )}
          valueColor="text-cyan-400"
        />
      )}
      <StatRow
        label="Interest Rate"
        value={
          isLoadingBorrowShares ? "Loading..." : `${interestRate.toFixed(2)}%`
        }
        valueColor="text-sky-400"
      />
      {isCrossChain &&
        crossChainFee !== undefined &&
        crossChainFee > BigInt(0) && (
          <StatRow
            label="LayerZero Fee"
            value={`${parseFloat(formatUnits(crossChainFee, 18)).toFixed(4)} ARC`}
            valueColor="text-blue-300"
          />
        )}
      {showHealthFactor && renderHealthFactor()}
      <StatRow label="LTV" value={ltv} />
    </>
  );
};
