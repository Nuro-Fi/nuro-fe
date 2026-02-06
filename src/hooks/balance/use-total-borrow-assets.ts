"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { routerAbi } from "@/lib/abis/router-abi";
import { formatUnits } from "viem";
import { usePoolByAddress } from "../graphql/use-pools";
import {
  TOTAL_ASSETS_QUERY_CONFIG,
  getDisplayDecimals,
} from "@/lib/constants/query.constants";

export type HexAddress = `0x${string}`;

export const totalBorrowAssetsKeys = {
  all: ["totalBorrowAssets"] as const,
  assets: (lendingPoolAddress: string, routerAddress: string | undefined) =>
    [...totalBorrowAssetsKeys.all, lendingPoolAddress, routerAddress] as const,
};

export const useReadTotalBorrowAssets = (
  lendingPoolAddress: HexAddress,
  decimals: number,
) => {
  const { data: pool, isLoading: routerLoading } =
    usePoolByAddress(lendingPoolAddress);
  const routerAddress = pool?.router;

  const {
    data: rawAssets,
    isLoading,
    error,
  } = useQuery({
    queryKey: totalBorrowAssetsKeys.assets(
      lendingPoolAddress,
      routerAddress || undefined,
    ),
    queryFn: async () => {
      if (!routerAddress) return BigInt(0);
      try {
        const result = await readContract(config, {
          address: routerAddress as HexAddress,
          abi: routerAbi,
          functionName: "totalBorrowAssets",
          args: [],
        });
        return result;
      } catch {
        return BigInt(0);
      }
    },
    enabled: !!routerAddress,
    ...TOTAL_ASSETS_QUERY_CONFIG,
  });

  const formatted = rawAssets
    ? parseFloat(formatUnits(rawAssets as bigint, decimals)).toFixed(
        getDisplayDecimals(decimals),
      )
    : "0";

  const parsed = rawAssets
    ? parseFloat(formatUnits(rawAssets as bigint, decimals))
    : 0;

  return {
    totalBorrowAssets: rawAssets || BigInt(0),
    totalBorrowAssetsFormatted: formatted,
    totalBorrowAssetsParsed: parsed,
    totalBorrowAssetsLoading: routerLoading || isLoading,
    totalBorrowAssetsError: error,
  };
};
