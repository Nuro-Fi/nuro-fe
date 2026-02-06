import { useState, useCallback } from "react";
import { useWithdrawLiquidity } from "@/hooks/mutation/use-withdraw-liquidity";
import { useWithdrawCollateral } from "@/hooks/mutation/use-withdraw-collateral";
import { useCalculateWithdrawShares } from "@/hooks/balance/use-user-shares";
import { useSimulatedHealthFactor } from "@/hooks/use-health-factor";
import { useTotalCollateralBalanceUser } from "@/hooks/balance/use-total-collateral-balance-user";
import type { HexAddress } from "@/types";
import type { Mode } from "../../types";
import { zeroAddress } from "viem";

interface UseWithdrawContentParams {
  poolAddress: string;
  collateralTokenAddress: string | undefined;
  borrowTokenAddress: string | undefined;
  collateralSymbol: string | undefined;
  borrowSymbol: string | undefined;
  collateralLogoUrl: string | undefined;
  borrowLogoUrl: string | undefined;
  borrowTokenDecimals: number;
  collateralTokenDecimals: number;
  userAddress: HexAddress | undefined;
}

export const useWithdrawContent = ({
  poolAddress,
  collateralTokenAddress,
  borrowTokenAddress,
  collateralSymbol,
  borrowSymbol,
  collateralLogoUrl,
  borrowLogoUrl,
  borrowTokenDecimals,
  collateralTokenDecimals,
  userAddress,
}: UseWithdrawContentParams) => {
  const [mode, setMode] = useState<Mode>("liquidity");
  const [amount, setAmount] = useState("");

  const withdrawLiquidity = useWithdrawLiquidity();
  const withdrawCollateral = useWithdrawCollateral();

  const { shares: withdrawShares, sharesLoading } = useCalculateWithdrawShares(
    poolAddress as HexAddress,
    mode === "liquidity" ? amount : "0",
    borrowTokenDecimals,
  );

  const isLiquidity = mode === "liquidity";
  const isCollateralMode = mode === "collateral";

  const { userCollateralBalanceFormatted } = useTotalCollateralBalanceUser(
    poolAddress as HexAddress,
    (collateralTokenAddress as HexAddress) || zeroAddress,
    collateralTokenDecimals,
  );

  const { after: healthFactorAfter } = useSimulatedHealthFactor(
    userAddress,
    poolAddress as HexAddress,
    isCollateralMode ? amount : "0",
    collateralTokenDecimals,
    "withdraw-collateral",
    isCollateralMode ? userCollateralBalanceFormatted : undefined,
  );

  const activeAsset = {
    symbol: isLiquidity
      ? (borrowSymbol ?? "Borrow")
      : (collateralSymbol ?? "Collateral"),
    logoUrl: isLiquidity ? borrowLogoUrl : collateralLogoUrl,
    tokenAddress: isLiquidity ? borrowTokenAddress : collateralTokenAddress,
    decimals: isLiquidity ? borrowTokenDecimals : collateralTokenDecimals,
  };

  const isLoading =
    withdrawLiquidity.status === "loading" ||
    withdrawCollateral.status === "loading";

  const getButtonLabel = useCallback(() => {
    if (isLiquidity) {
      return withdrawLiquidity.status === "loading"
        ? "Withdrawing"
        : "Withdraw Liquidity";
    }
    return withdrawCollateral.status === "loading"
      ? "Withdrawing"
      : "Withdraw Collateral";
  }, [isLiquidity, withdrawLiquidity.status, withdrawCollateral.status]);

  const isButtonDisabled =
    !amount ||
    parseFloat(amount) <= 0 ||
    (isLiquidity && (sharesLoading || withdrawShares === BigInt(0)));

  const handleAction = useCallback(() => {
    if (!amount || parseFloat(amount) <= 0) return;

    if (isLiquidity) {
      if (withdrawShares === BigInt(0)) return;
      withdrawLiquidity.mutation.mutate(
        {
          poolAddress: poolAddress as HexAddress,
          shares: withdrawShares,
          decimals: borrowTokenDecimals,
        },
        { onSuccess: () => setAmount("") },
      );
    } else {
      withdrawCollateral.mutation.mutate(
        {
          poolAddress: poolAddress as HexAddress,
          amount,
          decimals: collateralTokenDecimals,
        },
        { onSuccess: () => setAmount("") },
      );
    }
  }, [
    amount,
    isLiquidity,
    withdrawShares,
    withdrawLiquidity.mutation,
    withdrawCollateral.mutation,
    poolAddress,
    borrowTokenDecimals,
    collateralTokenDecimals,
  ]);

  return {
    state: { mode, amount, isCollateralMode },
    activeAsset,
    computed: { isLoading, isButtonDisabled, healthFactorAfter },
    actions: { setMode, setAmount, handleAction, getButtonLabel },
  };
};
