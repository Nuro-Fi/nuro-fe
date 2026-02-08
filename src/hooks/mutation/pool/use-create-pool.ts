"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { factoryAbi } from "@/lib/abis/factory-abi";
import { erc20Abi, parseUnits } from "viem";
import { getContractAddress } from "@/lib/addresses/contracts";
import { Network, type Address } from "@/lib/addresses/types";
import { toast } from "sonner";
import { useCircleWriteContract } from "@/hooks/use-circle-wagmi";

import type { StepState, HexAddress, CreatePoolParams } from "./pool.types";
import {
  INITIAL_STEPS,
  TOAST_IDS,
  QUERY_REFETCH_DELAY,
} from "./pool.constants";
import {
  createSteps,
  isUserRejectedError,
  dismissAllToasts,
  buildPoolParams,
  validateLtv,
  validateSupply,
} from "./pool.utils";

export const useCreatePool = () => {
  const queryClient = useQueryClient();
  const [steps, setSteps] = useState<StepState[]>(INITIAL_STEPS);
  const [txHash, setTxHash] = useState<HexAddress | null>(null);
  const [approveTxHash, setApproveTxHash] = useState<HexAddress | null>(null);
  const { writeContract } = useCircleWriteContract();

  const mutation = useMutation({
    mutationFn: async (params: CreatePoolParams) => {
      const {
        collateralTokenAddress,
        borrowTokenAddress,
        borrowTokenDecimals,
        ltvValue,
        supplyBalance,
        isAdvancedMode = false,
        ...advancedParams
      } = params;

      try {
        setSteps(INITIAL_STEPS);

        if (
          !collateralTokenAddress ||
          !borrowTokenAddress ||
          !ltvValue ||
          !supplyBalance
        ) {
          throw new Error("Invalid parameters");
        }

        const factoryAddress = getContractAddress(Network.ARC, "FACTORY");
        if (!factoryAddress) {
          throw new Error(
            "Factory address is not configured for current network",
          );
        }

        const ltv = validateLtv(ltvValue);
        if (!ltv.isValid) {
          throw new Error("Invalid LTV value. Must be between 0 and 100");
        }

        const supply = validateSupply(supplyBalance);
        if (!supply.isValid) {
          throw new Error("Invalid supply balance. Must be greater than 0");
        }

        const supplyBigInt = parseUnits(supplyBalance, borrowTokenDecimals);
        const poolParams = buildPoolParams({
          isAdvancedMode,
          ...advancedParams,
        });

        if (ltv.bigInt >= poolParams.liquidationThreshold) {
          throw new Error(
            `LTV (${ltv.value}%) must be less than liquidation threshold (${
              Number(poolParams.liquidationThreshold) / 1e16
            }%)`,
          );
        }

        setSteps(createSteps("loading", "idle"));
        toast.loading("Approving token...", { id: TOAST_IDS.approvePool });

        // Add 20% buffer to approval amount
        const approveAmount = (supplyBigInt * BigInt(120)) / BigInt(100);

        // Execute approve transaction via Circle SDK
        await writeContract({
          address: borrowTokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [factoryAddress as Address, approveAmount],
        });

        toast.dismiss(TOAST_IDS.approvePool);
        setSteps(createSteps("success", "loading"));
        toast.loading("Creating pool...", { id: TOAST_IDS.createPool });

        // Execute create pool transaction via Circle SDK
        await writeContract({
          address: factoryAddress as HexAddress,
          abi: factoryAbi,
          functionName: "createLendingPool",
          args: [
            {
              collateralToken: collateralTokenAddress,
              borrowToken: borrowTokenAddress,
              ltv: ltv.bigInt,
              supplyLiquidity: supplyBigInt,
              ...poolParams,
            },
          ],
        });

        toast.dismiss(TOAST_IDS.createPool);
        toast.success("Pool Created Successfully!", {
          description: "Your lending pool has been created",
        });

        setSteps(createSteps("success", "success"));

        return { success: true };
      } catch (e) {
        const error = e as Error;
        dismissAllToasts();

        if (isUserRejectedError(error)) {
          setSteps(INITIAL_STEPS);
        } else {
          setSteps((prev) =>
            prev.map((step) =>
              step.status === "loading"
                ? { ...step, status: "error", error: error.message }
                : step,
            ),
          );
          toast.error("Pool Creation Failed", { description: error.message });
        }

        throw e;
      } finally {
        // Always invalidate queries after delay, regardless of success or failure
        await new Promise((resolve) =>
          setTimeout(resolve, QUERY_REFETCH_DELAY),
        );
        await queryClient.invalidateQueries({ queryKey: ["pools"] });
      }
    },
  });

  const reset = () => {
    setSteps(INITIAL_STEPS);
    setTxHash(null);
    setApproveTxHash(null);
    mutation.reset();
  };

  return {
    steps,
    mutation,
    txHash,
    approveTxHash,
    reset,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
