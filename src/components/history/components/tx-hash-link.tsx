import { ExternalLink } from "lucide-react";
import type { TransactionType } from "@/hooks/graphql/use-history";
import { formatAddress } from "../utils/format";
import { getExplorerUrl } from "../utils/explorer";

interface TxHashLinkProps {
  txHash: string;
  type: TransactionType;
}

export const TxHashLink = ({ txHash, type }: TxHashLinkProps) => {
  const explorerUrl = getExplorerUrl(txHash, type);

  return (
    <>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <span>{formatAddress(txHash)}</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
      {type === "crosschain_borrow" && (
        <div className="mt-0.5 text-[10px] text-status-accent">LayerZero</div>
      )}
    </>
  );
};
