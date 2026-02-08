"use client";

import { useMemo } from "react";
import { formatUnits } from "viem";

interface InterestRatePreviewProps {
  baseRate: string;
  optimalUtilization: string;
  rateAtOptimal: string;
  maxRate: string;
}

const toPercentage = (value: string): number => {
  return parseFloat(formatUnits(BigInt(value), 16));
};

interface StatRowProps {
  label: string;
  value: string;
  color?: string;
}

const StatRow = ({
  label,
  value,
  color = "text-text-primary",
}: StatRowProps) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-xs text-text-secondary">{label}</span>
    <span className={`text-xs font-medium ${color}`}>{value}</span>
  </div>
);

export const InterestRatePreview = ({
  baseRate,
  optimalUtilization,
  rateAtOptimal,
  maxRate,
}: InterestRatePreviewProps) => {
  const stats = useMemo(() => {
    const baseRatePct = toPercentage(baseRate);
    const optimalUtilPct = toPercentage(optimalUtilization);
    const rateAtOptimalPct = toPercentage(rateAtOptimal);
    const maxRatePct = toPercentage(maxRate);

    return {
      baseRate: baseRatePct.toFixed(2),
      optimalUtilization: optimalUtilPct.toFixed(0),
      rateAtOptimal: rateAtOptimalPct.toFixed(2),
      maxRate: maxRatePct.toFixed(2),
    };
  }, [baseRate, optimalUtilization, rateAtOptimal, maxRate]);

  return (
    <div className="space-y-2 ">
      <div className="space-y-0.5">
        <StatRow
          label="Base Rate"
          value={`${stats.baseRate}%`}
          color="text-emerald-400"
        />
        <StatRow
          label="Optimal Utilization"
          value={`${stats.optimalUtilization}%`}
          color="text-cyan-400"
        />
        <StatRow
          label="Rate at Optimal"
          value={`${stats.rateAtOptimal}%`}
          color="text-amber-400"
        />
        <StatRow
          label="Max Rate"
          value={`${stats.maxRate}%`}
          color="text-pink-400"
        />
      </div>
    </div>
  );
};
