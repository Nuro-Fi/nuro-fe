"use client";

import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { WITHDRAW_COLLATERAL_CONFIG } from "@/lib/constants/mutation.constants";
import type { WithdrawCollateralParams } from "@/types/types.d";
import { useContractMutation } from "./core/use-contract-mutation";
import { parseAmountToBigInt, validateAmount } from "./core/validation";
import { useCircleWriteContract } from "@/hooks/use-circle-wagmi";

export const useWithdrawCollateral = () => {
  const { writeContract } = useCircleWriteContract();

  return useContractMutation<WithdrawCollateralParams>({
    toast: {
      toastId: WITHDRAW_COLLATERAL_CONFIG.toastId,
      loadingMessage: "Withdrawing collateral...",
      successMessage: WITHDRAW_COLLATERAL_CONFIG.successMessage,
    },
    invalidateType: "withdrawCollateral",
    validate: (params) => validateAmount(params.amount),
    mutationFn: async ({ poolAddress, amount, decimals }) => {
      const amountBigInt = parseAmountToBigInt(amount, decimals);

      return await writeContract({
        address: poolAddress,
        abi: lendingPoolAbi,
        functionName: "withdrawCollateral",
        args: [amountBigInt],
      });
    },
  });
};

export default useWithdrawCollateral;
