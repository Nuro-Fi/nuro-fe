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
      <p className="text-xs font-medium text-gray-200">
        Utilization: <span className="text-gray-200">{data.utilization.toFixed(2)}%</span>
      </p>
      <p className="text-xs font-medium text-gray-200">
        Borrow APR: <span className="text-gray-200">{data.borrowRate.toFixed(2)}%</span>
      </p>
      <p className="text-xs font-medium text-gray-200">
        Supply APR: <span className="text-gray-200">{data.supplyRate.toFixed(2)}%</span>
      </p>
    </div>
  );
};
