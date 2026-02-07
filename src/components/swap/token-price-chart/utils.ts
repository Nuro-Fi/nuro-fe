import type { TokenConfig } from "@/lib/addresses/types";
import { TV_BASE_SYMBOL_MAP, STOCK_SYMBOLS } from "./constants";

export const mapPairToTradingViewSymbol = (
  baseToken: TokenConfig | null,
  quoteToken: TokenConfig | null,
): string | null => {
  if (!baseToken || !quoteToken) return null;

  const baseSymbol = TV_BASE_SYMBOL_MAP[baseToken.symbol] ?? baseToken.symbol;
  const quoteSymbol =
    TV_BASE_SYMBOL_MAP[quoteToken.symbol] ?? quoteToken.symbol;

  if (!baseSymbol || !quoteSymbol) return null;
  if (baseSymbol.toUpperCase() === quoteSymbol.toUpperCase()) return null;

  const isStock = STOCK_SYMBOLS.includes(baseSymbol.toUpperCase());

  if (isStock) {
    return `NASDAQ:${baseSymbol.toUpperCase()}`;
  }

  const base = baseSymbol.toLowerCase();
  const quote = quoteSymbol.toLowerCase();

  return `MEXC:${base}${quote}`;
};


export const getDisplaySymbol = (token: TokenConfig | null): string | null => {
  if (!token) return null;
  return TV_BASE_SYMBOL_MAP[token.symbol] ?? token.symbol;
};
