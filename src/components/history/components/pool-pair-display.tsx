import Image from "next/image";
import { Info } from "lucide-react";
import type { PoolWithTokens } from "@/hooks/graphql/use-pools";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InterestRatePreview } from "@/components/interest-rate-model/interest-rate-preview";
import { formatAddress } from "../utils/format";

interface PoolPairDisplayProps {
  pool: PoolWithTokens | undefined;
  poolAddress: string;
}

export const PoolPairDisplay = ({
  pool,
  poolAddress,
}: PoolPairDisplayProps) => {
  if (!pool) {
    return (
      <span className="text-sm text-text-secondary">
        {formatAddress(poolAddress)}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-8 w-12">
        <div className="absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-border-primary bg-surface-secondary">
          <Image
            src={pool.collateral.logoUrl}
            alt={pool.collateral.symbol}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        </div>
        <div className="absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-border-primary bg-surface-secondary">
          <Image
            src={pool.borrow.logoUrl}
            alt={pool.borrow.symbol}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-text-primary">
          {pool.collateral.symbol} / {pool.borrow.symbol}
        </span>
        <span className="text-xs text-text-muted">
          {formatAddress(poolAddress)}
        </span>
      </div>
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className="ml-1 rounded p-0.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary"
          >
            <Info className="h-4 w-4" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent side="right" align="start" className="w-64">
          <InterestRatePreview
            baseRate={pool.baseRate}
            optimalUtilization={pool.optimalUtilization}
            rateAtOptimal={pool.rateAtOptimal}
            maxRate={pool.maxRate}
          />
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};
