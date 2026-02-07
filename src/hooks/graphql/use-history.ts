"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { graphClient } from "@/lib/graphql/client";
import {
  queryAllHistory,
  DEFAULT_HISTORY_LIMIT,
  type HistoryQueryParams,
} from "@/lib/graphql/history.query";
import { usePools, type PoolWithTokens } from "./use-pools";

export type TransactionType =
  | "supply_collateral"
  | "supply_liquidity"
  | "withdraw_collateral"
  | "withdraw_liquidity"
  | "borrow"
  | "repay"
  | "crosschain_borrow"
  | "liquidation";

export interface HistoryItem {
  id: string;
  type: TransactionType;
  amount: string;
  lendingPoolAddress: string;
  user: string;
  txHash: string;
  timestamp: string;
  contractChainId: number;
  destChainId?: number;
  liquidationBonus?: string;
  pool?: PoolWithTokens;
}

interface RawHistoryItem {
  id: string;
  amount?: string;
  lendingPoolAddress: string;
  user?: string;
  borrower?: string;
  txHash: string;
  timestamp: string;
  contractChainId: number;
  chainId?: number;
  userBorrowAssets?: string;
  liquidationBonus?: string;
}

// Combined response type for batch query
interface AllHistoryResponse {
  supplyCollaterals: { items: RawHistoryItem[] };
  supplyLiquiditys: { items: RawHistoryItem[] };
  withdrawCollaterals: { items: RawHistoryItem[] };
  withdrawLiquiditys: { items: RawHistoryItem[] };
  borrowDebts: { items: RawHistoryItem[] };
  repayByPositions: { items: RawHistoryItem[] };
  borrowDebtCrossChains: { items: RawHistoryItem[] };
  liquidations: { items: RawHistoryItem[] };
}

const mapToHistory = (
  items: RawHistoryItem[],
  type: TransactionType,
  pools: PoolWithTokens[],
  userAddress?: string,
): HistoryItem[] => {
  // Filter items by user address if provided
  const filteredItems = userAddress
    ? items.filter(
        (item) =>
          item.user?.toLowerCase() === userAddress.toLowerCase() ||
          item.borrower?.toLowerCase() === userAddress.toLowerCase(),
      )
    : items;

  return filteredItems.map((item) => {
    const pool = pools.find(
      (p) =>
        p.lendingPool.toLowerCase() === item.lendingPoolAddress.toLowerCase(),
    );
    return {
      id: item.id,
      type,
      amount: item.amount || item.userBorrowAssets || "0",
      lendingPoolAddress: item.lendingPoolAddress,
      user: item.user || item.borrower || "",
      txHash: item.txHash,
      timestamp: item.timestamp,
      contractChainId: item.contractChainId,
      destChainId: item.chainId,
      liquidationBonus: item.liquidationBonus,
      pool,
    };
  });
};

const fetchAllHistory = async (
  params: HistoryQueryParams = {},
): Promise<AllHistoryResponse> => {
  return graphClient.request<AllHistoryResponse>(queryAllHistory(params));
};

const processBatchResponse = (
  response: AllHistoryResponse,
  pools: PoolWithTokens[],
  userAddress?: string,
): HistoryItem[] => {
  const allHistory: HistoryItem[] = [
    ...mapToHistory(
      response.supplyCollaterals?.items || [],
      "supply_collateral",
      pools,
      userAddress,
    ),
    ...mapToHistory(
      response.supplyLiquiditys?.items || [],
      "supply_liquidity",
      pools,
      userAddress,
    ),
    ...mapToHistory(
      response.withdrawCollaterals?.items || [],
      "withdraw_collateral",
      pools,
      userAddress,
    ),
    ...mapToHistory(
      response.withdrawLiquiditys?.items || [],
      "withdraw_liquidity",
      pools,
      userAddress,
    ),
    ...mapToHistory(
      response.borrowDebts?.items || [],
      "borrow",
      pools,
      userAddress,
    ),
    ...mapToHistory(
      response.repayByPositions?.items || [],
      "repay",
      pools,
      userAddress,
    ),
    ...mapToHistory(
      response.borrowDebtCrossChains?.items || [],
      "crosschain_borrow",
      pools,
      userAddress,
    ),
    ...mapToHistory(
      response.liquidations?.items || [],
      "liquidation",
      pools,
      userAddress,
    ),
  ];

  // Sort by timestamp descending
  return allHistory.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
};

export const useHistory = (
  userAddress?: string,
  limit?: number,
  poolAddress?: string,
) => {
  const { data: pools = [] } = usePools();

  return useQuery({
    queryKey: ["history", pools.length, userAddress, limit, poolAddress],
    queryFn: async (): Promise<HistoryItem[]> => {
      const response = await fetchAllHistory({
        limit: limit ?? DEFAULT_HISTORY_LIMIT,
        poolAddress,
        userAddress,
      });
      return processBatchResponse(response, pools, userAddress);
    },
    enabled: pools.length > 0 && (!!userAddress || !!poolAddress),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
};

export const usePoolHistory = (poolAddress?: string, limit?: number) => {
  const { data: pools = [] } = usePools();

  return useQuery({
    queryKey: ["pool-history", pools.length, poolAddress, limit],
    queryFn: async (): Promise<HistoryItem[]> => {
      const response = await fetchAllHistory({
        limit: limit ?? DEFAULT_HISTORY_LIMIT,
        poolAddress,
      });
      const allItems = processBatchResponse(response, pools);
      return limit ? allItems.slice(0, limit) : allItems;
    },
    enabled: pools.length > 0 && !!poolAddress,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
};

export const useInfiniteHistory = (userAddress?: string) => {
  const { data: pools = [] } = usePools();

  return useInfiniteQuery({
    queryKey: ["history-infinite", pools.length, userAddress],
    queryFn: async ({ pageParam = 0 }): Promise<HistoryItem[]> => {
      const response = await fetchAllHistory({
        limit: DEFAULT_HISTORY_LIMIT,
        offset: pageParam,
        userAddress,
      });
      return processBatchResponse(response, pools, userAddress);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < DEFAULT_HISTORY_LIMIT) {
        return undefined;
      }
      return allPages.length * DEFAULT_HISTORY_LIMIT;
    },
    enabled: pools.length > 0 && !!userAddress,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
};
