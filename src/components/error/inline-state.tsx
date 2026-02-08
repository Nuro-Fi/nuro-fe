import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type InlineStateVariant = "error" | "empty" | "info";

type InlineStateSize = "xs" | "sm";

type InlineStatePadding = "none" | "md" | "lg";

export interface InlineStateProps {
  title?: ReactNode;
  message?: ReactNode;
  variant?: InlineStateVariant;
  size?: InlineStateSize;
  padding?: InlineStatePadding;
  className?: string;
}

const VARIANT_CLASS: Record<InlineStateVariant, string> = {
  error: "text-red-400",
  empty: "text-text-muted",
  info: "text-text-muted",
};

const SIZE_CLASS: Record<InlineStateSize, string> = {
  xs: "text-[11px]",
  sm: "text-sm",
};

const PADDING_CLASS: Record<InlineStatePadding, string> = {
  none: "",
  md: "p-8",
  lg: "py-10",
};

export const InlineState = ({
  title,
  message,
  variant = "info",
  size = "sm",
  padding = "md",
  className,
}: InlineStateProps) => {
  return (
    <div
      className={cn(
        "text-center",
        PADDING_CLASS[padding],
        SIZE_CLASS[size],
        VARIANT_CLASS[variant],
        className,
      )}
    >
      {title ? (
        <div className="mb-1 font-medium text-white">{title}</div>
      ) : null}
      {message}
    </div>
  );
};
