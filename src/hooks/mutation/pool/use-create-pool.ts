"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { factoryAbi } from "@/lib/abis/factory-abi";
import { erc20Abi, parseUnits } from "viem";
import { config } from "@/lib/config";
import { getContractAddress } from "@/lib/addresses/contracts";
import { Network, type Address } from "@/lib/addresses/types";
import { toast } from "sonner";
import { getBlockExplorerUrl } from "@/lib/utils/block-explorer";

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

        const approveHash = await writeContract(config, {
          address: borrowTokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [factoryAddress as Address, supplyBigInt],
        });
        setApproveTxHash(approveHash);

        toast.dismiss(TOAST_IDS.approvePool);
        toast.loading("Waiting for approval confirmation...", {
          id: TOAST_IDS.confirmingApprove,
        });

        await waitForTransactionReceipt(config, {
          hash: approveHash,
          confirmations: 1,
          pollingInterval: 2000,
          timeout: 180_000, 
          retryCount: 5,
          retryDelay: 2000,
        });

        toast.dismiss(TOAST_IDS.confirmingApprove);
        setSteps(createSteps("success", "loading"));
        toast.loading("Creating pool...", { id: TOAST_IDS.createPool });

        const hash = await writeContract(config, {
          address: factoryAddress as Address,
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
        setTxHash(hash);

        toast.dismiss(TOAST_IDS.createPool);
        toast.loading("Waiting for confirmation...", {
          id: TOAST_IDS.confirmingPool,
        });

        const result = await waitForTransactionReceipt(config, {
          hash,
          confirmations: 1,
          pollingInterval: 2000,
          timeout: 180_000, 
          retryCount: 5,
          retryDelay: 2000,
        });

        toast.dismiss(TOAST_IDS.confirmingPool);
        toast.success("Pool Created Successfully!", {
          description: "Your lending pool has been created",
          action: {
            label: "View Transaction",
            onClick: () => window.open(getBlockExplorerUrl(hash), "_blank"),
          },
        });

        setSteps(createSteps("success", "success"));
        await new Promise((resolve) =>
          setTimeout(resolve, QUERY_REFETCH_DELAY),
        );
        await queryClient.invalidateQueries({ queryKey: ["pools"] });

        return result;
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
