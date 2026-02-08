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

export const totalBorrowSharesKeys = {
  all: ["totalBorrowShares"] as const,
  shares: (lendingPoolAddress: string, routerAddress: string | undefined) =>
    [...totalBorrowSharesKeys.all, lendingPoolAddress, routerAddress] as const,
};

export const useReadTotalBorrowShares = (
  lendingPoolAddress: HexAddress,
  decimals: number,
) => {
  const { data: pool, isLoading: routerLoading } =
    usePoolByAddress(lendingPoolAddress);
  const routerAddress = pool?.router;

  const {
    data: rawShares,
    isLoading,
    error,
  } = useQuery({
    queryKey: totalBorrowSharesKeys.shares(
      lendingPoolAddress,
      routerAddress || undefined,
    ),
    queryFn: async () => {
      if (!routerAddress) return BigInt(0);
      try {
        const result = await readContract(config, {
          address: routerAddress as HexAddress,
          abi: routerAbi,
          functionName: "totalBorrowShares",
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

  const formatted = rawShares
    ? parseFloat(formatUnits(rawShares as bigint, decimals)).toFixed(
        getDisplayDecimals(decimals),
      )
    : "0";

  const parsed = rawShares
    ? parseFloat(formatUnits(rawShares as bigint, decimals))
    : 0;

  return {
    totalBorrowShares: rawShares || BigInt(0),
    totalBorrowSharesFormatted: formatted,
    totalBorrowSharesParsed: parsed,
    totalBorrowSharesLoading: routerLoading || isLoading,
    totalBorrowSharesError: error,
  };
};
