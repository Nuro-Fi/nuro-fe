export const TABS = ["Supply", "Borrow", "Repay", "Withdraw"] as const;

export type Tab = (typeof TABS)[number];

export type Mode = "liquidity" | "collateral";

export type RepayMode = "position" | "token";

import type { HexAddress } from "@/types/types";

export interface PoolActionCardProps {
  poolAddress: HexAddress;
  collateralTokenAddress: HexAddress;
  borrowTokenAddress: HexAddress;
  collateralSymbol?: string;
  borrowSymbol?: string;
  collateralLogoUrl?: string;
  borrowLogoUrl?: string;
  borrowTokenDecimals?: number;
  collateralTokenDecimals?: number;
  ltv: string;
  liquidationThreshold?: string;
}

export interface ContentProps {
  poolAddress: HexAddress;
  collateralTokenAddress: HexAddress;
  borrowTokenAddress: HexAddress;
  collateralSymbol?: string;
  borrowSymbol?: string;
  collateralLogoUrl?: string;
  borrowLogoUrl?: string;
  borrowTokenDecimals: number;
  collateralTokenDecimals: number;
  ltv: string;
  liquidationThreshold?: string;
}
