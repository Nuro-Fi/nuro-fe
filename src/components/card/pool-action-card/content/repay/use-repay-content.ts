import { useState, useMemo, useCallback } from "react";
import { useApprove } from "@/hooks/mutation/use-approve";
import {
  useRepaySelectToken,
  useRepayFromPosition,
} from "@/hooks/mutation/use-repay";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { useSimulatedHealthFactor } from "@/hooks/use-health-factor";
import { usePoolByAddress } from "@/hooks/graphql/use-pools";
import useReadPosition from "@/hooks/address/use-read-position";
import { useReadUserBorrowShares } from "@/hooks/balance/use-user-borrow-shares";
import { getTokensArray } from "@/lib/addresses/tokens";
import { Network } from "@/lib/addresses/types";
import type { HexAddress } from "@/types";
import type { TokenConfig } from "@/lib/addresses/types";
import type { RepayMode } from "../../types";

const AVAILABLE_TOKENS = getTokensArray(Network.ARC);

const findTokenByAddress = (address: string | undefined) =>
  AVAILABLE_TOKENS.find(
    (t) => t.address.toLowerCase() === address?.toLowerCase(),
  ) || null;

const getActiveToken = (
  repayMode: RepayMode,
  selectedToken: TokenConfig | null,
  collateralToken: TokenConfig | null,
  borrowTokenAddress: string | undefined,
  borrowTokenDecimals: number,
  borrowLogoUrl: string | undefined,
  borrowSymbol: string | undefined,
) => {
  if (repayMode === "position" && selectedToken) {
    return {
      address: selectedToken.address,
      symbol: selectedToken.symbol,
      logo: selectedToken.logo,
      decimals: selectedToken.decimals,
    };
  }
  if (repayMode === "token" && collateralToken) {
    return {
      address: collateralToken.address,
      symbol: collateralToken.symbol,
      logo: collateralToken.logo,
      decimals: collateralToken.decimals,
    };
  }
  return {
    address: borrowTokenAddress || "",
    symbol: borrowSymbol ?? "Borrow",
    logo: borrowLogoUrl,
    decimals: borrowTokenDecimals,
  };
};

interface UseRepayContentParams {
  poolAddress: string;
  borrowTokenAddress: string | undefined;
  borrowTokenDecimals: number;
  userAddress: HexAddress | undefined;
}

export const useRepayContent = ({
  poolAddress,
  borrowTokenAddress,
  borrowTokenDecimals,
  userAddress,
}: UseRepayContentParams) => {
  const [repayMode, setRepayMode] = useState<RepayMode>("position");
  const [amount, setAmount] = useState("");
  const [hasApproved, setHasApproved] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenConfig | null>(() =>
    findTokenByAddress(borrowTokenAddress),
  );
  const [collateralToken, setCollateralToken] = useState<TokenConfig | null>(
    () => findTokenByAddress(borrowTokenAddress),
  );

  const { data: pool } = usePoolByAddress(poolAddress);
  const routerAddress = pool?.router;
  const { positionAddress } = useReadPosition(routerAddress || "");
  const { borrowShares, isLoadingBorrowShares } = useReadUserBorrowShares(
    routerAddress as HexAddress | undefined,
    borrowTokenDecimals,
  );

  const hasBorrow = borrowShares > BigInt(0);

  const { after: healthFactorAfter } = useSimulatedHealthFactor(
    userAddress,
    poolAddress as HexAddress,
    amount,
    borrowTokenDecimals,
    "repay",
  );

  const isSameAsBorrowToken =
    selectedToken?.address?.toLowerCase() === borrowTokenAddress?.toLowerCase();
  const isCollateralSameAsBorrowToken =
    collateralToken?.address?.toLowerCase() ===
    borrowTokenAddress?.toLowerCase();

  const positionExchange = useExchangeRate(
    repayMode === "position" && selectedToken && !isSameAsBorrowToken
      ? (selectedToken.address as HexAddress)
      : null,
    borrowTokenAddress as HexAddress,
    amount || "0",
    positionAddress,
    selectedToken?.decimals || 18,
    borrowTokenDecimals,
  );

  const collateralExchange = useExchangeRate(
    repayMode === "token" && collateralToken && !isCollateralSameAsBorrowToken
      ? (collateralToken.address as HexAddress)
      : null,
    borrowTokenAddress as HexAddress,
    amount || "0",
    positionAddress,
    collateralToken?.decimals || 18,
    borrowTokenDecimals,
  );

  const approve = useApprove("default");
  const repay = useRepaySelectToken({
    poolAddress: poolAddress as HexAddress,
    decimals: borrowTokenDecimals,
  });
  const repayByCollateral = useRepayFromPosition({
    poolAddress: poolAddress as HexAddress,
    decimals: borrowTokenDecimals,
  });

  const tokenToUse =
    repayMode === "position" && selectedToken
      ? selectedToken.address
      : repayMode === "token" && collateralToken
        ? collateralToken.address
        : borrowTokenAddress;

  const convertedAmount = useMemo(() => {
    if (!amount || parseFloat(amount) <= 0) return "0";
    if (isSameAsBorrowToken) return amount;
    return positionExchange.formattedAmountOut || "0";
  }, [amount, isSameAsBorrowToken, positionExchange.formattedAmountOut]);

  const collateralConvertedAmount = useMemo(() => {
    if (!amount || parseFloat(amount) <= 0) return "0";
    if (isCollateralSameAsBorrowToken) return amount;
    return collateralExchange.formattedAmountOut || "0";
  }, [
    amount,
    isCollateralSameAsBorrowToken,
    collateralExchange.formattedAmountOut,
  ]);

  const resetState = useCallback(() => {
    setHasApproved(false);
    setAmount("");
    setSelectedToken(null);
    setCollateralToken(null);
  }, []);

  const handleModeChange = useCallback(
    (mode: RepayMode) => {
      setRepayMode(mode);
      resetState();
    },
    [resetState],
  );

  const handleTokenSelect = useCallback((token: TokenConfig | null) => {
    setSelectedToken(token);
    setHasApproved(false);
  }, []);

  const isLoading =
    approve.status === "loading" ||
    repay.status === "loading" ||
    repayByCollateral.status === "loading";

  return {
    state: {
      repayMode,
      amount,
      hasApproved,
      selectedToken,
      collateralToken,
    },
    computed: {
      isSameAsBorrowToken,
      isCollateralSameAsBorrowToken,
      tokenToUse,
      convertedAmount,
      collateralConvertedAmount,
      isLoading,
      healthFactorAfter,
      positionExchange,
      collateralExchange,
      hasBorrow,
      isLoadingBorrowShares,
    },
    mutations: { approve, repay, repayByCollateral },
    actions: {
      setAmount,
      setHasApproved,
      setCollateralToken,
      handleModeChange,
      handleTokenSelect,
      resetState,
    },
  };
};

export { getActiveToken, findTokenByAddress };
