"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

import type { InterestRateChartProps } from "./types";
import { toPercentage, toReserveFactorPercentage, calculateSupplyRate, generateChartData } from "./utils";
import { ChartTooltip } from "./chart-tooltip";
import { ChartLegend } from "./chart-legend";
import { ChartStats } from "./chart-stats";

export const InterestRateChart = ({
  baseRate,
  optimalUtilization,
  rateAtOptimal,
  maxRate,
  currentUtilization,
  currentBorrowRate,
  reserveFactor,
}: InterestRateChartProps) => {
  const baseRatePct = toPercentage(baseRate);
  const optimalUtilizationPct = toPercentage(optimalUtilization);
  const rateAtOptimalPct = toPercentage(rateAtOptimal);
  const maxRatePct = toPercentage(maxRate);
  const currentUtilizationPct = toPercentage(currentUtilization);
  const currentBorrowRatePct = toPercentage(currentBorrowRate);
  const reserveFactorPct = toReserveFactorPercentage(reserveFactor);

  const chartData = useMemo(
    () =>
      generateChartData({
        baseRate: baseRatePct,
        optimalUtilization: optimalUtilizationPct,
        rateAtOptimal: rateAtOptimalPct,
        maxRate: maxRatePct,
        reserveFactor: reserveFactorPct,
      }),
    [
      baseRatePct,
      optimalUtilizationPct,
      rateAtOptimalPct,
      maxRatePct,
      reserveFactorPct,
    ],
  );

  const currentSupplyRate = calculateSupplyRate(
    currentBorrowRatePct,
    currentUtilizationPct,
    reserveFactorPct,
  );

  return (
    <div className="space-y-6 border border-border-primary bg-surface-primary/80 p-6">
      <div>
        <h2 className="text-md font-semibold text-white-custom">
          Interest Rate Model
        </h2>
        <p className="mt-3 text-md font-medium text-text-secondary">
          Utilization Rate
        </p>
        <p className="mt-1 text-md font-bold text-white-custom">
          {currentUtilizationPct.toFixed(2)}%
        </p>
      </div>

      <ChartLegend />

      <div
        className="h-80 w-full outline-none focus:outline-none"
        tabIndex={-1}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 40, right: 30, left: 20, bottom: 5 }}
            style={{ outline: "none" }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="utilization"
              stroke="#52525b"
              tick={{ fill: "#71717a", fontSize: 12 }}
              tickFormatter={(v) => `${Math.round(v)}%`}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              type="number"
            />
            <YAxis
              stroke="#52525b"
              tick={{ fill: "#71717a", fontSize: 12 }}
              tickFormatter={(v) => `${Math.round(v)}%`}
              domain={[0, "auto"]}
            />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="linear"
              dataKey="borrowRate"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
            />
            {currentUtilizationPct > 0 && (
              <ReferenceLine
                x={currentUtilizationPct}
                stroke="#3b82f6"
                strokeDasharray="8 4"
                strokeWidth={2.5}
                label={{
                  value: `Current ${currentUtilizationPct.toFixed(1)}%`,
                  position: "top",
                  fill: "#3b82f6",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              />
            )}
            <ReferenceLine
              x={optimalUtilizationPct}
              stroke="#10b981"
              strokeDasharray="8 4"
              strokeWidth={2.5}
              label={{
                value: `Optimal ${optimalUtilizationPct.toFixed(0)}%`,
                position: "top",
                fill: "#10b981",
                fontSize: 14,
                fontWeight: 600,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ChartStats
        borrowRate={currentBorrowRatePct}
        supplyRate={currentSupplyRate}
        reserveFactor={reserveFactorPct}
      />
    </div>
  );
};
