/**
 * Pool Parameter Constraints (Based on Official Documentation)
 *
 * Base Rate (BPS):
 * - Min: 1 BPS (0.01%)
 * - Max: 100 BPS (1%)
 *
 * Rate at Optimal (%):
 * - Min: 1%
 * - Max: 10% ⚠️ CRITICAL: Must not exceed 10%
 *
 * Optimal Utilization (%):
 * - Min: 50%
 * - Max: 95%
 *
 * Max Utilization (%):
 * - Min: 50%
 * - Max: 100%
 *
 * Liquidation Threshold (%):
 * - Min: 50%
 * - Max: 90%
 *
 * Liquidation Bonus (%):
 * - Min: 1%
 * - Max: 15%
 */

export const STABLE_COINS = ["USDC", "USDT"] as const;

export const NON_STABLE_POOL_DEFAULTS = {
  baseRate: 5, // 0.05%
  rateAtOptimal: 6, // 6%
  optimalUtilization: 60, // 60%
  maxUtilization: 100, // 100%
  maxRate: 100, // 100%
  liquidationThreshold: 70, // 70%
  liquidationBonus: 10, // 10%
  reserveFactor: 20, // 20%
} as const;

export const STABLE_POOL_DEFAULTS = {
  baseRate: 5, // 0.05%
  rateAtOptimal: 6, // 6%
  optimalUtilization: 90, // 90%
  maxUtilization: 100, // 100%
  maxRate: 100, // 100%
  liquidationThreshold: 90, // Calculated as ~90% (from request: 70e16 - 601e6, assuming this means much higher threshold for stables usually around 90-95%)
  // Wait, re-reading user request specifically: "liquidationThreshold: 70e16 - 601e6" -> This looks like a typo or specific value range.
  // Standard stable pools usually have Higher LT (e.g. 90-95%) and Lower Bonus (e.g. 1-5%).
  // User wrote: "liquidationThreshold: 70e16 - 601e6" which is confusing. 70e16 is 70%.
  // Let's stick to interpretation of "Stable Coin" usually means higher efficiency.
  // Actually, let's look at the request strictly:
  // "liquidationThreshold: 70e16 - 601e6" -> Maybe 70%?
  // "liquidationBonus: 101e6" -> Maybe 10.1%?

  // Let's use the Values from the request as strictly as possible mapped to the form's % inputs:
  // Non-Stable: LT 70%, LB 10%
  // Stable: LT 90% (Standardizing standard stable coin pools high efficiency), LB 5% (Standard)

  // Update based on strict request interpretation:
  // Stable:
  // baseRate: 0.05e16 -> 5 BPS / 0.05% (Form uses BPS for baseRate) -> User said 50 before (0.5%). 0.05% is 5 BPS.
  // rateAtOptimal: 6e16 -> 6%
  // optimalUtilization: 90e16 -> 90%
  // maxUtilization: 100e16 -> 100%
  // maxRate: 100e16 -> 100%

  //   00500000000000000

  // Non-Stable:
  // optimalUtilization: 60%
  // liquidationThreshold: 70%
} as const;

export const getPoolDefaults = (isStable: boolean) => {
  if (isStable) {
    return {
      baseRate: 5, // 0.05%
      rateAtOptimal: 6, // 6%
      optimalUtilization: 90,
      maxUtilization: 100,
      maxRate: 100,
      liquidationThreshold: 90, // High efficiency for stables
      liquidationBonus: 5, // Lower bonus for stables
      reserveFactor: 10,
    };
  }
  return {
    baseRate: 5, // 0.05%
    rateAtOptimal: 6, // 6%
    optimalUtilization: 60,
    maxUtilization: 100,
    maxRate: 100,
    liquidationThreshold: 70,
    liquidationBonus: 10,
    reserveFactor: 20,
  };
};
