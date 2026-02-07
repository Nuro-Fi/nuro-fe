import { useState } from "react";
import { getTokensArray } from "@/lib/addresses/tokens";
import { Network, type TokenConfig } from "@/lib/addresses/types";

const AVAILABLE_TOKENS: TokenConfig[] = getTokensArray(Network.ARC);

const getInitialTokens = (): {
  base: TokenConfig | null;
  quote: TokenConfig | null;
} => {
  const first = AVAILABLE_TOKENS[0];
  const second = AVAILABLE_TOKENS[1];
  if (!first) return { base: null, quote: null };
  if (!second) return { base: first, quote: null };
  return { base: first, quote: second };
};

export const useChartTokens = () => {
  const initial = getInitialTokens();
  const [baseToken, setBaseToken] = useState<TokenConfig | null>(initial.base);
  const [quoteToken, setQuoteToken] = useState<TokenConfig | null>(
    initial.quote,
  );

  return {
    baseToken,
    quoteToken,
    setBaseToken,
    setQuoteToken,
  };
};
