"use client";

import { writeContract } from "wagmi/actions";
import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { config } from "@/lib/config";
import { WITHDRAW_LIQUIDITY_CONFIG } from "@/lib/constants/mutation.constants";
import type { WithdrawLiquidityParams } from "@/types/types.d";
import { useContractMutation } from "./core/use-contract-mutation";
import { validateBigIntPositive } from "./core/validation";

export const useWithdrawLiquidity = () => {
  return useContractMutation<WithdrawLiquidityParams>({
    toast: {
      toastId: WITHDRAW_LIQUIDITY_CONFIG.toastId,
      loadingMessage: "Withdrawing liquidity...",
      successMessage: WITHDRAW_LIQUIDITY_CONFIG.successMessage,
    },
    invalidateType: "withdrawLiquidity",
    validate: (params) =>
      validateBigIntPositive(params.shares, "shares amount"),
    mutationFn: async ({ poolAddress, shares }) => {
      return await writeContract(config, {
        address: poolAddress,
        abi: lendingPoolAbi,
        functionName: "withdrawLiquidity",
        args: [shares],
      });
    },
  });
};

export default useWithdrawLiquidity;
