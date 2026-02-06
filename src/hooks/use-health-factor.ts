"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { helperAbi } from "@/lib/abis/helper-abi";
import { getContractAddress, Network } from "@/lib/addresses";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import type { HexAddress } from "@/types";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import { arcTestnet } from "viem/chains";

const HELPER_ADDRESS = getContractAddress(
  Network.ARC,
  "HELPER",
) as HexAddress;
const HEALTH_FACTOR_DECIMALS = 18;

const pow10 = (decimals: number): bigint => {
  if (!Number.isInteger(decimals) || decimals < 0) return BigInt(1);
  return BigInt(`1${"0".repeat(decimals)}`);
};

const HEALTH_FACTOR_SCALE = pow10(HEALTH_FACTOR_DECIMALS);

export const healthFactorKeys = QUERY_KEYS.healthFactor;

export interface HealthFactorData {
  isLiquidatable: boolean;
  borrowValue: bigint;
  collateralValue: bigint;
  healthFactor: number;
  healthFactorFormatted: string;
}

export interface UseHealthFactorResult {
  data: HealthFactorData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const parseHealthFactorData = (
  rawData: readonly [boolean, bigint, bigint, bigint],
): HealthFactorData => {
  const [isLiquidatable, borrowValue, collateralValue] = rawData;

  let healthFactor = 0;
  let healthFactorFormatted = "∞";

  if (borrowValue > BigInt(0)) {
    const healthFactorBigInt =
      (collateralValue * HEALTH_FACTOR_SCALE) / borrowValue;
    healthFactor = parseFloat(
      formatUnits(healthFactorBigInt, HEALTH_FACTOR_DECIMALS),
    );
    healthFactorFormatted = healthFactor.toFixed(2);
  } else if (collateralValue > BigInt(0)) {
    healthFactor = Infinity;
    healthFactorFormatted = "∞";
  }

  return {
    isLiquidatable,
    borrowValue,
    collateralValue,
    healthFactor,
    healthFactorFormatted,
  };
};

export const useHealthFactor = (
  userAddress: HexAddress | undefined,
  lendingPoolAddress: HexAddress | undefined,
): UseHealthFactorResult => {
  const isEnabled = Boolean(
    userAddress &&
    userAddress !== zeroAddress &&
    lendingPoolAddress &&
    lendingPoolAddress !== zeroAddress,
  );

  const safeUserAddress = userAddress || zeroAddress;
  const safePoolAddress = lendingPoolAddress || zeroAddress;

  const {
    data: rawData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: healthFactorKeys.user(safeUserAddress, safePoolAddress),
    queryFn: async () => {
      const result = await readContract(config, {
        abi: helperAbi,
        address: HELPER_ADDRESS,
        functionName: "isLiquidatable",
        args: [safeUserAddress, safePoolAddress],
        chainId: arcTestnet.id,
      });
      return result;
    },
    enabled: isEnabled,
    staleTime: 10000,
    gcTime: 30000,
    retry: 2,
    retryDelay: 400,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 15000,
  });

  const data = rawData ? parseHealthFactorData(rawData) : null;

