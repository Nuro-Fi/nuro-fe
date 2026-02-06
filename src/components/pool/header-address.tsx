import { SUPPORTED_CHAINS } from "@/lib/constants/chains";
import { Loader2, Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";


export const AddressRow = ({
  label,
  address,
  isLoading,
}: {
  label: string;
  address?: string | null;
  isLoading?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-text-muted">{label}:</span>
        <span className="animate-pulse text-text-disabled">
          <Loader2 className="h-3 w-3 animate-spin" />
        </span>
      </div>
    );
  }

  if (!address) return null;

  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-text-muted">{label}:</span>
      <span className="font-mono text-text-primary" title={address}>
        {truncated}
      </span>
      <button
        onClick={handleCopy}
        className="ml-0.5 text-text-disabled hover:text-text-primary transition-colors focus:outline-none"
        title="Copy address"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </button>
      <button
        onClick={() =>
          window.open(
            `${SUPPORTED_CHAINS.ARC.blockExplorer}/address/${address}`,
            "_blank",
          )
        }
        className="ml-0.5 text-text-disabled hover:text-text-primary transition-colors focus:outline-none"
        title="Open in explorer"
      >
        <ExternalLink className="h-3 w-3" />
      </button>
    </div>
  );
};
