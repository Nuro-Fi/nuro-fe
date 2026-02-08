"use client";

import { useRequirePosition } from "@/hooks/position/use-require-position";
import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

interface NoPositionMessageProps {
  message?: string;
  className?: string;
}

export const NoPositionMessage = ({
  message = "You need to supply collateral first to create a position.",
  className = "",
}: NoPositionMessageProps) => (
  <div
    className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-border-primary bg-surface-secondary p-6 text-center ${className}`}
  >
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-text-heading">
        No Position Found
      </h3>
      <p className="text-xs text-text-muted">{message}</p>
    </div>
  </div>
);

interface PositionLoadingProps {
  className?: string;
}

export const PositionLoading = ({ className = "" }: PositionLoadingProps) => (
  <div
    className={`flex items-center justify-center gap-2 rounded-lg border border-border-primary bg-surface-secondary p-6 ${className}`}
  >
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
    <span className="text-sm text-text-muted">Checking position...</span>
  </div>
);

interface PositionErrorProps {
  className?: string;
}

export const PositionError = ({ className = "" }: PositionErrorProps) => (
  <div
    className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center ${className}`}
  >
    <AlertCircle className="h-6 w-6 text-red-400" />
    <p className="text-xs text-red-300">Failed to check position status</p>
  </div>
);

interface RequirePositionProps {
  poolAddress: string | undefined | null;
  children: ReactNode;
  noPositionMessage?: string;
  loadingComponent?: ReactNode;
  noPositionComponent?: ReactNode;
  errorComponent?: ReactNode;
  className?: string;
}

export const RequirePosition = ({
  poolAddress,
  children,
  noPositionMessage,
  loadingComponent,
  noPositionComponent,
  errorComponent,
  className,
}: RequirePositionProps) => {
  const { hasPosition, isLoading, isError } = useRequirePosition(poolAddress);

  if (isLoading) {
    return loadingComponent ?? <PositionLoading className={className} />;
  }

  if (isError) {
    return errorComponent ?? <PositionError className={className} />;
  }

  if (!hasPosition) {
    return (
      noPositionComponent ?? (
        <NoPositionMessage message={noPositionMessage} className={className} />
      )
    );
  }

  return <>{children}</>;
};

export default RequirePosition;
