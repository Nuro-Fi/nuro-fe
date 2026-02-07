import type { TokenConfig } from "@/lib/addresses/types";

export const INTERVALS = ["1h", "4r", "1d"] as const;
export type ChartInterval = (typeof INTERVALS)[number];

export interface TradingViewWindow extends Window {
  TradingView?: {
    widget: new (config: Record<string, unknown>) => void;
  };
}

export interface TokenPriceChartProps {
  baseToken: TokenConfig | null;
  quoteToken: TokenConfig | null;
  onChangeBaseToken: (token: TokenConfig) => void;
  onChangeQuoteToken: (token: TokenConfig) => void;
}
