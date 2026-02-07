import type { HistoryItem, TransactionType } from "@/hooks/graphql/use-history";

export const filterHistory = (
  historyData: HistoryItem[] | undefined,
  search: string,
  filter: TransactionType | "all",
) => {
  if (!historyData?.length) return [];

  let result = historyData;

  if (filter !== "all") {
    result = result.filter((item) => item.type === filter);
  }

  const query = search.trim().toLowerCase();
  if (query) {
    result = result.filter((item) => {
      const poolPair = item.pool
        ? `${item.pool.collateral.symbol}/${item.pool.borrow.symbol}`.toLowerCase()
        : "";
      return (
        item.user.toLowerCase().includes(query) ||
        item.txHash.toLowerCase().includes(query) ||
        item.lendingPoolAddress.toLowerCase().includes(query) ||
        poolPair.includes(query)
      );
    });
  }

  return result;
};
