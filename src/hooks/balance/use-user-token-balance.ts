"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserAddress } from "@/hooks/use-user-address";
import { readContract, getBalance } from "wagmi/actions";
import { config } from "@/lib/config";
import { formatUnits } from "viem/utils";
import { erc20Abi, zeroAddress } from "viem";

const NATIVE_TOKEN_ALT = "0x0000000000000000000000000000000000000001";

export type HexAddress = `0x${string}`;

export const tokenBalanceKeys = {
  all: ["tokenBalance"] as const,
  token: (tokenAddress: string, userAddress: string | undefined) =>
    [...tokenBalanceKeys.all, tokenAddress, userAddress] as const,
};

const getDisplayDecimals = (decimals: number): number => {
  if (decimals >= 18) return 4;
  if (decimals >= 6) return 2;
  return decimals;
};

export const useUserWalletBalance = (
  tokenAddress: HexAddress,
  decimals: number,
  enabled = true,
) => {
  const { address } = useUserAddress();

  const {
    data: rawBalance,
    isLoading,
    error,
  } = useQuery({
    queryKey: tokenBalanceKeys.token(tokenAddress, address),
    queryFn: async () => {
      if (!address || !tokenAddress) return BigInt(0);
      try {
        if (tokenAddress === zeroAddress || tokenAddress === NATIVE_TOKEN_ALT) {
          const result = await getBalance(config, {
            address: address,
          });
          return result.value;
        }

        const result = await readContract(config, {
          abi: erc20Abi,
          address: tokenAddress,
          functionName: "balanceOf",
          args: [address],
        });
        return result;
      } catch {
        return BigInt(0);
      }
    },
    enabled: enabled && !!address && !!tokenAddress,
    staleTime: 5000,
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
    userWalletBalanceFormatted: formatted,
    userWalletBalanceParsed: parsed,
    walletBalanceLoading: isLoading,
    walletBalanceError: error,
  };
};