  return {
    data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};

export interface SimulateHealthFactorParams {
  currentBorrowValue: bigint;
  currentCollateralValue: bigint;
  deltaAmount: string;
  tokenDecimals: number;
  action: "borrow" | "repay" | "supply-collateral" | "withdraw-collateral";
  referenceBalance?: string;
  ltv?: number;
  liquidationThreshold?: number;
  maxBorrowAmount?: bigint;
}

export interface SimulatedHealthFactor {
  healthFactor: number;
  healthFactorFormatted: string;
  newBorrowValue: bigint;
  newCollateralValue: bigint;
  isHealthy: boolean;
}

const calculateDeltaValue = (
  deltaAmount: string,
  tokenDecimals: number,
  referenceBalance: string | undefined,
  referenceValue: bigint,
  // Params for borrow estimation when no existing borrow
  ltv?: number,
  liquidationThreshold?: number,
  maxBorrowAmount?: bigint,
  currentCollateralValue?: bigint,
): bigint => {
  if (!deltaAmount || parseFloat(deltaAmount) <= 0) return BigInt(0);

  try {
    const amountBN = parseUnits(deltaAmount, tokenDecimals);

    // Improved estimation for borrowing using Max Borrow capability
    // We prioritize this for 'borrow' action or when LTV/LT parameters are provided.
    // Price = Remaining Capacity (Base) / Max Borrow Amount (Token)
    if (
      ltv &&
      maxBorrowAmount &&
      maxBorrowAmount > BigInt(0) &&
      currentCollateralValue &&
      currentCollateralValue > BigInt(0)
    ) {
      const ltvVal = BigInt(Math.round(ltv || 0));
      const ltVal = BigInt(Math.round(liquidationThreshold || 0));

      // Calculate Total Capacity in Base Units derived from Collateral Value (which is CollateralRaw * LT)
      // Capacity = CollateralRaw * LTV = (CollateralValue / LT) * LTV
      let borrowCapacity = currentCollateralValue;
      if (ltVal > BigInt(0)) {
        borrowCapacity = (currentCollateralValue * ltvVal) / ltVal;
      }

      // Remaining Capacity = Capacity - Current Debt
      const currentDebt = referenceValue; // For borrow, this is currentBorrowValue
      const remainingCapacity =
        borrowCapacity > currentDebt ? borrowCapacity - currentDebt : BigInt(0);

      // Delta = Amount * (Remaining / Max)
      return (amountBN * remainingCapacity) / maxBorrowAmount;
    }

    if (referenceBalance && parseFloat(referenceBalance) > 0) {
      const balanceBN = parseUnits(referenceBalance, tokenDecimals);
      return (amountBN * referenceValue) / balanceBN;
    }

    const parsedAmount = parseUnits(deltaAmount, tokenDecimals);
    return (parsedAmount * pow10(18)) / pow10(tokenDecimals);
  } catch {
    return BigInt(0);
  }
};

const applyDeltaToValues = (
  currentBorrowValue: bigint,
  currentCollateralValue: bigint,
  deltaValue: bigint,
  action: SimulateHealthFactorParams["action"],
): { borrowValue: bigint; collateralValue: bigint } => {
  switch (action) {
    case "borrow":
      return {
        borrowValue: currentBorrowValue + deltaValue,
        collateralValue: currentCollateralValue,
      };
    case "repay":
      return {
        borrowValue:
          currentBorrowValue > deltaValue
            ? currentBorrowValue - deltaValue
            : BigInt(0),
        collateralValue: currentCollateralValue,
      };
    case "supply-collateral":
      return {
        borrowValue: currentBorrowValue,
        collateralValue: currentCollateralValue + deltaValue,
      };
    case "withdraw-collateral":
      return {
        borrowValue: currentBorrowValue,
        collateralValue:
          currentCollateralValue > deltaValue
            ? currentCollateralValue - deltaValue
            : BigInt(0),
      };
  }
};

const calculateHealthFactorFromValues = (
  borrowValue: bigint,
  collateralValue: bigint,
): {
  healthFactor: number;
  healthFactorFormatted: string;
  isHealthy: boolean;
} => {
  if (borrowValue > BigInt(0)) {
    const healthFactorBigInt =
      (collateralValue * HEALTH_FACTOR_SCALE) / borrowValue;
    const healthFactor = parseFloat(
      formatUnits(healthFactorBigInt, HEALTH_FACTOR_DECIMALS),
    );
    return {
      healthFactor,
      healthFactorFormatted: healthFactor.toFixed(2),
      isHealthy: healthFactor >= 1,
    };
  }

  if (collateralValue > BigInt(0)) {
    return {
      healthFactor: Infinity,
      healthFactorFormatted: "∞",
      isHealthy: true,
    };
  }

  return {
    healthFactor: 0,
    healthFactorFormatted: "0",
    isHealthy: false,
  };
};

export const calculateSimulatedHealthFactor = (
  params: SimulateHealthFactorParams,
): SimulatedHealthFactor => {
  const {
    currentBorrowValue,
    currentCollateralValue,
    deltaAmount,
    tokenDecimals,
    action,
    referenceBalance,
    ltv,
    liquidationThreshold,
    maxBorrowAmount,
  } = params;

  // Borrow preview can be derived directly from remaining max borrow amount.
  // If maxBorrowAmount represents the remaining borrow capacity, then:
  // - borrowing exactly maxBorrowAmount => health factor ~ 1
  // - borrowing less => health factor > 1
  // This avoids unit/price mismatches in the generic value-based simulation.
  if (
    action === "borrow" &&
    maxBorrowAmount &&
    maxBorrowAmount > BigInt(0) &&
    currentBorrowValue === BigInt(0) &&
    deltaAmount &&
    parseFloat(deltaAmount) > 0
  ) {
    try {
      const amountBN = parseUnits(deltaAmount, tokenDecimals);
      if (amountBN > BigInt(0)) {
        const hfBigInt = (maxBorrowAmount * HEALTH_FACTOR_SCALE) / amountBN;
        const hf = parseFloat(formatUnits(hfBigInt, HEALTH_FACTOR_DECIMALS));

        return {
          healthFactor: hf,
          healthFactorFormatted: Number.isFinite(hf) ? hf.toFixed(2) : "∞",
          newBorrowValue: currentBorrowValue,
          newCollateralValue: currentCollateralValue,
          isHealthy: hf >= 1,
        };
      }
    } catch {
      // fall through to the generic simulation
    }
  }

  const isCollateralAction =
    action === "supply-collateral" || action === "withdraw-collateral";
  const referenceValue = isCollateralAction
    ? currentCollateralValue
    : currentBorrowValue;

  const deltaValue = calculateDeltaValue(
    deltaAmount,
    tokenDecimals,
    referenceBalance,
    referenceValue,
    ltv,
    liquidationThreshold,
    maxBorrowAmount,
    currentCollateralValue,
  );

  const { borrowValue: newBorrowValue, collateralValue: newCollateralValue } =
    applyDeltaToValues(
      currentBorrowValue,
      currentCollateralValue,
      deltaValue,
      action,
    );

  const { healthFactor, healthFactorFormatted, isHealthy } =
    calculateHealthFactorFromValues(newBorrowValue, newCollateralValue);

  return {
    healthFactor,
    healthFactorFormatted,
    newBorrowValue,
    newCollateralValue,
    isHealthy,
  };
};

export const useSimulatedHealthFactor = (
  userAddress: HexAddress | undefined,
  lendingPoolAddress: HexAddress | undefined,
  deltaAmount: string,
  tokenDecimals: number,
  action: "borrow" | "repay" | "supply-collateral" | "withdraw-collateral",
  referenceBalance?: string,
  ltv?: number,
  liquidationThreshold?: number,
  maxBorrowAmount?: bigint,
): {
  before: HealthFactorData | null;
  after: SimulatedHealthFactor | null;
  isLoading: boolean;
  error: Error | null;
} => {
  const {
    data: currentData,
    isLoading,
    error,
  } = useHealthFactor(userAddress, lendingPoolAddress);

  const after =
    currentData && deltaAmount && parseFloat(deltaAmount) > 0
      ? calculateSimulatedHealthFactor({
          currentBorrowValue: currentData.borrowValue,
          currentCollateralValue: currentData.collateralValue,
          deltaAmount,
          tokenDecimals,
          action,
          referenceBalance,
          ltv,
          liquidationThreshold,
          maxBorrowAmount,
        })
      : null;

  return {
    before: currentData,
    after,
    isLoading,
    error,
  };
};
