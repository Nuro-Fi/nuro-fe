"use client";

import { PageContainer } from "@/components/layout/page-container";

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-surface-tertiary ${className}`} />
);

export const SwapPageSkeleton = () => {
  return (
    <PageContainer>
      <section className="space-y-6">
        <header className="space-y-2">
          <SkeletonBox className="h-7 w-16" />
          <SkeletonBox className="h-4 w-64" />
        </header>

        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-border-primary bg-surface-primary p-5">
            <div className="mb-5">
              <SkeletonBox className="h-6 w-14" />
            </div>

            <div className="space-y-4">
              {/* Pool selector */}
              <div className="space-y-2">
                <SkeletonBox className="h-3 w-20" />
                <SkeletonBox className="h-12 w-full" />
              </div>

              {/* Token input - You pay */}
              <div className="space-y-2">
                <SkeletonBox className="h-3 w-16" />
                <div className="rounded-lg border border-border-primary bg-surface-secondary p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SkeletonBox className="h-8 w-8 !rounded-full" />
                      <SkeletonBox className="h-5 w-16" />
                    </div>
                    <SkeletonBox className="h-8 w-24" />
                  </div>
                </div>
              </div>

              {/* Swap direction */}
              <div className="flex justify-center py-1">
                <SkeletonBox className="h-10 w-10" />
              </div>

              {/* Token input - You receive */}
              <div className="space-y-2">
                <SkeletonBox className="h-3 w-20" />
                <div className="rounded-lg border border-border-primary bg-surface-secondary p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SkeletonBox className="h-8 w-8 !rounded-full" />
                      <SkeletonBox className="h-5 w-16" />
                    </div>
                    <SkeletonBox className="h-8 w-24" />
                  </div>
                </div>
              </div>

              {/* Action button */}
              <SkeletonBox className="mt-4 h-12 w-full" />
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default SwapPageSkeleton;
