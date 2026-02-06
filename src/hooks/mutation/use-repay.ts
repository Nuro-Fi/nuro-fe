"use client";

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract } from "wagmi/actions";
import { useConnection } from "wagmi";
import { toast } from "sonner";
import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { config } from "@/lib/config";
import { getBlockExplorerUrl } from "@/lib/utils/block-explorer";
import { waitForTxReceipt } from "@/lib/utils/wait-for-tx";
import { isUserRejectedError } from "@/lib/utils/error.utils";
import { invalidateKeys } from "@/lib/constants/query-keys";
import { useReadTotalBorrowAssets } from "@/hooks/balance/use-total-borrow-assets";
import { useReadTotalBorrowShares } from "@/hooks/balance/use-total-borrow-shares";
import { REPAY_CONFIG } from "@/lib/constants/mutation.constants";
import { zeroAddress } from "viem";
import type {
  HexAddress,
  TxStatus,
  RepayParams,
  RepayState,
  UseRepayOptions,
  RepayMode,
} from "@/types";
import { calculateSharesFromPosition, calculateSharesSelectToken } from "./core/repay-utils";
import { parseAmountToBigInt, validateAmount } from "./core/validation";

const CONFIRMING_TOAST_ID = "confirming";

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

const showSuccessToast = (hash: HexAddress) => {
  toast.dismiss(CONFIRMING_TOAST_ID);
  toast.success(REPAY_CONFIG.successMessage, {
    action: {
      label: "View Transaction",
      onClick: () => window.open(getBlockExplorerUrl(hash), "_blank"),
    },
  });
};

const handleError = (
  error: Error,
  setStatus: (status: TxStatus) => void,
  setError: (error: string | null) => void,
): void => {
  toast.dismiss(REPAY_CONFIG.toastId);
  toast.dismiss(CONFIRMING_TOAST_ID);

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
  const { address } = useConnection();

  const poolAddress = options?.poolAddress;
  const decimals = options?.decimals ?? 18;
  const mode: RepayMode = options?.mode ?? "select-token";
  const { totalBorrowAssets } = useReadTotalBorrowAssets(
    (poolAddress ?? zeroAddress) as HexAddress,
    decimals,
  );
  const { totalBorrowShares } = useReadTotalBorrowShares(
    (poolAddress ?? zeroAddress) as HexAddress,
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
  const setTxHash = useCallback(
    (txHash: HexAddress | null) => setState((prev) => ({ ...prev, txHash })),
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

        const hash = await writeContract(config, {
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
        setTxHash(hash);

        toast.dismiss(REPAY_CONFIG.toastId);
        toast.loading("Waiting for confirmation...", {
          id: CONFIRMING_TOAST_ID,
        });

        const result = await waitForTxReceipt(hash);

        showSuccessToast(hash);
        setStatus("success");
        invalidateKeys(queryClient, "repay");

        return result;
      } catch (e) {
        handleError(e as Error, setStatus, setError);
        throw e;
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
