import { useMemo } from "react";
import { Loader2, ArrowDown } from "lucide-react";
import Image from "next/image";

interface ConversionCardProps {
  outputAmount: string;
  outputSymbol: string;
  outputLogoUrl?: string;
  isLoading: boolean;
}

export const ConversionCard = ({
  outputAmount,
  outputSymbol,
  outputLogoUrl,
  isLoading,
}: ConversionCardProps) => {
  const formattedOutputAmount = useMemo(() => {
    if (!outputAmount || outputAmount === "0") return "0.00";
    const parsed = parseFloat(outputAmount);
    if (isNaN(parsed)) return "0.00";
    return parsed.toFixed(6);
  }, [outputAmount]);

  return (
    <div className="relative border border-border-primary bg-surface-secondary/50 mt-4">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="rounded-full border border-border-secondary bg-surface-secondary p-1.5">
          <ArrowDown className="h-3 w-3 text-text-secondary" />
        </div>
      </div>

      <div className="flex items-center justify-between px-3 pt-4 pb-2">
        <span className="text-xs text-text-muted">Converts to</span>
        {isLoading && (
          <Loader2 className="h-3 w-3 animate-spin text-text-muted" />
        )}
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {outputLogoUrl && (
              <Image
                src={outputLogoUrl}
                alt={outputSymbol}
                className="h-6 w-6 rounded-full object-cover"
                width={20}
                height={20}
              />
            )}
            <span className="text-lg font-semibold text-text-primary">
              {isLoading ? (
                <span className="text-text-muted">Calculating...</span>
              ) : (
                formattedOutputAmount
              )}
            </span>
            <span className="text-sm text-text-secondary">{outputSymbol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
