"use client";

import { useReadContract } from "wagmi";
import { routerAbi } from "@/lib/abis/router-abi";
import { usePoolByAddress } from "../graphql/use-pools";
export type HexAddress = `0x${string}`;

export const useReadSharesToken = (
  lendingPoolAddress: HexAddress,
  initialRouterAddress?: string,
) => {
  const { data: pool, isLoading: routerLoading } =
    usePoolByAddress(lendingPoolAddress);

  const routerAddress = initialRouterAddress || pool?.router;

  const {
    data: sharesTokenAddress,
    isLoading,
    error,
  } = useReadContract({
    address: routerAddress as HexAddress | undefined,
    abi: routerAbi,
    functionName: "sharesToken",
    args: [],
    query: {
      enabled: !!routerAddress,
    },
  });

  return {
    sharesTokenAddress: sharesTokenAddress as HexAddress | undefined,
    sharesTokenLoading: routerLoading || isLoading,
    sharesTokenError: error,
  };
};
