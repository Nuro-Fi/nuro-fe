import type { HexAddress } from "@/types/types.d";
import {
  BLOCK_EXPLORERS,
  EID_TO_CHAIN_ID,
  CHAIN_IDS,
  LAYERZERO_EXPLORER,
} from "@/lib/constants/chains";

export const getBlockExplorerUrl = (
  txHash: HexAddress,
  chainId: number = CHAIN_IDS.ARC,
): string => {
  const baseUrl = BLOCK_EXPLORERS[chainId] || BLOCK_EXPLORERS[CHAIN_IDS.ARC];
  return `${baseUrl}/tx/${txHash}`;
};

export const getAddressExplorerUrl = (
  address: HexAddress,
  chainId: number = CHAIN_IDS.ARC,
): string => {
  const baseUrl = BLOCK_EXPLORERS[chainId] || BLOCK_EXPLORERS[CHAIN_IDS.ARC];
  return `${baseUrl}/address/${address}`;
};

export const getLayerZeroExplorerUrl = (txHash: HexAddress): string => {
  return `${LAYERZERO_EXPLORER}/tx/${txHash}`;
};

export const getExplorerUrlByEid = (
  txHash: HexAddress,
  eid: number,
): string => {
  const chainId = EID_TO_CHAIN_ID[eid];
  if (chainId) {
    return getBlockExplorerUrl(txHash, chainId);
  }
  return getLayerZeroExplorerUrl(txHash);
};
