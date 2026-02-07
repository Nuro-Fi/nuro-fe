"use client";

import { formatUnits } from "viem";
import type { HistoryItem } from "@/hooks/graphql/use-history";
import { getTransactionTypeConfig } from "./transaction-type-config";
import {
  formatTimestamp,
  PoolPairDisplay,
  ChainDisplay,
  TxHashLink,
} from "./history-row-components";

interface HistoryTableRowProps {
  item: HistoryItem;
}

const getTokenInfo = (item: HistoryItem) => {
  if (!item.pool) return null;
  if (
    item.type === "supply_collateral" ||
    item.type === "withdraw_collateral"
  ) {
    return item.pool.collateral;
  }
  return item.pool.borrow;
};

export const HistoryTableRow = ({ item }: HistoryTableRowProps) => {
  const config = getTransactionTypeConfig(item.type);
  const tokenInfo = getTokenInfo(item);
  const decimals = tokenInfo?.decimals || 18;
  const formattedAmount = formatUnits(BigInt(item.amount || "0"), decimals);

  return (
    <tr className="bg-surface-primary/40 transition-colors hover:bg-surface-secondary/70">
      <td className="px-4 py-4">
        <span className="text-sm text-text-secondary">
          {config.label}
        </span>
      </td>

      <td className="px-4 py-4">
        <PoolPairDisplay
          pool={item.pool}
          poolAddress={item.lendingPoolAddress}
        />
      </td>

      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">
            {parseFloat(formattedAmount).toLocaleString(undefined, {
              maximumFractionDigits: 6,
            })}
          </span>
          {tokenInfo && (
            <span className="text-xs text-text-muted">{tokenInfo.symbol}</span>
          )}
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="text-sm text-text-tertiary">
          {item.user.slice(0, 6)}...{item.user.slice(-4)}
        </span>
      </td>

      <td className="px-4 py-4">
        <ChainDisplay
          type={item.type}
          contractChainId={item.contractChainId}
          destChainId={item.destChainId}
        />
      </td>

      <td className="px-4 py-4">
        <span className="text-sm text-text-secondary">
          {formatTimestamp(item.timestamp)}
        </span>
      </td>

      <td className="px-4 py-4">
        <TxHashLink txHash={item.txHash} type={item.type} />
      </td>
    </tr>
  );
};
