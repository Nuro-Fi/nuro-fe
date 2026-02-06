"use client";

import { forwardRef } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionButtonVariant =
  | "create"
  | "supply"
  | "withdraw"
  | "borrow"
  | "repay"
  | "swap";

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionButtonVariant;
  isLoading?: boolean;
  isSuccess?: boolean;
  loadingText?: string;
  successText?: string;
  fullWidth?: boolean;
}

const variantStyles: Record<ActionButtonVariant, string> = {
  create:
    "border-[var(--btn-create-border)] bg-[var(--btn-create)] hover:bg-[var(--btn-create-hover)]",
  supply:
    "border-[var(--btn-supply-border)] bg-[var(--btn-supply)] hover:bg-[var(--btn-supply-hover)]",
  withdraw:
    "border-[var(--btn-withdraw-border)] bg-[var(--btn-withdraw)] hover:bg-[var(--btn-withdraw-hover)]",
  borrow:
    "border-[var(--btn-borrow-border)] bg-[var(--btn-borrow)] hover:bg-[var(--btn-borrow-hover)]",
  repay:
    "border-[var(--btn-repay-border)] bg-[var(--btn-repay)] hover:bg-[var(--btn-repay-hover)]",
  swap: "border-[var(--btn-create-border)] bg-[var(--btn-create)] hover:bg-[var(--btn-create-hover)]",
};

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      variant = "create",
      isLoading = false,
      isSuccess = false,
      loadingText = "Processing",
      successText = "Success!",
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const renderContent = () => {
      if (isLoading) {
        return (
          <>
            {loadingText}
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </>
        );
      }

      if (isSuccess) {
        return (
          <>
            {successText}
            <CheckCircle2 className="ml-2 h-4 w-4" />
          </>
        );
      }

      return children;
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading || isSuccess}
        className={cn(
          "inline-flex items-center justify-center rounded-none border px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white-custom transition-all",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variantStyles[variant],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {renderContent()}
      </button>
    );
  },
);

ActionButton.displayName = "ActionButton";
