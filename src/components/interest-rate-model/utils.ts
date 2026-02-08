import { formatUnits } from "viem";
import type { ChartDataPoint, RateParams } from "./types";

const DEFAULT_RESERVE_FACTOR_PCT = 10;

export const toPercentage = (value: string): number => {
  return parseFloat(formatUnits(BigInt(value), 16));
};

export const toReserveFactorPercentage = (value: string): number => {
  const pct = parseFloat(formatUnits(BigInt(value), 16));
  return pct === 0 ? DEFAULT_RESERVE_FACTOR_PCT : pct;
};

export const calculateBorrowRate = (
  utilization: number,
  baseRate: number,
  optimalUtilization: number,
  rateAtOptimal: number,
  maxRate: number
): number => {
  if (optimalUtilization <= 0) return baseRate;

  if (utilization <= optimalUtilization) {
    return baseRate + ((rateAtOptimal - baseRate) * utilization) / optimalUtilization;
  }

  const excessUtilization = utilization - optimalUtilization;
  const maxExcess = 100 - optimalUtilization;

  if (maxExcess <= 0) return maxRate;

  return rateAtOptimal + ((maxRate - rateAtOptimal) * excessUtilization) / maxExcess;
};

export const calculateSupplyRate = (
  borrowRate: number,
  utilization: number,
  reserveFactor: number
): number => {
  const safeReserveFactor = reserveFactor === 0 ? DEFAULT_RESERVE_FACTOR_PCT : reserveFactor;
  return borrowRate * (utilization / 100) * (1 - safeReserveFactor / 100);
};

export const generateChartData = (params: RateParams): ChartDataPoint[] => {
  const { baseRate, optimalUtilization, rateAtOptimal, maxRate, reserveFactor } = params;
  const safeReserveFactor = reserveFactor === 0 ? DEFAULT_RESERVE_FACTOR_PCT : reserveFactor;
  const data: ChartDataPoint[] = [];

  for (let i = 0; i <= 100; i++) {
    const borrowRate = calculateBorrowRate(i, baseRate, optimalUtilization, rateAtOptimal, maxRate);
    const supplyRate = calculateSupplyRate(borrowRate, i, safeReserveFactor);
    data.push({ utilization: i, borrowRate, supplyRate });
  }

  return data;
};
