import { AlertCircle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  error?: Error | null;
  className?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: LucideIcon;
}

export const ErrorDisplay = ({
  title = "Something went wrong",
  message,
  error,
  className,
  onRetry,
  retryLabel = "Try Again",
  icon: Icon = AlertCircle,
}: ErrorDisplayProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
        <Icon className="h-6 w-6 text-red-400" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-text-primary">{title}</h3>
      <p className="max-w-md text-sm text-text-muted">
        {message || error?.message || "An unexpected error occurred."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-6">
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
