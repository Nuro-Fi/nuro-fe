"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { formatUnits, zeroAddress } from "viem";
import { usePoolByAddress } from "../graphql/use-pools";
import useReadPosition from "../address/use-read-position";
import { positionAbi } from "@/lib/abis";

export type HexAddress = `0x${string}`;

export const totalCollateralBalanceUserKeys = {
  all: ["collateralBalance"] as const,
  balance: (
    lendingPoolAddress: string,
    tokenAddress: string,
    userPosition: string | undefined,
  ) =>
    [
      ...totalCollateralBalanceUserKeys.all,
      lendingPoolAddress,
      tokenAddress,
      userPosition,
    ] as const,
};

const getDisplayDecimals = (decimals: number): number => {
  if (decimals >= 18) return 4;
  if (decimals >= 6) return 2;
  return decimals;
};

export const useTotalCollateralBalanceUser = (
  lendingPoolAddress: HexAddress,
  tokenAddress: HexAddress,
  decimals: number,
) => {
  const { data: pool, isLoading: routerLoading } =
    usePoolByAddress(lendingPoolAddress);
  const routerAddress = pool?.router;
  const {
    positionAddress: userPosition,
    hasPosition,
    isLoading: positionLoading,
    error: userPositionError,
  } = useReadPosition(routerAddress!);

  const userPositionLoading = routerLoading || positionLoading;
  const hasValidPosition = hasPosition;

  const {
    data: rawBalance,
    isLoading,
    error,
  } = useQuery({
    queryKey: totalCollateralBalanceUserKeys.balance(
      lendingPoolAddress,
      tokenAddress,
      userPosition || undefined,
    ),
    queryFn: async () => {
      if (
        !hasValidPosition ||
        !userPosition ||
        !tokenAddress ||
        !lendingPoolAddress
      )
        return BigInt(0);
      try {
        const result = await readContract(config, {
          address: userPosition as HexAddress,
          abi: positionAbi,
          functionName: "totalCollateral",
          args: [],
        });
        return result;
      } catch {
        return BigInt(0);
      }
    },
    enabled: Boolean(
      hasValidPosition &&
      !userPositionLoading &&
      !userPositionError &&
      tokenAddress &&
      tokenAddress !== zeroAddress &&
      lendingPoolAddress &&
      lendingPoolAddress !== zeroAddress,
    ),
    staleTime: 10000,
    gcTime: 30000,
    retry: 2,
    retryDelay: 400,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const formatted = rawBalance
    ? parseFloat(formatUnits(rawBalance as bigint, decimals)).toFixed(
        getDisplayDecimals(decimals),
      )
    : "0";

  const parsed = rawBalance
    ? parseFloat(formatUnits(rawBalance as bigint, decimals))
    : 0;

  return {
    userCollateralBalance: rawBalance || BigInt(0),
    userCollateralBalanceFormatted: formatted,
    userCollateralBalanceParsed: parsed,
    userCollateralBalanceLoading: userPositionLoading || isLoading,
    userCollateralBalanceError: userPositionError || error,

    hasValidPosition,
  };
};
