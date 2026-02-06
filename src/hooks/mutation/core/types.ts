"use client";

import type { HexAddress, TxStatus } from "@/types/types.d";
import type { UseMutationResult } from "@tanstack/react-query";

export interface MutationToastConfig {
  toastId: string;
  loadingMessage: string;
  successMessage: string;
}

export type InvalidateType =
  | "supply"
  | "borrow"
  | "repay"
  | "withdrawLiquidity"
  | "withdrawCollateral"
  | "swap";

export interface ContractMutationOptions<TParams> {
  toast: MutationToastConfig;
  invalidateType?: InvalidateType;
  validate?: (params: TParams) => { isValid: boolean; error?: string };
  mutationFn: (params: TParams, address: HexAddress) => Promise<HexAddress>;
}

export interface ContractMutationResult<TParams> {
  status: TxStatus;
  mutation: UseMutationResult<unknown, Error, TParams, unknown>;
  txHash: HexAddress | null;
  error: string | null;
  reset: () => void;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
}
