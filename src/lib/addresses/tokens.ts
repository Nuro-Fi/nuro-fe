import { Network, TokensConfig, TokenSymbol, TokenConfig } from "./types";
export const TOKENS: Record<Network, TokensConfig> = {
  [Network.ARC]: {
    [TokenSymbol.USDC]: {
      name: "USDC",
      symbol: "USDC",
      logo: "/token/usdc.png",
      decimals: 6,
      address: "0x00",
    },
    [TokenSymbol.USDT]: {
      name: "Tether USD",
      symbol: "USDT",
      logo: "/token/usdt.png",
      decimals: 6,
      address: "0x00",
    },
    [TokenSymbol.WETH]: {
      name: "Wrapped Ether",
      symbol: "WETH",
      logo: "/token/weth.png",
      decimals: 18,
      address: "0x000000000",
    },
  },
};

export const getToken = (
  network: Network,
  symbol: TokenSymbol,
): TokenConfig => {
  return TOKENS[network][symbol];
};

// get token address by network and symbol
export const getTokenAddress = (
  network: Network,
  symbol: TokenSymbol,
): string => {
  return TOKENS[network][symbol].address;
};

// Get all tokens for a specific network
export const getAllTokens = (network: Network): TokensConfig => {
  return TOKENS[network];
};

// get all tokens
export const getTokensArray = (network: Network): TokenConfig[] => {
  if (!network || !TOKENS[network]) {
    return [];
  }
  return Object.values(TOKENS[network]);
};
