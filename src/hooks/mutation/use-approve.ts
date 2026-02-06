"use client";

import { writeContract } from "wagmi/actions";
import { erc20Abi } from "viem";
import { config } from "@/lib/config";
import { APPROVE_CONFIG } from "@/lib/constants/mutation.constants";
import type { ApproveParams } from "@/types/types.d";
import { useContractMutation } from "./core/use-contract-mutation";
import { parseAmountToBigInt, validateAmount } from "./core/validation";

type ApproveType = "default" | "liquidity" | "collateral";

export const useApprove = (type: ApproveType = "default") => {
  const cfg = APPROVE_CONFIG[type];

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
      bufferPercent = 0,
    }) => {
      let amountBigInt = parseAmountToBigInt(amount, decimals);

      if (bufferPercent > 0) {
        const bufferMultiplier = BigInt(100 + bufferPercent);
        amountBigInt = (amountBigInt * bufferMultiplier) / BigInt(100);
      }

      return await writeContract(config, {
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
