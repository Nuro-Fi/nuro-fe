"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { formatUnits, zeroAddress } from "viem";
import { useUserAddress } from "@/hooks/use-user-address";
import { routerAbi } from "@/lib/abis/router-abi";

export type HexAddress = `0x${string}`;

export const borrowSharesKeys = {
  all: ["borrowShares"] as const,
  shares: (routerAddress: string, userAddress: string) =>
    [...borrowSharesKeys.all, routerAddress, userAddress] as const,
};

export const useReadUserBorrowShares = (
  routerAddress: HexAddress | undefined,
  borrowTokenDecimals: number,
) => {
  const { address: userAddress } = useUserAddress();

  const isValidAddress = routerAddress && routerAddress !== zeroAddress;

  const queryResult = useQuery({
    queryKey: borrowSharesKeys.shares(routerAddress!, userAddress!),
    queryFn: async () => {
      if (!userAddress || !isValidAddress) {
        return {
          rawShares: BigInt(0),
          formatted: "0.00",
        };
      }

      try {
        const rawShares = await readContract(config, {
          address: routerAddress as HexAddress,
          abi: routerAbi,
          functionName: "userBorrowShares",
          args: [userAddress],
        });

        const formatted = parseFloat(
          formatUnits(rawShares, borrowTokenDecimals),
        ).toFixed(2);

        return {
          rawShares,
          formatted,
        };
      } catch {
        return {
          rawShares: BigInt(0),
          formatted: "0.00",
        };
      }
    },
    enabled: !!isValidAddress && !!userAddress,
    refetchInterval: 10000,
  });

  return {
    borrowShares: queryResult.data?.rawShares || BigInt(0),
    borrowSharesFormatted: queryResult.data?.formatted || "0.00",
    isLoadingBorrowShares: queryResult.isLoading,
    borrowSharesError: queryResult.error,
    refetchBorrowShares: queryResult.refetch,
  };
};


