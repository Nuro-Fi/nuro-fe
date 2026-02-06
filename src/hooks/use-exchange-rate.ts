"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { parseUnits, formatUnits, zeroAddress } from "viem";
import { arcTestnet } from "viem/chains";
import { helperAbi } from "@/lib/abis/helper-abi";
import { getContractAddress, Network } from "@/lib/addresses";
import type { HexAddress } from "@/types/types.d";

const HELPER_ADDRESS = getContractAddress(
  Network.ARC,
  "HELPER",
) as HexAddress;

interface ExchangeRateResult {
  formattedAmountOut: string | null;
  rate: number | null;
  isLoading: boolean;
  error: Error | null;
  source: string;
}
interface ExchangeRateParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  position: string;
}

export const exchangeRateKeys = {
  all: ["exchangeRate"] as const,
  rate: (
    params: ExchangeRateParams,
  ): readonly ["exchangeRate", ExchangeRateParams] =>
    ["exchangeRate", params] as const,
};

export const useExchangeRate = (
  tokenInAddress: HexAddress | null,
  tokenOutAddress: HexAddress | null,
  amountIn: string = "1",
  positionAddress: HexAddress | null = null,
  tokenInDecimals: number = 18,
  tokenOutDecimals: number = 6,
): ExchangeRateResult => {
  const parsedAmountIn = (() => {
    try {
      const amount = parseFloat(amountIn) || 1;
      return parseUnits(amount.toString(), tokenInDecimals);
    } catch {
      return parseUnits("1", tokenInDecimals);
    }
  })();

  const isEnabled = Boolean(
    tokenInAddress && tokenOutAddress && positionAddress,
  );

  const {
    data: amountOut,
    isLoading,
    error,
  } = useQuery({
    queryKey: exchangeRateKeys.rate({
      tokenIn: tokenInAddress ?? zeroAddress,
      tokenOut: tokenOutAddress ?? zeroAddress,
      amountIn: parsedAmountIn.toString(),
      position: positionAddress ?? zeroAddress,
    }),
    queryFn: async () => {
      const result = await readContract(config, {
        abi: helperAbi,
        address: HELPER_ADDRESS,
        functionName: "getExchangeRate",
        args: [
          tokenInAddress ?? zeroAddress,
          tokenOutAddress ?? zeroAddress,
          parsedAmountIn,
          positionAddress ?? zeroAddress,
        ],
        chainId: arcTestnet.id,
      });

      return result;
    },
    enabled: isEnabled,
    refetchInterval: 15000,
    staleTime: 10000,
  });

  const formattedAmountOut = amountOut
    ? formatUnits(amountOut, tokenOutDecimals)
    : null;

  const rate = (() => {
    if (!amountOut) return null;
    try {
      const outDecimal = parseFloat(formatUnits(amountOut, tokenOutDecimals));
      const inDecimal = parseFloat(
        formatUnits(parsedAmountIn, tokenInDecimals),
      );
      if (inDecimal === 0) return null;
      return outDecimal / inDecimal;
    } catch {
      return null;
    }
  })();

  return {
    formattedAmountOut,
    rate,
    isLoading,
    error: error as Error | null,
    source: rate !== null ? "onchain" : isLoading ? "loading" : "unavailable",
  };
};
