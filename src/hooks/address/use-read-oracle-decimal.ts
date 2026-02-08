"use client";

import { useReadContract } from "wagmi";
import { tokenDataAbi } from "@/lib/abis/token-data-abi";

export type HexAddress = `0x${string}`;

const oracleAddress = "0xE2e025Ff8a8adB2561e3C631B5a03842b9A1Ae88";

export const useReadOracleDecimal = (tokenAddress?: HexAddress) => {
  const {
    data: oracleDecimal,
    isLoading,
    error,
  } = useReadContract({
    address: oracleAddress,
    abi: tokenDataAbi,
    functionName: "decimals",
    args: tokenAddress ? [tokenAddress] : undefined,
    query: {
      enabled: !!tokenAddress,
    },
  });

  return {
    oracleDecimal,
    oracleDecimalLoading: isLoading,
    oracleDecimalError: error,
  };
};
