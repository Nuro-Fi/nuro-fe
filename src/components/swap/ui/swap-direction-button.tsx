import { ArrowDownUp } from "lucide-react";

interface SwapDirectionButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const SwapDirectionButton = ({
  onClick,
  disabled,
}: SwapDirectionButtonProps) => (
  <div className="relative flex justify-center py-1">
    <div className="absolute left-0 right-0 top-1/2 border-t border-border-primary" />
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative z-10 rounded-lg border border-border-secondary bg-surface-secondary p-2.5 shadow-lg transition-all hover:border-border-hover hover:bg-surface-tertiary hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
    >
      <ArrowDownUp className="h-4 w-4 text-text-tertiary" />
    </button>
  </div>
);
