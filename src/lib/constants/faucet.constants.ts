export const FAUCET_CONFIG = {
  toastId: "faucet-claim",
  successMessage: "Tokens Claimed!",
  successDescription: "Faucet tokens have been sent to your wallet",
} as const;

// Default faucet amount per token (in token units)
export const FAUCET_AMOUNTS: Record<string, string> = {
  USDT: "100", // 100 USDT
  WETH: "0.5", // 0.5 WETH
  ARC: "1000", // 1000 ARC
} as const;

// Cooldown period between claims (in seconds)
export const FAUCET_COOLDOWN = 3600; // 1 hour
