import { useEffect, useRef, useState } from "react";
import type { TokenConfig } from "@/lib/addresses/types";
import type { ChartInterval, TradingViewWindow } from "./types";
import {
  TRADING_VIEW_CONTAINER_ID,
  TRADING_VIEW_SCRIPT_SRC,
} from "./constants";
import { mapPairToTradingViewSymbol } from "./utils";

declare const window: TradingViewWindow;

let tvScriptLoadingPromise: Promise<void> | null = null;

const loadTradingViewScript = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.TradingView) return Promise.resolve();
  if (tvScriptLoadingPromise) return tvScriptLoadingPromise;

  tvScriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TRADING_VIEW_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load TradingView library"));
    document.head.appendChild(script);
  });

  return tvScriptLoadingPromise;
};

interface UseTradingViewParams {
  baseToken: TokenConfig | null;
  quoteToken: TokenConfig | null;
  interval: ChartInterval;
}

/**
 * Custom hook to manage TradingView widget lifecycle
 * @param params - Configuration parameters for the chart
 * @returns Container ref and error state
 */
export const useTradingView = ({
  baseToken,
  quoteToken,
  interval,
}: UseTradingViewParams) => {
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const tvSymbol = mapPairToTradingViewSymbol(baseToken, quoteToken);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    if (!baseToken || !quoteToken || !tvSymbol) {
      if (container) {
        container.innerHTML = "";
      }
      return;
    }

    loadTradingViewScript()
      .then(() => {
        if (cancelled) return;
        const TradingView = window.TradingView;
        if (!TradingView || !containerRef.current) {
          setWidgetError("TradingView widget not available");
          return;
        }

        containerRef.current.innerHTML = "";

        new TradingView.widget({
          container_id: TRADING_VIEW_CONTAINER_ID,
          symbol: tvSymbol,
          timezone: "Etc/UTC",
          theme: "dark",
          style: 1, // candlesticks
          locale: "en",
          autosize: true,
          hide_side_toolbar: false,
          hide_top_toolbar: false,
          allow_symbol_change: false,
          save_image: false,
          studies: [],
          details: false,
          withdateranges: true,
        });

        setWidgetError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setWidgetError(
          err instanceof Error ? err.message : "Failed to load chart",
        );
      });

    return () => {
      cancelled = true;
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [baseToken, quoteToken, tvSymbol, interval]);

  return {
    containerRef,
    widgetError,
    tvSymbol,
  };
};
