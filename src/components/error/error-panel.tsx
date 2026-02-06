import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ErrorPanelVariant = "error" | "warning" | "info" | "neutral";

const VARIANT_STYLES: Record<
  ErrorPanelVariant,
  {
    container: string;
    title: string;
    message: string;
    details: string;
  }
> = {
  error: {
    container: "border-red-800/60 bg-red-950/40 text-red-200",
    title: "text-red-100",
    message: "text-red-200/90",
    details: "text-red-200/80",
  },
  warning: {
    container: "border-yellow-800/60 bg-yellow-950/40 text-yellow-200",
    title: "text-yellow-100",
    message: "text-yellow-200/90",
    details: "text-yellow-200/80",
  },
  info: {
    container: "border-blue-800/60 bg-blue-950/40 text-blue-200",
    title: "text-blue-100",
    message: "text-blue-200/90",
    details: "text-blue-200/80",
  },
  neutral: {
    container: "border-border-primary bg-surface-primary/50 text-text-secondary",
    title: "text-text-primary",
    message: "text-text-secondary",
    details: "text-text-muted",
  },
};

interface ErrorPanelProps {
  title?: ReactNode;
  message?: ReactNode;
  error?: Error | null;
  variant?: ErrorPanelVariant;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  showErrorDetailsInDev?: boolean;
}

export const ErrorPanel = ({
  title = "Something went wrong",
  message = "Please try again.",
  error,
  variant = "error",
  onRetry,
  retryLabel = "Try Again",
  className,
  showErrorDetailsInDev = true,
}: ErrorPanelProps) => {
  const showDetails =
    showErrorDetailsInDev &&
    process.env.NODE_ENV === "development" &&
    !!error?.message;

  const styles = VARIANT_STYLES[variant];

  return (
    <section
      className={cn(
        "space-y-3 rounded-none border p-6 text-sm",
        styles.container,
        className,
      )}
      role="alert"
    >
      <div className="space-y-1">
        <div className={cn("font-medium", styles.title)}>{title}</div>
        <div className={cn(styles.message)}>{message}</div>
      </div>

      {showDetails ? (
        <pre
          className={cn(
            "max-w-full overflow-x-auto whitespace-pre-wrap wrap-break-word text-[11px]",
            styles.details,
          )}
        >
          {error!.message}
        </pre>
      ) : null}

      {onRetry ? (
        <div>
          <Button onClick={onRetry} variant="outline" className="h-8 px-3">
            {retryLabel}
          </Button>
        </div>
      ) : null}
    </section>
  );
};
