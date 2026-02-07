"use client";

import { useParams } from "next/navigation";
import { getChainBySlug } from "@/lib/constants/chains";

export const PageHeader = () => {
  const params = useParams();
  const chainSlug = params.chain as string;
  const chainConfig = getChainBySlug(chainSlug);
  const networkName = chainConfig?.name || "Network";

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-text-heading">
        Transaction History
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        View your lending pool transactions on {networkName}
      </p>
    </div>
  );
};
