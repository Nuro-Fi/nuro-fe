import type { StepState, PoolContractParams } from "./pool.types";

// Notes on units:
// - baseRate: BPS (1 = 0.01%), encoded as value * 1e14
// - other percentage params: %, encoded as value * 1e16
//
// Parameter Constraints (from documentation):
// - baseRate: 1-100 BPS (0.01%-1%)
// - rateAtOptimal: 1-10%
// - optimalUtilization: 50-95%
// - maxUtilization: 50-100%
// - liquidationThreshold: 50-90%
// - liquidationBonus: 1-15%
// - maxRate: 15-100% (MUST be >= 15%)
export const DEFAULT_POOL_PARAMS: PoolContractParams = {
  // 5 BPS = 0.05%
  baseRate: BigInt(5e14),

  // Default: 5% at optimal utilization (kept within the UI validation range 1–10%)
  rateAtOptimal: BigInt(5e16),

  // Default: 80% optimal utilization
  optimalUtilization: BigInt(8e17),

  // Default: 90% max utilization
  maxUtilization: BigInt(9e17),

  // Default: 75% liquidation threshold
  liquidationThreshold: BigInt(75e16),

  // Default: 5% liquidation bonus
  liquidationBonus: BigInt(5e16),

  // Default: 100% max rate (MUST be >= 15% per documentation)
  maxRate: BigInt(1e18),
};

export const INITIAL_STEPS: StepState[] = [
  { step: 1, status: "idle", label: "Approve Token" },
  { step: 2, status: "idle", label: "Create Pool" },
];

export const TOAST_IDS = {
  approvePool: "approve-pool",
  confirmingApprove: "confirming-approve",
  createPool: "create-pool",
  confirmingPool: "confirming-pool",
} as const;

export const QUERY_REFETCH_DELAY = 2000;
export const TX_POLLING_INTERVAL = 1000;
