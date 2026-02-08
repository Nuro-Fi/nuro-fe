"use client";

import type { TokenPriceChartProps } from "./types";
import { useTradingView } from "./use-trading-view";
import { getDisplaySymbol } from "./utils";
import { TokenPairSelector } from "./components/token-pair-selector";
import { ChartContainer } from "./components/chart-container";

export const TokenPriceChart = ({
  baseToken,
  quoteToken,
  onChangeBaseToken,
  onChangeQuoteToken,
}: TokenPriceChartProps) => {
  const interval = "1h";

  const { containerRef, widgetError, tvSymbol } = useTradingView({
    baseToken,
    quoteToken,
    interval,
  });

  const baseForTitle = getDisplaySymbol(baseToken);
  const quoteForTitle = getDisplaySymbol(quoteToken);
  const title =
    baseToken && quoteToken && tvSymbol && baseForTitle && quoteForTitle
      ? `${baseForTitle}/${quoteForTitle} Price`
      : "Token Price";

  return (
    <div className="rounded-lg border border-border-primary bg-surface-primary p-4 text-xs text-text-tertiary">
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-text-heading">{title}</h2>
          </div>
        </div>

        <TokenPairSelector
          baseToken={baseToken}
          quoteToken={quoteToken}
          onChangeBaseToken={onChangeBaseToken}
          onChangeQuoteToken={onChangeQuoteToken}
        />
      </div>

      <ChartContainer
        baseToken={baseToken}
        quoteToken={quoteToken}
        tvSymbol={tvSymbol}
        widgetError={widgetError}
        containerRef={containerRef}
      />
    </div>
  );
};
