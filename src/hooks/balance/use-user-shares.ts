"use client";

import { useQuery } from "@tanstack/react-query";
import { parseUnits } from "viem";
import { useReadTotalSupplyShares } from "./use-total-supply-shares";
import { useReadTotalSupplyAssets } from "./use-total-supply-assets";

export type HexAddress = `0x${string}`;

const calculateShares = (
  amount: string,
  decimals: number,
  totalSupplyShares: bigint,
  totalSupplyAssets: bigint
): bigint => {
  if (!amount || amount === "0" || amount === "") {
    return BigInt(0);
  }

  try {
    const amountBigInt = parseUnits(amount, decimals);

    if (totalSupplyAssets === BigInt(0)) {
      return BigInt(0);
    }

    // ((amount / 1eDec * 1e18) * (totalSupplyAsset / 1eDec * 1e18)) / totalSupplyShares
    const decimalsScale = BigInt(10) ** BigInt(decimals);
    const e18 = BigInt(10) ** BigInt(18);
    const amountNormalized = (amountBigInt * e18) / decimalsScale;
    const assetsNormalized = (totalSupplyAssets * e18) / decimalsScale;
    const calculatedShares =
      (amountNormalized * assetsNormalized) / totalSupplyShares;

    return calculatedShares;
  } catch {
    return BigInt(0);
  }
};

export const useCalculateWithdrawShares = (
  lendingPoolAddress: HexAddress,
  amount: string,
  decimals: number
) => {
  const { totalSupplyShares, totalSupplySharesLoading: sharesLoading } =
    useReadTotalSupplyShares(lendingPoolAddress, decimals);

  const { totalSupplyAssets, totalSupplyAssetsLoading: assetsLoading } =
    useReadTotalSupplyAssets(lendingPoolAddress, decimals);

  const { data: shares } = useQuery({
    queryKey: [
      "calculateWithdrawShares",
      {
        poolAddress: lendingPoolAddress,
        amount,
        decimals,
        totalSupplyShares: totalSupplyShares.toString(),
        totalSupplyAssets: totalSupplyAssets.toString(),
      },
    ],
    queryFn: () =>
      calculateShares(amount, decimals, totalSupplyShares, totalSupplyAssets),
    enabled: !sharesLoading && !assetsLoading,
    staleTime: 10_000, // Cache for 10 seconds
    gcTime: 30_000, // Keep in cache for 30 seconds
  });

  return {
    shares: shares || BigInt(0),
    sharesLoading: sharesLoading || assetsLoading,
    totalSupplyShares,
    totalSupplyAssets,
  };
};
