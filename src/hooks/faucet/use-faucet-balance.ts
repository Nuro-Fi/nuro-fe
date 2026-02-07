"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { readContract } from "wagmi/actions";
import { formatUnits } from "viem";
import { erc20Abi } from "viem";
import { config } from "@/lib/config";
import type { HexAddress } from "@/types/types.d";

interface TokenBalanceParams {
  tokenAddress: HexAddress;
  userAddress: HexAddress;
  decimals: number;
}

export const faucetBalanceKeys = {
  all: ["faucet-balance"] as const,
  token: (tokenAddress: string, userAddress: string) =>
    [...faucetBalanceKeys.all, tokenAddress, userAddress] as const,
};

export const useFaucetBalance = ({
  tokenAddress,
  userAddress,
  decimals,
}: TokenBalanceParams) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: faucetBalanceKeys.token(tokenAddress, userAddress),
    queryFn: async () => {
      const balance = await readContract(config, {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [userAddress],
      });

      return {
        raw: balance,
        formatted: formatUnits(balance, decimals),
      };
    },
    enabled: !!tokenAddress && !!userAddress,
    staleTime: 10_000, // 10 seconds
    refetchOnWindowFocus: true,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: faucetBalanceKeys.token(tokenAddress, userAddress),
    });
  };

  return {
    ...query,
    balance: query.data?.formatted ?? "0",
    balanceRaw: query.data?.raw ?? BigInt(0),
    invalidate,
  };
};

export default useFaucetBalance;
