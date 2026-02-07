import type { TransactionType } from "@/hooks/graphql/use-history";
import { CHAIN_IDS, getChainName } from "@/lib/constants/chains";

interface ChainDisplayProps {
  type: TransactionType;
  contractChainId: number;
  destChainId?: number;
}

export const ChainDisplay = ({
  type,
  contractChainId,
  destChainId,
}: ChainDisplayProps) => {
  if (type === "crosschain_borrow" && destChainId) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-text-secondary">
          {getChainName(CHAIN_IDS.ARC)}
        </span>
        <span className="text-xs text-status-accent">
          → {getChainName(destChainId)}
        </span>
      </div>
    );
  }

  return (
    <span className="text-sm text-text-secondary">
      {getChainName(contractChainId)}
    </span>
  );
};
