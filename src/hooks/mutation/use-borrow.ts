"use client";

import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { BORROW_CONFIG } from "@/lib/constants/mutation.constants";
import type { BorrowParams } from "@/types/types.d";
import { useContractMutation } from "./core/use-contract-mutation";
import { parseAmountToBigInt, validateAmount } from "./core/validation";
import { useCircleWriteContract } from "@/hooks/use-circle-wagmi";

export const useBorrow = () => {
  const { writeContract } = useCircleWriteContract();

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

      return await writeContract({
        address: poolAddress,
        abi: lendingPoolAbi,
        functionName: "borrowDebt",
        args: [amountBigInt],
      });
    },
  });
};

export default useBorrow;
