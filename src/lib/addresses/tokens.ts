import { Network, TokensConfig, TokenSymbol, TokenConfig } from "./types";
export const TOKENS: Record<Network, TokensConfig> = {
  [Network.ARC]: {
    [TokenSymbol.mUSDC]: {
      name: "Mock USDC",
      symbol: "mUSDC",
      logo: "/token/usdc.png",
      decimals: 6,
      address: "0xdf05e9abf64da281b3cbd8ac3581022ec4841fb2",
    },
    [TokenSymbol.mUSDT]: {
      name: "Mock USYC",
      symbol: "USYC",
      logo: "/token/usyc.svg",
      decimals: 6,
      address: "0x04C37dc1b538E00b31e6bc883E16d97cD7937a10",
    },
    [TokenSymbol.mEURC]: {
      name: "Mock EURC",
      symbol: "mEURC",
      logo: "/token/eurc.png",
      decimals: 6,
      address: "0x15858A57854BBf0DF60A737811d50e1Ee785f9bc",
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

