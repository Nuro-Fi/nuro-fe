"use client";

import { useQuery } from "@tanstack/react-query";
import { useConnection } from "wagmi";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { erc20Abi, formatUnits } from "viem";
import { useReadSharesToken } from "../address/use-read-shares-token";

export type HexAddress = `0x${string}`;

export const liquidityBalanceKeys = {
  all: ["liquidityBalance"] as const,
  balance: (
    lendingPoolAddress: string,
    sharesTokenAddress: string | undefined,
    userAddress: string | undefined
  ) =>
    [
      ...liquidityBalanceKeys.all,
      lendingPoolAddress,
      sharesTokenAddress,
      userAddress,
    ] as const,
};

const getDisplayDecimals = (decimals: number): number => {
  if (decimals >= 18) return 4;
  if (decimals >= 6) return 2;
  return decimals;
};

export const useReadUserLiquidityBalance = (
  lendingPoolAddress: HexAddress,
  decimals: number
) => {
  const { address } = useConnection();
  const { sharesTokenAddress, sharesTokenLoading } =
    useReadSharesToken(lendingPoolAddress);

  const {
    data: rawShares,
    isLoading,
    error,
  } = useQuery({
    queryKey: liquidityBalanceKeys.balance(lendingPoolAddress, sharesTokenAddress || undefined, address),
    queryFn: async () => {
      if (!sharesTokenAddress || !address) return BigInt(0);
      try {
        const result = await readContract(config, {
          address: sharesTokenAddress,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address],
        });
        return result;
      } catch {
        return BigInt(0);
      }
    },
    enabled: !!sharesTokenAddress && !!address,
    staleTime: 10000,
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
    userLiquidityShares: rawShares || BigInt(0),
    userLiquiditySharesFormatted: formatted,
    userLiquiditySharesParsed: parsed,
    userLiquidityBalanceLoading: sharesTokenLoading || isLoading,
    userLiquidityBalanceError: error,
  };
};
