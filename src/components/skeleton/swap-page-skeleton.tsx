"use client";

import { PageContainer } from "@/components/layout/page-container";

const SkeletonBox = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`animate-pulse bg-surface-tertiary ${className}`} style={style} />
);

const TokenPriceChartSkeleton = () => (
  <div className="rounded-none border border-border-primary bg-surface-primary p-5">
    {/* Header with token selectors */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {/* Token pair selector */}
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-8 w-8 rounded-full" />
          <SkeletonBox className="h-5 w-16 rounded-none" />
        </div>
        <SkeletonBox className="h-4 w-4 rounded-none" />
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-8 w-8 rounded-full" />
          <SkeletonBox className="h-5 w-16 rounded-none" />
        </div>
      </div>

      {/* Interval buttons */}
      <div className="flex gap-2">
        <SkeletonBox className="h-8 w-12 rounded-none" />
        <SkeletonBox className="h-8 w-12 rounded-none" />
        <SkeletonBox className="h-8 w-12 rounded-none" />
      </div>
    </div>

    {/* Price display */}
    <div className="mb-4">
      <SkeletonBox className="h-8 w-40 rounded-none" />
      <SkeletonBox className="mt-2 h-4 w-24 rounded-none" />
    </div>

    {/* Chart area */}
    <div className="h-80 w-full border border-border-primary bg-surface-secondary/50">
      <div className="relative h-full w-full p-4">
        {/* Y-axis labels */}
        <div className="absolute left-2 top-4 flex h-[calc(100%-2rem)] flex-col justify-between">
          <SkeletonBox className="h-3 w-12 rounded-none" />
          <SkeletonBox className="h-3 w-10 rounded-none" />
          <SkeletonBox className="h-3 w-12 rounded-none" />
          <SkeletonBox className="h-3 w-10 rounded-none" />
          <SkeletonBox className="h-3 w-12 rounded-none" />
        </div>

        {/* Chart grid and candles skeleton */}
        <div className="ml-16 h-full">
          <div className="relative h-full w-full overflow-hidden">
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-t border-border-primary/50" />
              ))}
            </div>

            {/* Fake candlestick chart */}
            <div className="absolute bottom-4 left-0 right-0 flex items-end justify-around gap-1 px-4">
              {[40, 65, 80, 55, 90, 70, 45, 100, 85, 60, 75, 95, 50, 110, 70, 55, 80, 120, 90, 65, 85, 100, 75, 60].map((height, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center"
                >
                  <SkeletonBox
                    className={`w-2 rounded-none`}
                    style={{ height: `${height}px` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-16 right-4 flex justify-between">
          <SkeletonBox className="h-3 w-10 rounded-none" />
          <SkeletonBox className="h-3 w-10 rounded-none" />
          <SkeletonBox className="h-3 w-10 rounded-none" />
          <SkeletonBox className="h-3 w-10 rounded-none" />
          <SkeletonBox className="h-3 w-10 rounded-none" />
        </div>
      </div>
    </div>
  </div>
);

const SwapCardSkeleton = () => (
  <div className="rounded-none border border-border-primary bg-surface-primary p-5">
    {/* Header */}
    <div className="mb-5">
      <SkeletonBox className="h-6 w-14 rounded-none" />
    </div>

    <div className="space-y-4">
      {/* Pool selector */}
      <div className="space-y-2">
        <SkeletonBox className="h-3 w-20 rounded-none" />
        <SkeletonBox className="h-12 w-full rounded-none" />
      </div>

      {/* Token input - You pay */}
      <div className="space-y-2">
        <SkeletonBox className="h-3 w-16 rounded-none" />
        <div className="border border-border-primary bg-surface-secondary p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SkeletonBox className="h-8 w-8 rounded-full" />
              <SkeletonBox className="h-5 w-16 rounded-none" />
            </div>
            <SkeletonBox className="h-8 w-24 rounded-none" />
          </div>
          <SkeletonBox className="mt-2 h-3 w-28 rounded-none" />
        </div>
      </div>

      {/* Swap direction button */}
      <div className="relative flex justify-center py-1">
        <div className="absolute left-0 right-0 top-1/2 border-t border-border-primary" />
        <SkeletonBox className="relative z-10 h-10 w-10 rounded-none" />
      </div>

      {/* Token input - You receive */}
      <div className="space-y-2">
        <SkeletonBox className="h-3 w-20 rounded-none" />
        <div className="border border-border-primary bg-surface-secondary p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SkeletonBox className="h-8 w-8 rounded-full" />
              <SkeletonBox className="h-5 w-16 rounded-none" />
            </div>
            <SkeletonBox className="h-8 w-24 rounded-none" />
          </div>
        </div>
      </div>

      {/* Swap details */}
      <div className="rounded-none border border-border-primary bg-surface-secondary/50 p-3 space-y-3">
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-3 w-10 rounded-none" />
          <SkeletonBox className="h-3 w-32 rounded-none" />
        </div>
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-3 w-14 rounded-none" />
          <SkeletonBox className="h-3 w-28 rounded-none" />
        </div>
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-3 w-8 rounded-none" />
          <SkeletonBox className="h-3 w-12 rounded-none" />
        </div>
      </div>

      {/* Action button */}
      <SkeletonBox className="mt-4 h-12 w-full rounded-none" />
    </div>
  </div>
);

export const SwapPageSkeleton = () => {
  return (
    <PageContainer>
      <section className="space-y-6">
        {/* Header */}
        <header className="space-y-2">
          <SkeletonBox className="h-7 w-16 rounded-none" />
          <SkeletonBox className="h-4 w-80 rounded-none" />
        </header>

        {/* Main content grid */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
          <TokenPriceChartSkeleton />
          <SwapCardSkeleton />
        </div>
      </section>
    </PageContainer>
  );
};

export default SwapPageSkeleton;
