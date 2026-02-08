"use client";

import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { SWAP_CONFIG } from "@/lib/constants/mutation.constants";
import type { HexAddress, SwapParams } from "@/types/types.d";
import { useContractMutation } from "./core/use-contract-mutation";
import { parseAmountToBigInt, validateAmount } from "./core/validation";
import { useCircleWriteContract } from "@/hooks/use-circle-wagmi";

const AMOUNT_OUT_MINIMUM = BigInt(0);
const SWAP_FEE = 1000;

export const useSwapToken = () => {
  const { writeContract } = useCircleWriteContract();

  return useContractMutation<SwapParams>({
    toast: {
      toastId: SWAP_CONFIG.toastId,
      loadingMessage: "Processing swap...",
      successMessage: SWAP_CONFIG.successMessage,
    },
    invalidateType: "swap",
    validate: (params) => validateAmount(params.amountIn),
    mutationFn: async ({
      poolAddress,
      tokenIn,
      tokenOut,
      amountIn,
      tokenInDecimals,
    }) => {
      const amountInBigInt = parseAmountToBigInt(amountIn, tokenInDecimals);

      const swapParams = {
        tokenIn: tokenIn as HexAddress,
        tokenOut: tokenOut as HexAddress,
        amountIn: amountInBigInt,
        amountOutMinimum: AMOUNT_OUT_MINIMUM,
        fee: SWAP_FEE,
      };

      return await writeContract({
        address: poolAddress,
        abi: lendingPoolAbi,
        functionName: "swapTokenByPosition",
        args: [swapParams],
      });
    },
  });
};

export default useSwapToken;
