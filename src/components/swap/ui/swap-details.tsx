import { Loader2, RefreshCw } from "lucide-react";
import type { TokenConfig } from "@/lib/addresses/types";

interface RateRowProps {
  tokenIn: TokenConfig;
  tokenOut: TokenConfig;
  rate: string | null;
  isLoading: boolean;
}

export const RateRow = ({
  tokenIn,
  tokenOut,
  rate,
  isLoading,
}: RateRowProps) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-text-muted">
      <span>Rate</span>
      {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
    </div>
    <div className="flex items-center gap-2">
      {rate ? (
        <span className="text-text-tertiary">
          1 {tokenIn.symbol} ≈ {rate} {tokenOut.symbol}
        </span>
      ) : (
        <span className="text-text-muted">--</span>
      )}
      <RefreshCw
        className={`h-3 w-3 text-text-muted ${isLoading ? "animate-spin" : ""}`}
      />
    </div>
  </div>
);

interface SwapDetailsProps {
  tokenIn: TokenConfig;
  tokenOut: TokenConfig;
  rate: string | null;
  exchangeRate: number | null;
  isLoadingRate: boolean;
}

export const SwapDetails = ({
  tokenIn,
  tokenOut,
  rate,
  exchangeRate,
  isLoadingRate,
}: SwapDetailsProps) => (
  <div className="mt-4 rounded-lg border border-border-primary bg-surface-secondary/50 p-3">
    <RateRow
      tokenIn={tokenIn}
      tokenOut={tokenOut}
      rate={rate}
      isLoading={isLoadingRate}
    />

    {rate && exchangeRate && (
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-text-muted">Inverse</span>
        <span className="text-text-secondary">
          1 {tokenOut.symbol} ≈{" "}
          {(1 / exchangeRate).toFixed(exchangeRate >= 1 ? 8 : 4)}{" "}
          {tokenIn.symbol}
        </span>
      </div>
    )}

    <div className="mt-2 flex items-center justify-between text-sm">
      <span className="text-text-muted">Fee</span>
      <span className="text-text-tertiary">0.001</span>
    </div>
  </div>
);
