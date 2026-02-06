import type { ReactNode } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { cn } from "@/lib/utils";

export interface PoolNotFoundProps {
  message?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export const PoolNotFound = ({
  message = "Pool not found.",
  className,
  contentClassName,
}: PoolNotFoundProps) => {
  return (
    <PageContainer className={cn("py-10", className)}>
      <div
        className={cn(
          "mx-auto max-w-6xl text-sm text-white",
          contentClassName,
        )}
        role="alert"
      >
        {message}
      </div>
    </PageContainer>
  );
};
