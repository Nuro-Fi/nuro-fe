import type { RefObject } from "react";

import { InlineState } from "@/components/error/inline-state";
import type { TokenConfig } from "@/lib/addresses/types";
import { TRADING_VIEW_CONTAINER_ID } from "../constants";

interface ChartContainerProps {
  baseToken: TokenConfig | null;
  quoteToken: TokenConfig | null;
  tvSymbol: string | null;
  widgetError: string | null;
  containerRef: RefObject<HTMLDivElement | null>;
}

export const ChartContainer = ({
  baseToken,
  quoteToken,
  tvSymbol,
  widgetError,
  containerRef,
}: ChartContainerProps) => {
  if (!baseToken || !quoteToken) {
    return (
      <InlineState
        padding="lg"
        size="xs"
        variant="info"
        message="Select both base and quote tokens to see the TradingView price chart."
      />
    );
  }

  if (!tvSymbol) {
    return (
      <InlineState
        padding="lg"
        size="xs"
        variant="info"
        message={
          <>
            No TradingView symbol mapping for {baseToken.symbol}/{quoteToken.symbol}.
            Chart unavailable.
          </>
        }
      />
    );
  }

  if (widgetError) {
    return (
      <InlineState
        padding="lg"
        size="xs"
        variant="error"
        message={<>Failed to load chart: {widgetError}</>}
      />
    );
  }

  return (
    <div className="mt-1 h-80 w-full bg-surface-primary">
      <div
        id={TRADING_VIEW_CONTAINER_ID}
        ref={containerRef}
        className="h-full w-full"
      />
    </div>
  );
};
