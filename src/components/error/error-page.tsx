import { ErrorDisplay } from "./error-display";
import { cn } from "@/lib/utils";

interface ErrorPageProps {
  title?: string;
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

export const ErrorPage = ({
  title = "Page Load Error",
  message,
  error,
  onRetry,
  className,
}: ErrorPageProps) => {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] w-full items-center justify-center",
        className,
      )}
    >
      <div className="w-full max-w-md rounded-xl border border-border-primary bg-surface-primary p-6 shadow-sm">
        <ErrorDisplay
          title={title}
          message={message}
          error={error}
          onRetry={onRetry}
        />
      </div>
    </div>
  );
};
