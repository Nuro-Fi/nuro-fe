import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/lib/config";
import type { HexAddress } from "@/types/types.d";

export const waitForTxReceipt = async (hash: HexAddress) => {
  return waitForTransactionReceipt(config, {
    hash,
    confirmations: 1,
    pollingInterval: 2000,
    timeout: 180_000,
    retryCount: 5,
    retryDelay: 2000,
  });
};
