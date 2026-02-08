"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { erc20Abi, formatUnits, zeroAddress } from "viem";
import { useReadSharesToken } from "../address/use-read-shares-token";
import { useUserAddress } from "@/hooks/use-user-address";

export type HexAddress = `0x${string}`;

export const supplyBalanceKeys = {
  all: ["supplyBalance"] as const,
  balance: (
    lendingPoolAddress: string,
    userAddress: string,
    sharesToken: string | undefined,
  ) =>
    [
      ...supplyBalanceKeys.all,
      lendingPoolAddress,
      userAddress,
      sharesToken,
    ] as const,
};

export const useReadUserSupplyBalance = (
  lendingPoolAddress: HexAddress,
  _tokenAddress?: HexAddress,
  _decimals?: number,
) => {
  const { address: userAddress } = useUserAddress();

  const { sharesTokenAddress, sharesTokenLoading, sharesTokenError } =
    useReadSharesToken(lendingPoolAddress);

  const hasValidSharesToken =
    sharesTokenAddress &&
    sharesTokenAddress !== zeroAddress &&
    sharesTokenAddress !== "0x0000000000000000000000000000000000000001";

  const {
    data: rawBalance,
    isLoading,
    error,
  } = useQuery({
    queryKey: supplyBalanceKeys.balance(
      lendingPoolAddress,
      userAddress || "",
      sharesTokenAddress || undefined,
    ),
    queryFn: async () => {
      if (!hasValidSharesToken || !userAddress || !lendingPoolAddress)
        return BigInt(0);
      try {
        const result = await readContract(config, {
          address: sharesTokenAddress as HexAddress,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [userAddress as HexAddress],
        });
        
        return result;
      } catch (err) {
        console.error("Error reading user supply balance:", err);
        return BigInt(0);
      }
    },
    enabled: Boolean(
      hasValidSharesToken &&
      !sharesTokenLoading &&
      !sharesTokenError &&
      userAddress &&
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
    ? parseFloat(formatUnits(rawBalance as bigint, 18)).toFixed(2)
    : "0";

  const parsed = rawBalance
    ? parseFloat(formatUnits(rawBalance as bigint, 18))
    : 0;

  return {
    userSupplyBalance: rawBalance || BigInt(0),
    userSupplyBalanceFormatted: formatted,
    userSupplyBalanceParsed: parsed,
    userSupplyBalanceLoading: sharesTokenLoading || isLoading,
    userSupplyBalanceError: sharesTokenError || error,
    sharesTokenAddress,
    hasValidSharesToken,
  };
};
