import { useHealthFactor } from "@/hooks/use-health-factor";
import { getHealthFactorColor } from "../../../ui/stat-row";
import type { StatsSectionProps } from "../types";

interface HealthFactorDisplayProps {
  healthFactorData: ReturnType<typeof useHealthFactor>["data"];
  simulatedHealthFactor: StatsSectionProps["simulatedHealthFactor"];
  isLoading: boolean;
}

export const HealthFactorDisplay = ({
  healthFactorData,
  simulatedHealthFactor,
  isLoading,
}: HealthFactorDisplayProps) => {
  if (isLoading) return <>Loading...</>;
  if (!healthFactorData) return <>—</>;

  const currentColor = getHealthFactorColor(healthFactorData.healthFactor);
  const simulatedColor = simulatedHealthFactor
    ? getHealthFactorColor(simulatedHealthFactor.healthFactor)
    : "";

  const isWorsening =
    simulatedHealthFactor &&
    (healthFactorData.healthFactor === Infinity
      ? simulatedHealthFactor.healthFactor !== Infinity
      : simulatedHealthFactor.healthFactor < healthFactorData.healthFactor);

  return (
    <span className="flex items-center gap-1">
      <span className={currentColor}>
        {healthFactorData.healthFactorFormatted}
      </span>
      {simulatedHealthFactor && (
        <>
          <span className={isWorsening ? "text-red-400" : "text-white-custom"}>
            →
          </span>
          <span className={simulatedColor}>
            {simulatedHealthFactor.healthFactorFormatted}
          </span>
        </>
      )}
    </span>
  );
};
