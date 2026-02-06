import { StatRow } from "../../../ui/stat-row";

interface SupplyStatsProps {
  supplyApy: number;
  ltv: string;
  userBalanceLabel: string | null;
  userBalanceLoading: boolean;
  userBalance: string | null;
  tokenSymbol?: string;
  showHealthFactor: boolean;
  renderHealthFactor: () => React.ReactElement;
}

export const SupplyStats = ({
  supplyApy,
  ltv,
  userBalanceLabel,
  userBalanceLoading,
  userBalance,
  tokenSymbol,
  showHealthFactor,
  renderHealthFactor,
}: SupplyStatsProps) => {
  return (
    <>
      <StatRow
        label="Supply APY"
        value={`${supplyApy.toFixed(2)}%`}
        valueColor="text-white-custom"
      />
      <StatRow label="LTV" value={ltv} />
      {userBalanceLabel && (
        <StatRow
          label={userBalanceLabel}
          value={
            userBalanceLoading
              ? "Loading..."
              : `${userBalance} ${tokenSymbol || ""}`
          }
        />
      )}
      {showHealthFactor && renderHealthFactor()}
    </>
  );
};
