import { TokenSelect } from "@/components/pool/token-select";
import type { TokenConfig } from "@/lib/addresses/types";

interface TokenPairSelectorProps {
  baseToken: TokenConfig | null;
  quoteToken: TokenConfig | null;
  onChangeBaseToken: (token: TokenConfig) => void;
  onChangeQuoteToken: (token: TokenConfig) => void;
}

export const TokenPairSelector = ({
  baseToken,
  quoteToken,
  onChangeBaseToken,
  onChangeQuoteToken,
}: TokenPairSelectorProps) => {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="min-w-[220px] flex-1">
        <TokenSelect
          label="Base token"
          selected={baseToken}
          onSelect={onChangeBaseToken}
          excludeAddress={quoteToken?.address}
        />
      </div>
      <div className="min-w-[220px] flex-1">
        <TokenSelect
          label="Quote token"
          selected={quoteToken}
          onSelect={onChangeQuoteToken}
          excludeAddress={baseToken?.address}
        />
      </div>
    </div>
  );
};
