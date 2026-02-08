"use client";

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAddress } from "@/hooks/use-user-address";
import { toast } from "sonner";
import { isUserRejectedError } from "@/lib/utils/error.utils";
import { invalidateKeys } from "@/lib/constants/query-keys";
import type { HexAddress, TxStatus } from "@/types/types.d";
import type { ContractMutationOptions, ContractMutationResult } from "./types";

export function useContractMutation<TParams>(
  options: ContractMutationOptions<TParams>,
): ContractMutationResult<TParams> {
  const { toast: toastConfig, invalidateType, validate, mutationFn } = options;

  const queryClient = useQueryClient();
  const { address } = useUserAddress();

  const [status, setStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<HexAddress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (params: TParams) => {
      try {
        if (!address) {
          toast.error("Wallet not connected");
          throw new Error("Wallet not connected");
        }

        setStatus("idle");
        setError(null);

        if (validate) {
          const validation = validate(params);
          if (!validation.isValid) {
            toast.error(validation.error || "Validation failed");
            throw new Error(validation.error || "Validation failed");
          }
        }

        setStatus("loading");
        toast.loading(toastConfig.loadingMessage, { id: toastConfig.toastId });

        const hash = await mutationFn(params, address as HexAddress);
        setTxHash(hash);

        toast.dismiss(toastConfig.toastId);
        toast.success(toastConfig.successMessage);

        setStatus("success");

        return { success: true };
      } catch (e) {
        const err = e as Error;
        toast.dismiss(toastConfig.toastId);

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
        if (invalidateType) {
          invalidateKeys(queryClient, invalidateType);
        }
      }
    },
  });

  const reset = useCallback(() => {
    setStatus("idle");
    setTxHash(null);
    setError(null);
    mutation.reset();
  }, [mutation]);

  return {
    status,
    mutation,
    txHash,
    error,
    reset,
    isSuccess: status === "success",
    isLoading: status === "loading",
    isError: status === "error",
  };
}
