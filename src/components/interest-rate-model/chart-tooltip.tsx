import type { ChartDataPoint } from "./types";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint }>;
}

export const ChartTooltip = ({ active, payload }: TooltipProps) => {
  const firstPayload = payload?.[0];
  if (!active || !firstPayload) return null;

  const data = firstPayload.payload;

  return (
    <div className="rounded-lg border border-border-secondary bg-surface-secondary p-3 shadow-lg">
      <p className="text-xs font-medium text-text-secondary">
        Utilization: <span className="text-text-tertiary">{data.utilization.toFixed(2)}%</span>
      </p>
      <p className="text-xs font-medium text-pink-400">
        Borrow APR: <span className="text-pink-300">{data.borrowRate.toFixed(2)}%</span>
      </p>
      <p className="text-xs font-medium text-emerald-400">
        Supply APR: <span className="text-emerald-300">{data.supplyRate.toFixed(2)}%</span>
      </p>
    </div>
  );
};
