"use client";

import Image from "next/image";
import { Info } from "lucide-react";
import { formatUnits } from "viem";
import { formatCompactNumber, formatLtvFromRaw } from "@/lib/format/pool";
import {
  type PoolRate,
  formatInterestRate,
} from "@/hooks/graphql/use-pool-rates";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InterestRatePreview } from "@/components/interest-rate-model/interest-rate-preview";

interface PoolData {
  lendingPool: string;
  collateral: {
    symbol: string;
    logoUrl: string;
    decimals: number;
  };
  borrow: {
    symbol: string;
    logoUrl: string;
    decimals: number;
  };
  ltv: string;
}

interface PoolsTableRowProps {
  pool: PoolData;
  rate?: PoolRate;
  onClick: () => void;
}

export const PoolsTableRow = ({ pool, rate, onClick }: PoolsTableRowProps) => {
  const borrowDecimals = pool.borrow.decimals;

  const totalLiquidity = rate?.totalLiquidity
    ? parseFloat(formatUnits(BigInt(rate.totalLiquidity), borrowDecimals))
    : 0;

  const totalBorrow = rate?.totalBorrowAssets
    ? parseFloat(formatUnits(BigInt(rate.totalBorrowAssets), borrowDecimals))
    : 0;

  const apy = rate?.apy ? formatInterestRate(rate.apy) : 0;

  const borrowApy = rate?.borrowRate ? formatInterestRate(rate.borrowRate) : 0;
  return (
    <tr className="pool-row cursor-pointer" onClick={onClick}>
      <td className="px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-16">
            <div className="token-icon-wrapper absolute left-0 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border-2 border-[#3b82f6] bg-neutral-900-custom overflow-hidden">
              <Image
                src={pool.collateral.logoUrl}
                alt={pool.collateral.symbol}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div className="token-icon-wrapper absolute right-0 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border-2 border-[#3b82f6] bg-neutral-900-custom overflow-hidden">
              <Image
                src={pool.borrow.logoUrl}
                alt={pool.borrow.symbol}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">
              {pool.collateral.symbol} / {pool.borrow.symbol}
            </span>
            <span className="text-[11px] text-gray-500 font-mono">
              {pool.lendingPool.slice(0, 6)}...{pool.lendingPool.slice(-4)}
            </span>
          </div>

          {rate && (
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  <Info className="h-4 w-4" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent
                side="right"
                align="start"
                className="w-[320px] max-w-[98vw] p-0 overflow-hidden"
              >
                <div className="p-4">
                  <InterestRatePreview
                    baseRate={rate.lendingPoolBaseRate}
                    optimalUtilization={rate.lendingPoolOptimalUtilization}
                    rateAtOptimal={rate.lendingPoolRateAtOptimal}
                    maxRate={rate.lendingPoolMaxRate}
                  />
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      </td>

      <td className="px-4 py-4 text-right text-gray-900 font-semibold">
        ${formatCompactNumber(totalLiquidity)}
      </td>

      <td className="px-4 py-4 text-right">
        <span className="text-gray-900 font-bold">{apy.toFixed(2)}%</span>
      </td>

      <td className="px-4 py-4 text-right text-gray-900 font-semibold">
        ${formatCompactNumber(totalBorrow)}
      </td>

      <td className="px-4 py-4 text-right">
        <span className="text-gray-900 font-bold">
          {borrowApy.toFixed(2)}%
        </span>
      </td>

      <td className="px-4 py-4 text-right text-gray-900 font-semibold">
        {formatLtvFromRaw(pool.ltv)}
      </td>
    </tr>
  );
};
