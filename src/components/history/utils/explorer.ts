import type { TransactionType } from "@/hooks/graphql/use-history";
import type { HexAddress } from "@/types/common";
import {
  getBlockExplorerUrl,
  getLayerZeroExplorerUrl,
} from "@/lib/utils/block-explorer";

export const getExplorerUrl = (
  txHash: string,
  type: TransactionType,
): string => {
  if (type === "crosschain_borrow") {
    return getLayerZeroExplorerUrl(txHash as HexAddress);
  }
  return getBlockExplorerUrl(txHash as HexAddress);
};
