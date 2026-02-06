import { Loader2 } from "lucide-react";

interface StatItemProps {
  label: string;
  value: React.ReactNode;
  isLoading?: boolean;
  valueClassName?: string;
}

const StatItem = ({
  label,
  value,
  isLoading,
  valueClassName = "text-white-custom",
}: StatItemProps) => (
  <div>
    <div className="text-xs text-text-muted">{label}</div>
    <div className={`mt-1 text-base font-semibold ${valueClassName}`}>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
      ) : (
        value
      )}
    </div>
  </div>
);

interface PoolStatsGridProps {
  totalLiquidity: string;
  totalBorrow: string;
  ltv: string;
  supplyApy: string;
  totalSupplyAssets: string;
  liquidationThreshold: string;
  borrowSymbol: string;
  totalSupplyAssetsLoading?: boolean;
}

export const PoolStatsGrid = ({
  totalLiquidity,
  totalBorrow,
  ltv,
  supplyApy,
  totalSupplyAssets,
  liquidationThreshold,
  borrowSymbol,
  totalSupplyAssetsLoading,
}: PoolStatsGridProps) => (
  <div className="grid gap-4 border border-border-primary bg-surface-primary/80 p-4 text-sm text-text-primary sm:grid-cols-2 lg:grid-cols-3">
    <StatItem label="Total Liquidity" value={`$${totalLiquidity}`} />
    <StatItem label="Total Borrowed" value={`$${totalBorrow}`} />
    <StatItem label="LTV" value={ltv} />
    <StatItem
      label="Total Supply Assets"
      value={`${totalSupplyAssets} ${borrowSymbol}`}
      isLoading={totalSupplyAssetsLoading}
      valueClassName="text-white-custom"
    />
    <StatItem
      label="Liquidation Threshold"
      value={liquidationThreshold}
      valueClassName="text-white-custom"
    />
    <StatItem
      label="Supply APY"
      value={`${supplyApy}%`}
      valueClassName="text-white-custom"
    />
  </div>
);
