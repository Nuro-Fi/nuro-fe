"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract } from "wagmi/actions";
import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { config } from "@/lib/config";
import { useConnection } from "wagmi";
import { toast } from "sonner";
import { getLayerZeroExplorerUrl } from "@/lib/utils/block-explorer";
import { waitForTxReceipt } from "@/lib/utils/wait-for-tx";
import { isUserRejectedError } from "@/lib/utils/error.utils";
import { invalidateKeys } from "@/lib/constants/query-keys";
import type { HexAddress, TxStatus } from "@/types/types.d";
import type { BorrowParams } from "@/hooks/use-get-fee";

export interface BorrowCrossChainParams {
  poolAddress: HexAddress;
  borrowParams: BorrowParams;
  nativeFee: bigint;
}

export const useBorrowCrossChain = () => {
  const queryClient = useQueryClient();
  const { address } = useConnection();

  const [status, setStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<HexAddress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      poolAddress,
      borrowParams,
      nativeFee,
    }: BorrowCrossChainParams) => {
      try {
        if (!address) {
          toast.error("Wallet not connected");
          throw new Error("Wallet not connected");
        }

        setStatus("idle");
        setError(null);

        const paramsWithFee: BorrowParams = {
          ...borrowParams,
          fee: {
            nativeFee,
            lzTokenFee: BigInt(0),
          },
        };

        setStatus("loading");
        toast.loading("Initiating cross-chain borrow...", {
          id: "borrow-crosschain",
        });

        const hash = await writeContract(config, {
          address: poolAddress,
          abi: lendingPoolAbi,
          functionName: "borrowDebtCrossChain",
          args: [paramsWithFee],
          value: nativeFee,
        });
        setTxHash(hash);

        toast.dismiss("borrow-crosschain");
        toast.loading("Waiting for confirmation...", { id: "confirming" });

        const result = await waitForTxReceipt(hash);

        toast.dismiss("confirming");
        toast.success("Cross-chain borrow successful!", {
          action: {
            label: "Track on LayerZero",
            onClick: () => window.open(getLayerZeroExplorerUrl(hash), "_blank"),
          },
        });

        setStatus("success");
        invalidateKeys(queryClient, "borrow");

        return result;
      } catch (e) {
        const err = e as Error;
        toast.dismiss("borrow-crosschain");
        toast.dismiss("confirming");

        if (isUserRejectedError(err)) {
          setStatus("idle");
          toast.error("Transaction rejected");
        } else {
          setStatus("error");
          setError(err.message);
          toast.error("Transaction Failed");
        }

        throw e;
      }
    },
  });

  const reset = () => {
    setStatus("idle");
    setTxHash(null);
    setError(null);
    mutation.reset();
  };

  return { status, mutation, txHash, error, reset };
};

export default useBorrowCrossChain;
