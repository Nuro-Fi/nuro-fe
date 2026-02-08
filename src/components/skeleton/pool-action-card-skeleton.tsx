import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PoolActionCardSkeleton = () => {
  return (
    <Card className="flex h-full w-104 flex-col rounded-2xl border-border-primary bg-surface-primary gap-0 p-4">
      {/* Tabs Skeleton */}
      <CardHeader className="mb-3 flex flex-row gap-0 p-0">
        <div className="flex w-full border border-border-primary bg-surface-secondary">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex-1 h-10 flex items-center justify-center ${
                i !== 1 ? "border-l border-border-primary" : ""
              }`}
            >
              <Skeleton className="h-4 w-12 bg-surface-tertiary/50" />
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 p-0">
        {/* Mode Toggle Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 bg-surface-secondary/50" />
          <Skeleton className="h-9 w-32 bg-surface-secondary/50" />
        </div>

        {/* Amount Section Skeleton */}
        <div className="pool-card-section space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 bg-surface-tertiary/50" />
            <Skeleton className="h-6 w-6 rounded-full bg-surface-tertiary/50" />
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <Skeleton className="h-10 w-32 bg-surface-tertiary/50" />
            <Skeleton className="h-9 w-16 bg-surface-tertiary/50" />
          </div>

          <Skeleton className="h-3 w-32 bg-surface-tertiary/50" />
        </div>

        {/* Stats Section Skeleton */}
        <div className="pool-card-section mt-auto space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-3 w-20 bg-surface-tertiary/50" />
              <Skeleton className="h-3 w-16 bg-surface-tertiary/50" />
            </div>
          ))}
        </div>

        {/* Action Button Skeleton */}
        <Skeleton className="h-12 w-full bg-surface-tertiary/50" />
      </CardContent>
    </Card>
  );
};
