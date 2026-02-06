"use client";

import { useReadContract } from "wagmi";
import { tokenDataAbi } from "@/lib/abis/token-data-abi";

export type HexAddress = `0x${string}`;

export const useReadOracleRoundData = (tokenAddress?: HexAddress) => {
  const {
    data: oracleRoundData,
    isLoading,
    error,
  } = useReadContract({
    address: "0x00000000000",
    abi: tokenDataAbi,
    functionName: "latestRoundData",
    args: tokenAddress ? [tokenAddress] : undefined,
    query: {
      enabled: !!tokenAddress,
    },
  });

  return {
    oracleRoundData,
    oracleRoundDataLoading: isLoading,
    oracleRoundDataError: error,
  };
};
