"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { useUserAddress } from "@/hooks/use-user-address";
import { useCircleWriteContract } from "@/hooks/use-circle-wagmi";
import { toast } from "sonner";
import { isUserRejectedError } from "@/lib/utils/error.utils";
import { invalidateKeys } from "@/lib/constants/query-keys";
import type { HexAddress, TxStatus } from "@/types/types.d";
import type { BorrowParams } from "@/hooks/use-get-fee";

const LZ_EXPLORER_ADDRESS = "0x0c832FeE16d5A8BC99B888E16D3712E6BEf96Fb7";
const LZ_TESTNET_EXPLORER_URL = `https://testnet.layerzeroscan.com/address/${LZ_EXPLORER_ADDRESS}`;

export interface BorrowCrossChainParams {
  poolAddress: HexAddress;
  borrowParams: BorrowParams;
  nativeFee: bigint;
}

export const useBorrowCrossChain = () => {
  const queryClient = useQueryClient();
  const { address } = useUserAddress();
  const { writeContract } = useCircleWriteContract();

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

        await writeContract({
          address: poolAddress,
          abi: lendingPoolAbi,
          functionName: "borrowDebtCrossChain",
          args: [paramsWithFee],
          value: nativeFee,
        });

        toast.dismiss("borrow-crosschain");
        toast.success("Cross-chain borrow successful!", {
          description: "Track your transaction on LayerZero Explorer",
          action: {
            label: "View on Explorer",
            onClick: () => window.open(LZ_TESTNET_EXPLORER_URL, "_blank"),
          },
          duration: 10000,
        });

        setStatus("success");

        return { success: true };
      } catch (e) {
        const err = e as Error;
        toast.dismiss("borrow-crosschain");

        if (isUserRejectedError(err)) {
          setStatus("idle");
          toast.error("Transaction rejected");
        } else {
          setStatus("error");
          setError(err.message);
          toast.error("Transaction Failed");
        }

        throw e;
      } finally {
        // Always invalidate queries after 3 seconds, regardless of success or failure
        invalidateKeys(queryClient, "borrow");
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
