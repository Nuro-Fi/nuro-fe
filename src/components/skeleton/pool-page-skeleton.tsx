"use client";

import { PageContainer } from "@/components/layout/page-container";
import { PoolActionCardSkeleton } from "./pool-action-card-skeleton";

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-surface-tertiary ${className}`} />
);

const PoolHeaderSkeleton = () => (
  <header className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-5">
      {/* Token pair icons */}
      <div className="relative h-14 w-20 shrink-0">
        <div className="absolute left-0 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full border-4 border-surface-primary bg-surface-secondary z-0">
          <SkeletonBox className="h-full w-full rounded-full" />
        </div>
        <div className="absolute right-0 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full border-4 border-surface-primary bg-surface-secondary z-10">
          <SkeletonBox className="h-full w-full rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Pool name */}
        <SkeletonBox className="h-8 w-48 rounded mb-1" />

        {/* Details section */}
        <div className="space-y-1.5">
          {/* Pool address */}
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-4 w-24 rounded opacity-50" />
            <SkeletonBox className="h-4 w-32 rounded" />
            <div className="flex gap-2 ml-1 opacity-50">
              <SkeletonBox className="h-4 w-4 rounded" />
              <SkeletonBox className="h-4 w-4 rounded" />
            </div>
          </div>

          {/* Router */}
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-4 w-16 rounded opacity-50" />
            <SkeletonBox className="h-4 w-32 rounded" />
            <div className="flex gap-2 ml-1 opacity-50">
              <SkeletonBox className="h-4 w-4 rounded" />
              <SkeletonBox className="h-4 w-4 rounded" />
            </div>
          </div>

          {/* Position */}
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-4 w-16 rounded opacity-50" />
            <SkeletonBox className="h-4 w-32 rounded" />
            <div className="flex gap-2 ml-1 opacity-50">
              <SkeletonBox className="h-4 w-4 rounded" />
              <SkeletonBox className="h-4 w-4 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const StatItemSkeleton = ({ valueWidth = "w-20" }: { valueWidth?: string }) => (
  <div>
    <SkeletonBox className="h-3 w-24 rounded-lg" />
    <SkeletonBox className={`mt-2 h-5 ${valueWidth} rounded-lg`} />
  </div>
);

const PoolStatsGridSkeleton = () => (
  <div className="grid gap-4 border border-border-primary bg-surface-primary/80 p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
    <StatItemSkeleton valueWidth="w-24" />
    <StatItemSkeleton valueWidth="w-20" />
    <StatItemSkeleton valueWidth="w-14" />
    <StatItemSkeleton valueWidth="w-28" />
    <StatItemSkeleton valueWidth="w-14" />
    <StatItemSkeleton valueWidth="w-16" />
  </div>
);

const InterestRateChartSkeleton = () => (
  <div className="space-y-6 border border-border-primary bg-surface-primary/80 p-6">
    {/* Title & Utilization */}
    <div>
      <SkeletonBox className="h-5 w-40 rounded " />
      <div className="mt-3">
        <SkeletonBox className="mb-1 h-4 w-24 rounded " />
        <SkeletonBox className="h-7 w-20 rounded " />
      </div>
    </div>

    {/* Legend */}
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <SkeletonBox className="h-3 w-3 rounded-full" />
        <SkeletonBox className="h-3 w-32 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <SkeletonBox className="h-3 w-3 rounded-full" />
        <SkeletonBox className="h-3 w-32 rounded" />
      </div>
    </div>

    {/* Chart area */}
    <div className="relative h-80 w-full">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-2">
        {[...Array(6)].map((_, i) => (
          <SkeletonBox key={i} className="h-3 w-8 rounded-lg" />
        ))}
      </div>

      {/* Chart Content */}
      <div className="ml-10 flex h-full flex-col">
        {/* Main Chart Area */}
        <div className="relative flex-1 border-b border-l border-border-primary">
          {/* Horizontal Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-px w-full bg-border-primary/30" />
            ))}
          </div>

          {/* Vertical Reference Lines (Simulated - Optional for skeleton but adds structure) */}
          <div className="absolute inset-0 h-full w-full">
            <div className="absolute left-[80%] bottom-0 top-0 w-px border-l border-dashed border-border-primary/50" />
            <div className="absolute left-[45%] bottom-0 top-0 w-px border-l border-dashed border-border-primary/50" />
          </div>

          {/* Fake Curve */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 95 L 80 90 L 100 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-surface-tertiary animate-pulse"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between pt-3">
          {[0, 25, 50, 75, 100].map((val) => (
            <SkeletonBox key={val} className="h-3 w-8 rounded-lg" />
          ))}
        </div>
      </div>
    </div>

    {/* Bottom stats */}
    <div className="grid grid-cols-3 gap-6 border-t border-border-primary pt-6">
      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <SkeletonBox className="h-3 w-28 rounded" />
          <SkeletonBox className="mt-2 h-6 w-16 rounded" />
        </div>
      ))}
    </div>
  </div>
);

export const PoolPageSkeleton = () => {
  return (
    <PageContainer>
      <div className="flex flex-col gap-8 lg:flex-row">
        <section className="flex-1 space-y-8">
          <PoolHeaderSkeleton />
          <PoolStatsGridSkeleton />
          <InterestRateChartSkeleton />
        </section>

        <aside className="w-full shrink-0 lg:w-104">
          <div className="sticky top-24">
            <PoolActionCardSkeleton />
          </div>
        </aside>
      </div>
    </PageContainer>
  );
};

export default PoolPageSkeleton;
