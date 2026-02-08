"use client";

import { erc20Abi } from "viem";
import { APPROVE_CONFIG } from "@/lib/constants/mutation.constants";
import type { ApproveParams } from "@/types/types.d";
import { useContractMutation } from "./core/use-contract-mutation";
import { parseAmountToBigInt, validateAmount } from "./core/validation";
import { useCircleWriteContract } from "@/hooks/use-circle-wagmi";

type ApproveType = "default" | "liquidity" | "collateral";

export const useApprove = (type: ApproveType = "default") => {
  const cfg = APPROVE_CONFIG[type];
  const { writeContract } = useCircleWriteContract();

  return useContractMutation<ApproveParams>({
    toast: {
      toastId: cfg.toastId,
      loadingMessage: "Approving token...",
      successMessage: cfg.successMessage,
    },
    validate: (params) => validateAmount(params.amount),
    mutationFn: async ({
      tokenAddress,
      spenderAddress,
      amount,
      decimals,
      bufferPercent = 20,
    }) => {
      let amountBigInt = parseAmountToBigInt(amount, decimals);

      if (bufferPercent > 0) {
        const bufferMultiplier = BigInt(100 + bufferPercent);
        amountBigInt = (amountBigInt * bufferMultiplier) / BigInt(100);
      }

      return await writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [spenderAddress, amountBigInt],
      });
    },
  });
};

export const useApproveLiquidity = () => useApprove("liquidity");
export const useApproveCollateral = () => useApprove("collateral");

export default useApprove;
