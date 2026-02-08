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

export const totalSupplyAssetsKeys = {
  all: ["totalSupplyAssets"] as const,
  assets: (lendingPoolAddress: string, routerAddress: string | undefined) =>
    [...totalSupplyAssetsKeys.all, lendingPoolAddress, routerAddress] as const,
};

export const useReadTotalSupplyAssets = (
  lendingPoolAddress: HexAddress,
  decimals: number,
) => {
  const { data: pool, isLoading: routerLoading } = usePoolByAddress(lendingPoolAddress);
  const routerAddress = pool?.router;

  const {
    data: rawAssets,
    isLoading,
    error,
  } = useQuery({
    queryKey: totalSupplyAssetsKeys.assets(
      lendingPoolAddress,
      routerAddress || undefined,
    ),
    queryFn: async () => {
      if (!routerAddress) return BigInt(0);
      try {
        const result = await readContract(config, {
          address: routerAddress as HexAddress,
          abi: routerAbi,
          functionName: "totalSupplyAssets",
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
    totalSupplyAssets: rawAssets || BigInt(0),
    totalSupplyAssetsFormatted: formatted,
    totalSupplyAssetsParsed: parsed,
    totalSupplyAssetsLoading: routerLoading || isLoading,
    totalSupplyAssetsError: error,
  };
};
