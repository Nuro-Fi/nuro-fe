import { useMemo } from "react";
import type {
  SimulatedHealthFactor,
  HealthFactorData,
} from "@/hooks/use-health-factor";

interface HealthFactorCardProps {
  before: HealthFactorData | null;
  after: SimulatedHealthFactor | null;
  isLoading: boolean;
  showAfter?: boolean;
}

type HealthStatus = "safe" | "warning" | "danger" | "unknown";

const getHealthStatus = (healthFactor: number): HealthStatus => {
  if (healthFactor === Infinity) return "safe";
  if (healthFactor >= 1.5) return "safe";
  if (healthFactor >= 1.1) return "warning";
  if (healthFactor >= 1) return "danger";
  return "danger";
};

const getStatusColor = (status: HealthStatus): string => {
  switch (status) {
    case "safe":
      return "text-emerald-400";
    case "warning":
      return "text-yellow-400";
    case "danger":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

const getStatusBg = (status: HealthStatus): string => {
  switch (status) {
    case "safe":
      return "bg-emerald-900/30 border-emerald-700/40";
    case "warning":
      return "bg-yellow-900/30 border-yellow-700/40";
    case "danger":
      return "bg-red-900/30 border-red-700/40";
    default:
      return "bg-gray-900/30 border-gray-700/40";
  }
};

const getStatusLabel = (status: HealthStatus): string => {
  switch (status) {
    case "safe":
      return "Healthy";
    case "warning":
      return "Caution";
    case "danger":
      return "At Risk";
    default:
      return "Unknown";
  }
};

const HealthFactorValue = ({
  value,
  formatted,
  label,
  showStatus = true,
}: {
  value: number;
  formatted: string;
  label: string;
  showStatus?: boolean;
}) => {
  const status = getHealthStatus(value);
  const colorClass = getStatusColor(status);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-lg font-bold ${colorClass}`}>{formatted}</span>
      {showStatus && (
        <span className={`text-xs ${colorClass}`}>
          {getStatusLabel(status)}
        </span>
      )}
    </div>
  );
};

export const HealthFactorCard = ({
  before,
  after,
  isLoading,
  showAfter = true,
}: HealthFactorCardProps) => {
  const beforeStatus = useMemo(() => {
    if (!before) return "unknown" as HealthStatus;
    return getHealthStatus(before.healthFactor);
  }, [before]);

  const afterStatus = useMemo(() => {
    if (!after) return "unknown" as HealthStatus;
    return getHealthStatus(after.healthFactor);
  }, [after]);

  const hasChange = useMemo(() => {
    if (!before || !after) return false;
    return before.healthFactor !== after.healthFactor;
  }, [before, after]);

  const isWorsening = useMemo(() => {
    if (!before || !after) return false;
    if (before.healthFactor === Infinity && after.healthFactor !== Infinity)
      return true;
    if (after.healthFactor === Infinity) return false;
    return after.healthFactor < before.healthFactor;
  }, [before, after]);

  if (isLoading) {
    return null;
  }

  if (!before) {
    return null;
  }

  const cardBg =
    showAfter && after && hasChange
      ? getStatusBg(afterStatus)
      : getStatusBg(beforeStatus);

  return (
    <div className={`p-3 rounded-lg border ${cardBg}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-300">
            Health Factor
          </span>
        </div>
        {before.isLiquidatable && (
          <span className="text-xs px-2 py-0.5 bg-red-900/50 border border-red-700/50 rounded text-red-400">
            Liquidatable
          </span>
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        <HealthFactorValue
          value={before.healthFactor}
          formatted={before.healthFactorFormatted}
          label={showAfter && after && hasChange ? "Before" : "Current"}
          showStatus={!(showAfter && after && hasChange)}
        />

        {showAfter && after && hasChange && (
          <>
            <div className="flex flex-col items-center">
              <svg
                className={`w-5 h-5 ${isWorsening ? "text-red-400" : "text-emerald-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>

            <HealthFactorValue
              value={after.healthFactor}
              formatted={after.healthFactorFormatted}
              label="After"
              showStatus={true}
            />
          </>
        )}
      </div>

      {showAfter && after && hasChange && !after.isHealthy && (
        <div className="mt-2 p-2 rounded bg-red-900/40 border border-red-700/40">
          <p className="text-xs text-red-300 text-center">
            ⚠️ This action will put your position at risk of liquidation
          </p>
        </div>
      )}
    </div>
  );
};

export default HealthFactorCard;
