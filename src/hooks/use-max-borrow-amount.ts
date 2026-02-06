"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "wagmi/actions";
import { formatUnits, zeroAddress } from "viem";
import { arcTestnet } from "viem/chains";
import { config } from "@/lib/config";
import { helperAbi } from "@/lib/abis/helper-abi";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { getDisplayDecimals, TOTAL_ASSETS_QUERY_CONFIG } from "@/lib/constants/query.constants";
import type { HexAddress } from "@/types";
import { CONTRACT_ADDRESSES } from "@/lib/constants/chains";

export const maxBorrowAmountKeys = QUERY_KEYS.maxBorrowAmount;

export interface UseMaxBorrowAmountResult {
  maxBorrowAmountRaw: bigint | null;
  maxBorrowAmountFormatted: string | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseMaxBorrowAmountParams {
  lendingPoolAddress: HexAddress | undefined | null;
  userAddress: HexAddress | undefined | null;
  tokenDecimals?: number;
  helperAddress?: HexAddress;
  enabled?: boolean;
}

export const useMaxBorrowAmount = ({
  lendingPoolAddress,
  userAddress,
  tokenDecimals = 18,
  helperAddress = CONTRACT_ADDRESSES.HELPER as HexAddress,
  enabled = true,
}: UseMaxBorrowAmountParams): UseMaxBorrowAmountResult => {
  const isEnabled = Boolean(
    enabled &&
      lendingPoolAddress &&
      lendingPoolAddress !== zeroAddress &&
      userAddress &&
      userAddress !== zeroAddress,
  );

  const safeUser = (userAddress || zeroAddress) as HexAddress;
  const safePool = (lendingPoolAddress || zeroAddress) as HexAddress;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: maxBorrowAmountKeys.user(safeUser, safePool),
    queryFn: async () => {
      const result = await readContract(config, {
        abi: helperAbi,
        address: helperAddress,
        functionName: "getMaxBorrowAmount",
        args: [safePool, safeUser],
        chainId: arcTestnet.id,
      });
      return result;
    },
    enabled: isEnabled,
    ...TOTAL_ASSETS_QUERY_CONFIG,
  });

  const maxBorrowAmountRaw = (data as bigint | undefined) ?? null;

  const maxBorrowAmountFormatted = (() => {
    if (maxBorrowAmountRaw === null) return null;
    try {
      const raw = formatUnits(maxBorrowAmountRaw, tokenDecimals);
      const n = parseFloat(raw);
      const displayDecimals = getDisplayDecimals(tokenDecimals);
      if (!Number.isFinite(n)) return raw;
      return n.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: displayDecimals,
      });
    } catch {
      return null;
    }
  })();

  return {
    maxBorrowAmountRaw,
    maxBorrowAmountFormatted,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};

export default useMaxBorrowAmount;
