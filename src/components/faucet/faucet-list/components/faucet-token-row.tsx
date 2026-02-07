"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useClaimFaucet } from "@/hooks/mutation/use-claim-faucet";
import { useFaucetBalance } from "@/hooks/faucet/use-faucet-balance";
import { useFaucetCooldown } from "@/hooks/faucet/use-faucet-cooldown";
import { FAUCET_AMOUNTS } from "@/lib/constants/faucet.constants";
import { invalidateKeys } from "@/lib/constants/query-keys";
import { getBlockExplorerUrl } from "@/lib/utils/block-explorer";
import type { HexAddress } from "@/types/types.d";
import { ActionButton } from "@/components/ui/action-button";
import { LoadingState } from "@/components/ui/spinner";
import type { FaucetTokenRowProps } from "../types";
import { formatBalance } from "../utils";
import { useFaucetCooldownTimer } from "../use-faucet-cooldown-timer";

export const FaucetTokenRow = ({ token, userAddress }: FaucetTokenRowProps) => {
  const queryClient = useQueryClient();
  const { balance, isLoading: isLoadingBalance } = useFaucetBalance({
    tokenAddress: token.address as HexAddress,
    userAddress,
    decimals: token.decimals,
  });

  const { setLastClaim } = useFaucetCooldown();
  const { isOnCooldown, cooldownRemaining, formatCooldown } =
    useFaucetCooldownTimer(token.address);

  const claimFaucet = useClaimFaucet();
  const faucetAmount = FAUCET_AMOUNTS[token.symbol] || "100";

  const handleClaim = () => {
    if (isOnCooldown || claimFaucet.isLoading) return;

    claimFaucet.mutation.mutate(
      {
        tokenAddress: token.address as HexAddress,
        amount: faucetAmount,
        decimals: token.decimals,
        symbol: token.symbol,
      },
      {
        onSuccess: () => {
          setLastClaim(token.address);
          invalidateKeys(queryClient, "faucet");
        },
      },
    );
  };

  return (
    <tr className="bg-surface-primary/40 transition-colors hover:bg-surface-secondary/70">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-surface-tertiary">
            <Image
              src={token.logo}
              alt={token.symbol}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-text-primary">{token.symbol}</p>
            <p className="text-xs text-text-secondary">{token.name}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-right">
        <p className="font-medium text-text-primary">
          {isLoadingBalance ? <LoadingState /> : formatBalance(balance)}
        </p>
      </td>

      <td className="px-4 py-3 text-right">
        <p className="font-medium text-accent-primary">
          +{faucetAmount} {token.symbol}
        </p>
      </td>

      <td className="px-4 py-3 text-right">
        <div className="flex justify-end">
          {claimFaucet.isSuccess && claimFaucet.txHash ? (
            <Link
              href={getBlockExplorerUrl(claimFaucet.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-status-success/10 px-3 py-1.5 text-sm font-medium text-status-success transition-colors hover:bg-status-success/20"
            >
              Claimed
              <ExternalLink className="h-3 w-3" />
            </Link>
          ) : isOnCooldown ? (
            <ActionButton variant="withdraw" disabled>
              {formatCooldown(cooldownRemaining)}
            </ActionButton>
          ) : (
            <ActionButton
              variant="supply"
              onClick={handleClaim}
              isLoading={claimFaucet.isLoading}
              loadingText="Claiming"
            >
              Claim
            </ActionButton>
          )}
        </div>
      </td>
    </tr>
  );
};
