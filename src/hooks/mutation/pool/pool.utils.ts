import { toast } from "sonner";
import type { Status, StepState, PoolContractParams } from "./pool.types";
import { DEFAULT_POOL_PARAMS, TOAST_IDS } from "./pool.constants";

export const createSteps = (
  step1Status: Status,
  step2Status: Status,
): StepState[] => [
  { step: 1, status: step1Status, label: "Approve Token" },
  { step: 2, status: step2Status, label: "Create Pool" },
];

export const isUserRejectedError = (error: Error): boolean => {
  const message = error.message.toLowerCase();
  return message.includes("rejected") || message.includes("denied");
};

export const percentToBigInt = (
  value: number | undefined,
  defaultValue: bigint,
  multiplier = 1e16,
): bigint => {
  return value !== undefined
    ? BigInt(Math.floor(value * multiplier))
    : defaultValue;
};

export const dismissAllToasts = () => {
  Object.values(TOAST_IDS).forEach((id) => toast.dismiss(id));
};

interface BuildPoolParamsInput {
  isAdvancedMode: boolean;
  baseRate?: number;
  rateAtOptimal?: number;
  optimalUtilization?: number;
  maxUtilization?: number;
  liquidationThreshold?: number;
  liquidationBonus?: number;
  maxRate?: number;
}

export const buildPoolParams = ({
  isAdvancedMode,
  baseRate,
  rateAtOptimal,
  optimalUtilization,
  maxUtilization,
  liquidationThreshold,
  liquidationBonus,
  maxRate,
}: BuildPoolParamsInput): PoolContractParams => {
  if (!isAdvancedMode) {
    // In basic mode, use default params BUT keep the auto-calculated liquidationThreshold
    return {
      ...DEFAULT_POOL_PARAMS,
      liquidationThreshold: percentToBigInt(
        liquidationThreshold,
        DEFAULT_POOL_PARAMS.liquidationThreshold,
      ),
    };
  }

  return {
    baseRate: percentToBigInt(baseRate, DEFAULT_POOL_PARAMS.baseRate, 1e14),
    rateAtOptimal: percentToBigInt(
      rateAtOptimal,
      DEFAULT_POOL_PARAMS.rateAtOptimal,
    ),
    optimalUtilization: percentToBigInt(
      optimalUtilization,
      DEFAULT_POOL_PARAMS.optimalUtilization,
    ),
    maxUtilization: percentToBigInt(
      maxUtilization,
      DEFAULT_POOL_PARAMS.maxUtilization,
    ),
    liquidationThreshold: percentToBigInt(
      liquidationThreshold,
      DEFAULT_POOL_PARAMS.liquidationThreshold,
    ),
    liquidationBonus: percentToBigInt(
      liquidationBonus,
      DEFAULT_POOL_PARAMS.liquidationBonus,
    ),
    maxRate: percentToBigInt(maxRate, DEFAULT_POOL_PARAMS.maxRate),
  };
};

export const validateLtv = (
  ltvValue: string,
): { isValid: boolean; value: number; bigInt: bigint } => {
  const ltvFloat = parseFloat(ltvValue);
  const isValid = !isNaN(ltvFloat) && ltvFloat >= 0 && ltvFloat <= 100;
  return {
    isValid,
    value: ltvFloat,
    bigInt: isValid ? BigInt(Math.floor(ltvFloat * 1e16)) : BigInt(0),
  };
};

export const validateSupply = (
  supplyBalance: string,
): { isValid: boolean; value: number } => {
  const supplyFloat = parseFloat(supplyBalance);
  return {
    isValid: !isNaN(supplyFloat) && supplyFloat > 0,
    value: supplyFloat,
  };
};
