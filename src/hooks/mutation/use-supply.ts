"use client";

import { writeContract } from "wagmi/actions";
import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { config } from "@/lib/config";
import { SUPPLY_CONFIG } from "@/lib/constants/mutation.constants";
import type { SupplyParams } from "@/types/types.d";
import { useContractMutation } from "./core/use-contract-mutation";
import { parseAmountToBigInt, validateAmount } from "./core/validation";

export type SupplyType = "liquidity" | "collateral";

interface UseSupplyOptions {
  type: SupplyType;
}

export const useSupply = ({ type }: UseSupplyOptions) => {
  const cfg = SUPPLY_CONFIG[type];

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

      return await writeContract(config, {
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
