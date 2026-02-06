interface StatRowProps {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  labelExtra?: React.ReactNode;
}

export const StatRow = ({
  label,
  value,
  valueColor = "text-text-primary",
  labelExtra,
}: StatRowProps) => (
  <div className="flex items-center justify-between">
    <span className="flex items-center gap-1">
      {label}
      {labelExtra}
    </span>
    <span className={`font-medium ${valueColor}`}>{value}</span>
  </div>
);

export const getHealthFactorColor = (healthFactor: number): string => {
  if (healthFactor === Infinity) return "text-emerald-400";
  if (healthFactor >= 1.5) return "text-emerald-400";
  if (healthFactor >= 1.1) return "text-yellow-400";
  return "text-red-400";
};

export const getExchangeRateDisplay = (
  exchangeRate: number | null | undefined,
  exchangeRateLoading: boolean,
  fromTokenSymbol: string | undefined,
  toTokenSymbol: string | undefined,
  inputAmount: string | undefined,
  calculatedAmountOut: string | null | undefined,
): string => {
  if (exchangeRateLoading) return "Loading...";

  if (calculatedAmountOut && inputAmount && parseFloat(inputAmount) > 0) {
    return `${inputAmount} ${fromTokenSymbol} = ${calculatedAmountOut} ${toTokenSymbol}`;
  }

  if (exchangeRate) {
    return `1 ${fromTokenSymbol} = ${exchangeRate.toFixed(6)} ${toTokenSymbol}`;
  }

  return "N/A";
};
