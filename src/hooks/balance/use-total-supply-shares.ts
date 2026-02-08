"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { erc20Abi, formatUnits } from "viem";
import { useReadSharesToken } from "../address/use-read-shares-token";
import {
  TOTAL_ASSETS_QUERY_CONFIG,
  getDisplayDecimals,
} from "@/lib/constants/query.constants";

export type HexAddress = `0x${string}`;

export const totalSupplySharesKeys = {
  all: ["totalSupplyShares"] as const,
  shares: (lendingPoolAddress: string, sharesTokenAddress: string | undefined) =>
    [...totalSupplySharesKeys.all, lendingPoolAddress, sharesTokenAddress] as const,
};

export const useReadTotalSupplyShares = (
  lendingPoolAddress: HexAddress,
  decimals: number,
  initialRouterAddress?: string
) => {
  const { sharesTokenAddress, sharesTokenLoading } = useReadSharesToken(
    lendingPoolAddress,
    initialRouterAddress
  );

  const {
    data: rawShares,
    isLoading,
    error,
  } = useQuery({
    queryKey: totalSupplySharesKeys.shares(lendingPoolAddress, sharesTokenAddress || undefined),
    queryFn: async () => {
      if (!sharesTokenAddress) return BigInt(0);
      try {
        const result = await readContract(config, {
          address: sharesTokenAddress,
          abi: erc20Abi,
          functionName: "totalSupply",
          args: [],
        });
        
        return result;
      } catch {
        return BigInt(0);
      }
    },
    enabled: !!sharesTokenAddress,
    ...TOTAL_ASSETS_QUERY_CONFIG,
  });

  const formatted = rawShares
    ? parseFloat(formatUnits(rawShares as bigint, decimals)).toFixed(
        getDisplayDecimals(decimals)
      )
    : "0";

  const parsed = rawShares
    ? parseFloat(formatUnits(rawShares as bigint, decimals))
    : 0;

  return {
    totalSupplyShares: rawShares || BigInt(0),
    totalSupplySharesFormatted: formatted,
    totalSupplySharesParsed: parsed,
    totalSupplySharesLoading: sharesTokenLoading || isLoading,
    totalSupplySharesError: error,
  };
};
