import type { HexAddress } from "./common";
export interface BaseMutationParams {
  poolAddress: HexAddress;
  decimals: number;
}
export interface SupplyParams extends BaseMutationParams {
  amount: string;
}
export interface BorrowParams extends BaseMutationParams {
  amount: string;
}
export type RepayMode = "from-position" | "select-token";
export interface RepayParams extends BaseMutationParams {
  borrowTokenAddress: HexAddress;
  amount: string;
  tokenInDecimals: number;
}
export interface UseRepayOptions {
  poolAddress?: HexAddress;
  decimals?: number;
  mode?: RepayMode;
}
export interface RepayState {
  status: "idle" | "loading" | "success" | "error";
  txHash: HexAddress | null;
  error: string | null;
}
export interface WithdrawLiquidityParams extends BaseMutationParams {
  shares: bigint;
}
export interface WithdrawCollateralParams extends BaseMutationParams {
  amount: string;
}
export interface ApproveParams {
  tokenAddress: HexAddress;
  spenderAddress: HexAddress;
  amount: string;
  decimals: number;
  bufferPercent?: number;
}
export interface SwapParams {
  poolAddress: HexAddress;
  tokenIn: HexAddress;
  tokenOut: HexAddress;
  amountIn: string;
  tokenInDecimals: number;
}
