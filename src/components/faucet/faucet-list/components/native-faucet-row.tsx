"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getBalance } from "wagmi/actions";
import { formatUnits } from "viem";
import { config } from "@/lib/config";
import { arcTestnet } from "viem/chains";
import { ActionButton } from "@/components/ui/action-button";
import { LoadingState } from "@/components/ui/spinner";
import { formatBalance } from "../utils";
import type { HexAddress } from "@/types/types.d";

const CIRCLE_FAUCET_URL = "https://faucet.circle.com";

interface NativeFaucetRowProps {
  userAddress: HexAddress;
}

export const NativeFaucetRow = ({ userAddress }: NativeFaucetRowProps) => {
  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["native-balance", userAddress],
    queryFn: async () => {
      const result = await getBalance(config, {
        address: userAddress,
        chainId: arcTestnet.id,
      });
      return formatUnits(result.value, result.decimals);
    },
    enabled: !!userAddress,
    staleTime: 10_000,
    refetchOnWindowFocus: true,
  });

  return (
    <tr className="bg-surface-primary/40 transition-colors hover:bg-surface-secondary/70">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-surface-tertiary">
            <Image
              src="/token/usdc.png"
              alt="USDC"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-text-primary">USDC</p>
            <p className="text-xs text-text-secondary">Native Token</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-right">
        <p className="font-medium text-text-primary">
          {isLoadingBalance ? <LoadingState /> : formatBalance(balance ?? "0")}
        </p>
      </td>

      <td className="px-4 py-3 text-right">
        <p className="font-medium text-accent-primary">Circle Faucet</p>
      </td>

      <td className="px-4 py-3 text-right">
        <div className="flex justify-end">
          <a
            href={CIRCLE_FAUCET_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ActionButton variant="supply">
              Claim
              <ExternalLink className="ml-1 h-3 w-3" />
            </ActionButton>
          </a>
        </div>
      </td>
    </tr>
  );
};
