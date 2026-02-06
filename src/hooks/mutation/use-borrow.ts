"use client";

import { writeContract } from "wagmi/actions";
import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { config } from "@/lib/config";
import { BORROW_CONFIG } from "@/lib/constants/mutation.constants";
import type { BorrowParams } from "@/types/types.d";
import { useContractMutation } from "./core/use-contract-mutation";
import { parseAmountToBigInt, validateAmount } from "./core/validation";

export const useBorrow = () => {
  return useContractMutation<BorrowParams>({
    toast: {
      toastId: BORROW_CONFIG.toastId,
      loadingMessage: "Borrowing...",
      successMessage: BORROW_CONFIG.successMessage,
    },
    invalidateType: "borrow",
    validate: (params) => validateAmount(params.amount),
    mutationFn: async ({ poolAddress, amount, decimals }) => {
      const amountBigInt = parseAmountToBigInt(amount, decimals);

      return await writeContract(config, {
        address: poolAddress,
        abi: lendingPoolAbi,
        functionName: "borrowDebt",
        args: [amountBigInt],
      });
    },
  });
};

export default useBorrow;
