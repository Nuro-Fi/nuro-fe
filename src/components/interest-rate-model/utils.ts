import { formatUnits } from "viem";
import type { ChartDataPoint, RateParams } from "./types";

export const toPercentage = (value: string): number => {
  return parseFloat(formatUnits(BigInt(value), 16));
};

export const calculateBorrowRate = (
  utilization: number,
  baseRate: number,
  optimalUtilization: number,
  rateAtOptimal: number,
  maxRate: number
): number => {
  if (utilization <= optimalUtilization) {
    return baseRate + ((rateAtOptimal - baseRate) * utilization) / optimalUtilization;
  }
  return (
    rateAtOptimal +
    ((maxRate - rateAtOptimal) * (utilization - optimalUtilization)) /
      (100 - optimalUtilization)
  );
};

export const calculateSupplyRate = (
  borrowRate: number,
  utilization: number,
  reserveFactor: number
): number => {
  return borrowRate * (utilization / 100) * (1 - reserveFactor / 100);
};

export const generateChartData = (params: RateParams): ChartDataPoint[] => {
  const { baseRate, optimalUtilization, rateAtOptimal, maxRate, reserveFactor } = params;
  const data: ChartDataPoint[] = [];

  for (let i = 0; i <= 100; i++) {
    const borrowRate = calculateBorrowRate(i, baseRate, optimalUtilization, rateAtOptimal, maxRate);
    const supplyRate = calculateSupplyRate(borrowRate, i, reserveFactor);
    data.push({ utilization: i, borrowRate, supplyRate });
  }

  return data;
};
