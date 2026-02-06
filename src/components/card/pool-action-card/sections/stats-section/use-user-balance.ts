import { useTotalCollateralBalanceUser } from "@/hooks/balance/use-total-collateral-balance-user";
import { useReadUserSupplyBalance } from "@/hooks/balance/use-user-supply-balance";
import { zeroAddress } from "viem";
import type { StatsMode } from "./types";

interface UseUserBalanceResult {
  balance: string | null;
  loading: boolean;
  label: string | null;
}

export const useUserBalance = (
  poolAddress: string,
  tokenAddress: string | undefined,
  tokenDecimals: number,
  mode: StatsMode | undefined,
): UseUserBalanceResult => {
  const safeTokenAddress = (tokenAddress as `0x${string}`) || zeroAddress;

  const { userCollateralBalanceFormatted, userCollateralBalanceLoading } =
    useTotalCollateralBalanceUser(
      poolAddress as `0x${string}`,
      safeTokenAddress,
      tokenDecimals,
    );

  const { userSupplyBalanceFormatted, userSupplyBalanceLoading } =
    useReadUserSupplyBalance(
      poolAddress as `0x${string}`,
      safeTokenAddress,
      tokenDecimals,
    );

  const showCollateral =
    mode === "supply-collateral" || mode === "withdraw-collateral";
  const showSupply =
    mode === "supply-liquidity" || mode === "withdraw-liquidity";

  if (showCollateral) {
    return {
      balance: userCollateralBalanceFormatted,
      loading: userCollateralBalanceLoading,
      label: "Your Collateral",
    };
  }

  if (showSupply) {
    return {
      balance: userSupplyBalanceFormatted,
      loading: userSupplyBalanceLoading,
      label: "Your Supply",
    };
  }

  return { balance: null, loading: false, label: null };
};
