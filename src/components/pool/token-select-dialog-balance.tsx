"use client";

import { Loader2 } from "lucide-react";
import type { TokenConfig } from "@/lib/addresses/types";
import { useUserWalletBalance } from "@/hooks/balance/use-user-token-balance";
import { useCollateralBalanceUser } from "@/hooks/balance/use-collateral-balance-user";

const BalanceCellFrame = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="shrink-0 text-right">
      <div className="text-[10px] uppercase tracking-wide text-text-muted">
        {label}
      </div>
      <div className="text-sm font-semibold text-text-primary">{children}</div>
    </div>
  );
};

export const WalletBalanceCell = ({
  token,
  enabled,
}: {
  token: TokenConfig;
  enabled: boolean;
}) => {
  const { userWalletBalanceFormatted, walletBalanceLoading } =
    useUserWalletBalance(
      token.address as `0x${string}`,
      token.decimals,
      enabled,
    );

  return (
    <BalanceCellFrame label="Balance">
      {walletBalanceLoading ? (
        <div className="flex items-center justify-end">
          <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
        </div>
      ) : (
        userWalletBalanceFormatted
      )}
    </BalanceCellFrame>
  );
};

export const CollateralBalanceCell = ({
  token,
  enabled,
  poolAddress,
}: {
  token: TokenConfig;
  enabled: boolean;
  poolAddress: `0x${string}`;
}) => {
  const { userCollateralBalanceFormatted, userCollateralBalanceLoading } =
    useCollateralBalanceUser(
      poolAddress,
      token.address as `0x${string}`,
      token.decimals,
      enabled,
    );

  return (
    <BalanceCellFrame label="Collateral">
      {userCollateralBalanceLoading ? (
        <div className="flex items-center justify-end">
          <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
        </div>
      ) : (
        userCollateralBalanceFormatted
      )}
    </BalanceCellFrame>
  );
};
