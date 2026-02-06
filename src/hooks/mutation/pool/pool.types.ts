export type Status = "idle" | "loading" | "success" | "error";
export type HexAddress = `0x${string}`;

export interface StepState {
  step: number;
  status: Status;
  error?: string;
  label: string;
}

export interface CreatePoolParams {
  collateralTokenAddress: HexAddress;
  borrowTokenAddress: HexAddress;
  borrowTokenDecimals: number;
  ltvValue: string;
  supplyBalance: string;
  isAdvancedMode?: boolean;
  baseRate?: number;
  rateAtOptimal?: number;
  optimalUtilization?: number;
  maxUtilization?: number;
  liquidationThreshold?: number;
  liquidationBonus?: number;
  maxRate?: number;
}

export interface PoolContractParams {
  baseRate: bigint;
  rateAtOptimal: bigint;
  optimalUtilization: bigint;
  maxUtilization: bigint;
  liquidationThreshold: bigint;
  liquidationBonus: bigint;
  maxRate: bigint;
}
