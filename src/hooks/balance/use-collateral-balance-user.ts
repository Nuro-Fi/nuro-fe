"use client";

import { useQuery } from "@tanstack/react-query";
import { getBalance, readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { erc20Abi, formatUnits, zeroAddress } from "viem";
import { usePoolByAddress } from "../graphql/use-pools";
import useReadPosition from "../address/use-read-position";

export type HexAddress = `0x${string}`;

export const collateralBalanceUserKeys = {
  all: ["collateralBalanceUser"] as const,
  balance: (
    lendingPoolAddress: string,
    tokenAddress: string,
    userPosition: string | undefined,
  ) =>
    [
      ...collateralBalanceUserKeys.all,
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

const NATIVE_TOKEN_ALT = "0x0000000000000000000000000000000000000001";

const isNativeTokenAddress = (address: string) => {
  const a = address.toLowerCase();
  return (
    a === zeroAddress.toLowerCase() || a === NATIVE_TOKEN_ALT.toLowerCase()
  );
};

export const useCollateralBalanceUser = (
  lendingPoolAddress: HexAddress,
  tokenAddress: HexAddress,
  decimals: number,
  enabled = true,
) => {
  const { data: pool, isLoading: poolLoading, error: poolError } =
    usePoolByAddress(lendingPoolAddress);
  const routerAddress = pool?.router;

  const {
    positionAddress: userPosition,
    hasPosition,
    isLoading: positionLoading,
    error: userPositionError,
  } = useReadPosition(routerAddress || "");

  const isNative = isNativeTokenAddress(tokenAddress);
  const userPositionLoading = poolLoading || positionLoading;
  const hasValidPosition = hasPosition;

  const {
    data: rawBalance,
    isLoading,
    error,
  } = useQuery({
    queryKey: collateralBalanceUserKeys.balance(
      lendingPoolAddress,
      tokenAddress,
      userPosition || undefined,
    ),
    queryFn: async () => {
      if (!hasValidPosition || !tokenAddress || !lendingPoolAddress)
        return BigInt(0);
      if (!userPosition) return BigInt(0);

      try {
        if (isNative) {
          const result = await getBalance(config, {
            address: userPosition as `0x${string}`,
          });
          return result.value;
        }

        const result = await readContract(config, {
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [userPosition as `0x${string}`],
        });
        return result;
      } catch {
        return BigInt(0);
      }
    },
    enabled: Boolean(
      enabled &&
      hasValidPosition &&
      !userPositionLoading &&
      !userPositionError &&
      !poolError &&
      tokenAddress &&
      (isNative || tokenAddress !== zeroAddress) &&
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
    userCollateralBalanceError: poolError || userPositionError || error,

    hasValidPosition,
  };
};
