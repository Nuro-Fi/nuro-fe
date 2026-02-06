import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SpinnerProps extends React.ComponentProps<"svg"> {
  size?: "sm" | "md" | "lg";
}

function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "size-3",
    md: "size-4",
    lg: "size-6",
  };

  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(sizeClasses[size], "animate-spin", className)}
      {...props}
    />
  );
}

interface LoadingStateProps {
  balance?: boolean;
  transaction?: boolean;
  data?: boolean;
  children?: React.ReactNode;
  className?: string;
  spinnerSize?: "sm" | "md" | "lg";
}

function LoadingState({
  balance,
  transaction,
  data,
  children,
  className,
  spinnerSize = "sm",
}: LoadingStateProps) {
  if (balance) {
    return (
      <div
        className={cn("navbar__balance navbar__balance--loading", className)}
      >
        <span className="navbar__balance-label">Balance</span>
        <Spinner size={spinnerSize} className="navbar__balance-spinner" />
      </div>
    );
  }

  if (transaction) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Spinner size={spinnerSize} />
        <span>{children || "Processing transaction..."}</span>
      </div>
    );
  }

  if (data) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <Spinner size={spinnerSize} />
        {children && <span className="ml-2">{children}</span>}
      </div>
    );
  }

  return <Spinner size={spinnerSize} className={className} />;
}

export { Spinner, LoadingState };
