"use client";

import Image from "next/image";
import Link from "next/link";
import useUserBalance from "@/hooks/use-balance";
import { ActionButton } from "@/components/ui/action-button";
import { formatBigIntBalance } from "../utils";

export const NativeTokenRow = () => {
  const { balance, decimals, symbol, isPending } = useUserBalance();

  return (
    <tr className="bg-surface-primary/40 transition-colors hover:bg-surface-secondary/70">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-surface-tertiary">
            <Image
              src="/chain/arc.png"
              alt="ARC"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-text-primary">{symbol || "ARC"}</p>
            <p className="text-xs text-text-secondary">Native Token</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <p className="font-medium text-text-primary">
          {isPending ? (
            <span className="text-text-muted">...</span>
          ) : (
            formatBigIntBalance(balance, decimals)
          )}
        </p>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-text-muted">-</span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end">
          <Link
            href="https://www.arc.io/faucet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ActionButton variant="supply">Claim</ActionButton>
          </Link>
        </div>
      </td>
    </tr>
  );
};
