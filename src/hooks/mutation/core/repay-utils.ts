"use client";

export type RepayMode = "from-position" | "select-token";

export const calculateSharesFromPosition = (
  amountBigInt: bigint,
  decimals: number,
  totalBorrowAssets: bigint,
  totalBorrowShares: bigint,
): bigint => {
  if (totalBorrowAssets <= BigInt(0) || totalBorrowShares <= BigInt(0)) {
    return amountBigInt;
  }

  const e18 = BigInt(10) ** BigInt(18);
  const borrowTokenDecimalScale = BigInt(10) ** BigInt(decimals);

  // Normalize amount to 18 decimals: (amountIn * 1e18) / borrowTokenDecimals
  const amountNormalized = (amountBigInt * e18) / borrowTokenDecimalScale;

  // Normalize totalBorrowAssets to 18 decimals
  const assetsNormalized = (totalBorrowAssets * e18) / borrowTokenDecimalScale;

  // Calculate shares: (amountNormalized * totalBorrowShares) / assetsNormalized
  return (amountNormalized * totalBorrowShares) / assetsNormalized;
};

export const calculateSharesSelectToken = (
  amountBigInt: bigint,
  totalBorrowAssets: bigint,
  totalBorrowShares: bigint,
): bigint => {
  if (totalBorrowAssets <= BigInt(0) || totalBorrowShares <= BigInt(0)) {
    return amountBigInt;
  }

  // Calculate shares: (amountIn * totalBorrowAssets) / totalBorrowShares
  return (amountBigInt * totalBorrowShares) / totalBorrowAssets;
};
