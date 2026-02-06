import { useState, useCallback, useMemo } from "react";
import { useApprove } from "@/hooks/mutation/use-approve";
import { useSupply } from "@/hooks/mutation/use-supply";
import { useSimulatedHealthFactor } from "@/hooks/use-health-factor";
import type { HexAddress } from "@/types";
import type { Mode } from "../../types";
import { zeroAddress } from "viem";

interface UseSupplyContentParams {
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

export const useSupplyContent = ({
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
}: UseSupplyContentParams) => {
  const [mode, setMode] = useState<Mode>("liquidity");
  const [amount, setAmount] = useState("");
  const [hasApproved, setHasApproved] = useState(false);

  const approve = useApprove(mode);
  const supply = useSupply({ type: mode });

  const { after: healthFactorAfter } = useSimulatedHealthFactor(
    userAddress,
    poolAddress as HexAddress,
    mode === "collateral" ? amount : "0",
    collateralTokenDecimals,
    "supply-collateral",
  );

  const isLiquidity = mode === "liquidity";
  const isCollateralMode = mode === "collateral";

  const activeAsset = useMemo(
    () => ({
      symbol: isLiquidity
        ? (borrowSymbol ?? "Borrow")
        : (collateralSymbol ?? "Collateral"),
      logoUrl: isLiquidity ? borrowLogoUrl : collateralLogoUrl,
      tokenAddress: isLiquidity ? borrowTokenAddress : collateralTokenAddress,
      decimals: isLiquidity ? borrowTokenDecimals : collateralTokenDecimals,
    }),
    [
      isLiquidity,
      borrowSymbol,
      collateralSymbol,
      borrowLogoUrl,
      collateralLogoUrl,
      borrowTokenAddress,
      collateralTokenAddress,
      borrowTokenDecimals,
      collateralTokenDecimals,
    ],
  );

  const isNative =
    activeAsset.tokenAddress === zeroAddress ||
    activeAsset.tokenAddress === "0x0000000000000000000000000000000000000001";

  const isLoading =
    (approve.status === "loading" && !isNative) || supply.status === "loading";

  const getButtonLabel = useCallback(() => {
    if (approve.status === "loading" && !isNative) return "Approving";
    if (supply.status === "loading") return "Supplying";
    if (hasApproved || isNative)
      return `Supply ${isLiquidity ? "Liquidity" : "Collateral"}`;
    return "Approve Token";
  }, [approve.status, supply.status, hasApproved, isLiquidity, isNative]);

  const isButtonDisabled = !amount || parseFloat(amount) <= 0 || isLoading;

  const handleApprove = useCallback(() => {
    approve.mutation.mutate(
      {
        tokenAddress: activeAsset.tokenAddress as HexAddress,
        spenderAddress: poolAddress as HexAddress,
        amount,
        decimals: activeAsset.decimals,
      },
      { onSuccess: () => setHasApproved(true) },
    );
  }, [approve.mutation, activeAsset, poolAddress, amount]);

  const handleSupply = useCallback(() => {
    supply.mutation.mutate(
      {
        poolAddress: poolAddress as HexAddress,
        amount,
        decimals: activeAsset.decimals,
      },
      {
        onSuccess: () => {
          setAmount("");
          setHasApproved(false);
        },
      },
    );
  }, [supply.mutation, poolAddress, amount, activeAsset.decimals]);

  const handleAction = useCallback(() => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (hasApproved || isNative) {
      handleSupply();
    } else {
      handleApprove();
    }
  }, [amount, hasApproved, isNative, handleSupply, handleApprove]);

  return {
    state: { mode, amount, hasApproved, isCollateralMode },
    activeAsset,
    computed: { isLoading, isButtonDisabled, healthFactorAfter },
    actions: { setMode, setAmount, handleAction, getButtonLabel },
  };
};
