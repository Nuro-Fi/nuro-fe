"use client";

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAddress } from "@/hooks/use-user-address";
import { useCircleWriteContract } from "@/hooks/use-circle-wagmi";
import { toast } from "sonner";
import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { isUserRejectedError } from "@/lib/utils/error.utils";
import { invalidateKeys } from "@/lib/constants/query-keys";
import { useReadTotalBorrowAssets } from "@/hooks/balance/use-total-borrow-assets";
import { useReadTotalBorrowShares } from "@/hooks/balance/use-total-borrow-shares";
import { REPAY_CONFIG } from "@/lib/constants/mutation.constants";
import type {
  HexAddress,
  TxStatus,
  RepayParams,
  RepayState,
  UseRepayOptions,
  RepayMode,
} from "@/types";
import {
  calculateSharesFromPosition,
  calculateSharesSelectToken,
} from "./core/repay-utils";
import { parseAmountToBigInt, validateAmount } from "./core/validation";

const calculateShares = (
  amountBigInt: bigint,
  decimals: number,
  totalBorrowAssets: bigint,
  totalBorrowShares: bigint,
  mode: RepayMode,
): bigint => {
  return mode === "from-position"
    ? calculateSharesFromPosition(
        amountBigInt,
        decimals,
        totalBorrowAssets,
        totalBorrowShares,
      )
    : calculateSharesSelectToken(
        amountBigInt,
        totalBorrowAssets,
        totalBorrowShares,
      );
};

const buildRepayArgs = (
  userAddress: HexAddress,
  borrowTokenAddress: HexAddress,
  shares: bigint,
  isFromPosition: boolean,
) => ({
  user: userAddress,
  token: borrowTokenAddress,
  shares,
  amountOutMinimum: BigInt(0),
  fromPosition: isFromPosition,
  fee: 1000,
});

const showSuccessToast = () => {
  toast.dismiss(REPAY_CONFIG.toastId);
  toast.success(REPAY_CONFIG.successMessage);
};

const handleError = (
  error: Error,
  setStatus: (status: TxStatus) => void,
  setError: (error: string | null) => void,
): void => {
  toast.dismiss(REPAY_CONFIG.toastId);

  if (isUserRejectedError(error)) {
    setStatus("idle");
    toast.error("Transaction rejected");
  } else {
    setStatus("error");
    setError(error.message);
    toast.error("Transaction Failed");
  }
};
export const useRepay = (options?: UseRepayOptions) => {
  const queryClient = useQueryClient();
  const { address } = useUserAddress();
  const { writeContract } = useCircleWriteContract();

  const poolAddress = options?.poolAddress;
  const decimals = options?.decimals ?? 18;
  const mode: RepayMode = options?.mode ?? "select-token";
  const { totalBorrowAssets } = useReadTotalBorrowAssets(
    poolAddress! as HexAddress,
    decimals,
  );
  const { totalBorrowShares } = useReadTotalBorrowShares(
    poolAddress! as HexAddress,
    decimals,
  );

  const [state, setState] = useState<RepayState>({
    status: "idle",
    txHash: null,
    error: null,
  });

  const setStatus = useCallback(
    (status: TxStatus) => setState((prev) => ({ ...prev, status })),
    [],
  );
  const setError = useCallback(
    (error: string | null) => setState((prev) => ({ ...prev, error })),
    [],
  );

  const mutation = useMutation({
    mutationFn: async ({
      poolAddress,
      borrowTokenAddress,
      amount,
      decimals,
    }: RepayParams) => {
      if (!address) {
        toast.error("Wallet not connected");
        throw new Error("Wallet not connected");
      }

      setState({ status: "idle", txHash: null, error: null });

      const validation = validateAmount(amount);
      if (!validation.isValid) {
        toast.error(validation.error);
        throw new Error(validation.error);
      }

      const amountBigInt = parseAmountToBigInt(amount, decimals);
      const shares = calculateShares(
        amountBigInt,
        decimals,
        totalBorrowAssets,
        totalBorrowShares,
        mode,
      );

      try {
        setStatus("loading");
        toast.loading("Repaying...", { id: REPAY_CONFIG.toastId });

        await writeContract({
          address: poolAddress,
          abi: lendingPoolAbi,
          functionName: "repayWithSelectedToken",
          args: [
            buildRepayArgs(
              address as HexAddress,
              borrowTokenAddress,
              shares,
              mode === "from-position",
            ),
          ],
        });

        showSuccessToast();
        setStatus("success");

        return { success: true };
      } catch (e) {
        handleError(e as Error, setStatus, setError);
        throw e;
      } finally {
        // Always invalidate queries after 3 seconds, regardless of success or failure
        invalidateKeys(queryClient, "repay");
      }
    },
  });

  const reset = useCallback(() => {
    setState({ status: "idle", txHash: null, error: null });
    mutation.reset();
  }, [mutation]);

  return {
    status: state.status,
    mutation,
    txHash: state.txHash,
    error: state.error,
    reset,
    isSuccess: state.status === "success",
    isLoading: state.status === "loading",
    isError: state.status === "error",
  };
};

export const useRepayFromPosition = (options?: Omit<UseRepayOptions, "mode">) =>
  useRepay({ ...options, mode: "from-position" });

export const useRepaySelectToken = (options?: Omit<UseRepayOptions, "mode">) =>
  useRepay({ ...options, mode: "select-token" });

export default useRepay;
