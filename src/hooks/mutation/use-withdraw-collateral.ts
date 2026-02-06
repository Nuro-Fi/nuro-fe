"use client";

import { writeContract } from "wagmi/actions";
import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { config } from "@/lib/config";
import { WITHDRAW_COLLATERAL_CONFIG } from "@/lib/constants/mutation.constants";
import type { WithdrawCollateralParams } from "@/types/types.d";
import { useContractMutation } from "./core/use-contract-mutation";
import { parseAmountToBigInt, validateAmount } from "./core/validation";

export const useWithdrawCollateral = () => {
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

      return await writeContract(config, {
        address: poolAddress,
        abi: lendingPoolAbi,
        functionName: "withdrawCollateral",
        args: [amountBigInt],
      });
    },
  });
};

export default useWithdrawCollateral;
