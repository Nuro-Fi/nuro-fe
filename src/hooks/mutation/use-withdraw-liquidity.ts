"use client";

import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { WITHDRAW_LIQUIDITY_CONFIG } from "@/lib/constants/mutation.constants";
import type { WithdrawLiquidityParams } from "@/types/types.d";
import { useContractMutation } from "./core/use-contract-mutation";
import { validateBigIntPositive } from "./core/validation";
import { useCircleWriteContract } from "@/hooks/use-circle-wagmi";

export const useWithdrawLiquidity = () => {
  const { writeContract } = useCircleWriteContract();

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
      return await writeContract({
        address: poolAddress,
        abi: lendingPoolAbi,
        functionName: "withdrawLiquidity",
        args: [shares],
      });
    },
  });
};

export default useWithdrawLiquidity;
