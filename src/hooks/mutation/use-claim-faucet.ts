"use client";

import { parseUnits } from "viem";
import { mockErc20Abi } from "@/lib/abis/mock-erc20-abi";
import { FAUCET_CONFIG } from "@/lib/constants/faucet.constants";
import type { HexAddress } from "@/types/types.d";
import { useContractMutation } from "./core/use-contract-mutation";
import { validateAmount } from "./core/validation";
import { useCircleWriteContract } from "@/hooks/use-circle-wagmi";

export interface ClaimFaucetParams {
  tokenAddress: HexAddress;
  amount: string;
  decimals: number;
  symbol: string;
}

export const useClaimFaucet = () => {
  const { writeContract } = useCircleWriteContract();

  return useContractMutation<ClaimFaucetParams>({
    toast: {
      toastId: FAUCET_CONFIG.toastId,
      loadingMessage: "Claiming tokens...",
      successMessage: FAUCET_CONFIG.successMessage,
    },
    invalidateType: "faucet",
    validate: (params) => validateAmount(params.amount),
    mutationFn: async ({ tokenAddress, amount, decimals }, userAddress) => {
      const amountBigInt = parseUnits(amount, decimals);

      return await writeContract({
        address: tokenAddress,
        abi: mockErc20Abi,
        functionName: "mint",
        args: [userAddress, amountBigInt],
      });
    },
  });
};

export default useClaimFaucet;
