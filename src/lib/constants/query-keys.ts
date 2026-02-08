export const QUERY_KEYS = {
  healthFactor: {
    all: ["healthFactor"] as const,
    user: (userAddress: string, lendingPool: string) =>
      ["healthFactor", userAddress, lendingPool] as const,
  },
  maxBorrowAmount: {
    all: ["maxBorrowAmount"] as const,
    user: (userAddress: string, lendingPool: string) =>
      ["maxBorrowAmount", userAddress, lendingPool] as const,
  },
  positionAddress: {
    all: ["positionAddress"] as const,
    byRouter: (routerAddress: string, userAddress: string) =>
      ["positionAddress", routerAddress, userAddress] as const,
  },
} as const;

export const INVALIDATE_KEYS = {
  supply: [
    "pools",
    "tokenBalance",
    "balance",
    "supplyBalance",
    "liquidityBalance",
    "totalSupplyAssets",
    "totalSupplyShares",
    "collateralBalance",
    "collateralBalanceUser",
    "healthFactor",
    "maxBorrowAmount",
    "positionAddress",
  ],
  borrow: [
    "pools",
    "tokenBalance",
    "balance",
    "totalBorrowAssets",
    "totalBorrowShares",
    "borrowShares",
    "userBorrowBalance",
    "healthFactor",
    "maxBorrowAmount",
  ],
  repay: [
    "pools",
    "tokenBalance",
    "balance",
    "totalBorrowAssets",
    "totalBorrowShares",
    "borrowShares",
    "userBorrowBalance",
    "healthFactor",
    "maxBorrowAmount",
  ],
  withdrawLiquidity: [
    "pools",
    "tokenBalance",
    "balance",
    "supplyBalance",
    "liquidityBalance",
    "totalSupplyAssets",
    "totalSupplyShares",
    "healthFactor",
    "maxBorrowAmount",
  ],
  withdrawCollateral: [
    "pools",
    "tokenBalance",
    "balance",
    "collateralBalance",
    "collateralBalanceUser",
    "healthFactor",
    "maxBorrowAmount",
  ],
  swap: ["pools", "tokenBalance", "balance", "position", "healthFactor", "collateralBalanceUser", "exchangeRate"],
  faucet: ["faucet-balance", "tokenBalance", "balance"],
} as const;

export type InvalidateKeyType = keyof typeof INVALIDATE_KEYS;

export const invalidateKeys = (
  queryClient: { invalidateQueries: (options: { queryKey: string[] }) => void },
  type: InvalidateKeyType,
) => {
  // Delay 3 seconds to ensure blockchain state is updated
  setTimeout(() => {
    INVALIDATE_KEYS[type].forEach((key) => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  }, 3000);
};

export const invalidateHealthFactor = (queryClient: {
  invalidateQueries: (options: { queryKey: readonly string[] }) => void;
}) => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.healthFactor.all });
};
