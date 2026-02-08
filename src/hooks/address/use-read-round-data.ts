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
    address: "0xE2e025Ff8a8adB2561e3C631B5a03842b9A1Ae88",
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
