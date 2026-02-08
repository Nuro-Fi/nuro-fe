"use client";

import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { SUPPLY_CONFIG } from "@/lib/constants/mutation.constants";
import type { SupplyParams } from "@/types/types.d";
import { useContractMutation } from "./core/use-contract-mutation";
import { parseAmountToBigInt, validateAmount } from "./core/validation";
import { useCircleWriteContract } from "@/hooks/use-circle-wagmi";

export type SupplyType = "liquidity" | "collateral";

interface UseSupplyOptions {
  type: SupplyType;
}

export const useSupply = ({ type }: UseSupplyOptions) => {
  const cfg = SUPPLY_CONFIG[type];
  const { writeContract } = useCircleWriteContract();

  return useContractMutation<SupplyParams>({
    toast: {
      toastId: cfg.toastId,
      loadingMessage: "Processing...",
      successMessage: cfg.successMessage,
    },
    invalidateType: "supply",
    validate: (params) => validateAmount(params.amount),
    mutationFn: async ({ poolAddress, amount, decimals }, userAddress) => {
      const amountBigInt = parseAmountToBigInt(amount, decimals);

      return await writeContract({
        address: poolAddress,
        abi: lendingPoolAbi,
        functionName: cfg.functionName,
        args: [userAddress, amountBigInt],
      });
    },
  });
};

export const useSupplyLiquidity = () => useSupply({ type: "liquidity" });
export const useSupplyCollateral = () => useSupply({ type: "collateral" });

export default useSupply;
