import { zeroAddress } from "viem";
import { useState, useMemo, useCallback } from "react";
import { usePools, type PoolWithTokens } from "@/hooks/graphql/use-pools";
import useReadPosition from "@/hooks/address/use-read-position";
import { useCollateralBalanceUser } from "@/hooks/balance/use-collateral-balance-user";
import { useSwapToken } from "@/hooks/mutation/use-swap-token";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { getTokensArray } from "@/lib/addresses/tokens";
import { Network, type TokenConfig } from "@/lib/addresses/types";
import type { HexAddress } from "@/types";

const AVAILABLE_TOKENS: TokenConfig[] = getTokensArray(Network.ARC);

const findTokenByAddress = (tokens: TokenConfig[], address: string) =>
  tokens.find((t) => t.address.toLowerCase() === address.toLowerCase()) ?? null;

export const useSwapCard = () => {
  const [selectedPool, setSelectedPool] = useState<PoolWithTokens | null>(null);
  const [tokenIn, setTokenIn] = useState<TokenConfig | null>(null);
  const [tokenOut, setTokenOut] = useState<TokenConfig | null>(null);
  const [amountIn, setAmountIn] = useState<string>("");

  const { data: pools = [], isLoading: isLoadingPools } = usePools();
  const { status: swapStatus, mutation: swapMutation } = useSwapToken();
  const poolAddress = selectedPool?.lendingPool as HexAddress | undefined;
  const routerAddress = selectedPool?.router;

  const {
    positionAddress,
    hasPosition,
    isLoading: isLoadingPosition,
  } = useReadPosition(routerAddress || "");

  const {
    userCollateralBalanceFormatted: tokenInBalance,
    userCollateralBalanceParsed: tokenInBalanceParsed,
  } = useCollateralBalanceUser(
    (poolAddress || zeroAddress) as HexAddress,
    (tokenIn?.address || zeroAddress) as HexAddress,
    tokenIn?.decimals ?? 18,
  );

  const {
    rate: exchangeRate,
    formattedAmountOut,
    isLoading: isLoadingRate,
  } = useExchangeRate(
    (tokenIn?.address as HexAddress) ?? null,
    (tokenOut?.address as HexAddress) ?? null,
    amountIn || "1",
    (positionAddress as HexAddress) ?? null,
    tokenIn?.decimals ?? 18,
    tokenOut?.decimals ?? 6,
  );

  const isLoading = swapStatus === "loading";

  const estimatedAmountOut = useMemo(() => {
    if (!amountIn || parseFloat(amountIn) <= 0) return "";
    if (formattedAmountOut) return parseFloat(formattedAmountOut).toFixed(6);
    if (!exchangeRate) return "";
    return (parseFloat(amountIn) * exchangeRate).toFixed(6);
  }, [amountIn, formattedAmountOut, exchangeRate]);

  const formattedRate = useMemo(() => {
    if (!exchangeRate) return null;
    return exchangeRate >= 1
      ? exchangeRate.toFixed(4)
      : exchangeRate.toFixed(8);
  }, [exchangeRate]);

  const isValidSwap = useMemo(() => {
    return (
      selectedPool &&
      tokenIn &&
      tokenOut &&
      amountIn &&
      parseFloat(amountIn) > 0 &&
      tokenIn.address !== tokenOut.address &&
      hasPosition
    );
  }, [selectedPool, tokenIn, tokenOut, amountIn, hasPosition]);

  const isDisabled =
    !isValidSwap || isLoading || isLoadingPools || isLoadingPosition;

  const handlePoolSelect = useCallback((pool: PoolWithTokens) => {
    setSelectedPool(pool);
    setTokenIn(findTokenByAddress(AVAILABLE_TOKENS, pool.collateralToken));
    setTokenOut(findTokenByAddress(AVAILABLE_TOKENS, pool.borrowToken));
    setAmountIn("");
  }, []);

  const handleSwapDirection = useCallback(() => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn("");
  }, [tokenIn, tokenOut]);

  const handleMaxClick = useCallback(() => {
    if (tokenInBalanceParsed > 0) {
      setAmountIn(tokenInBalanceParsed.toString());
    }
  }, [tokenInBalanceParsed]);

  const handleSwap = useCallback(async () => {
    if (!tokenIn || !tokenOut || !amountIn || !poolAddress) return;

    try {
      await swapMutation.mutateAsync({
        poolAddress,
        tokenIn: tokenIn.address as HexAddress,
        tokenOut: tokenOut.address as HexAddress,
        amountIn,
        tokenInDecimals: tokenIn.decimals,
      });
      setAmountIn("");
    } catch {}
  }, [tokenIn, tokenOut, amountIn, poolAddress, swapMutation]);

  const buttonText = useMemo(() => {
    if (isLoadingPools) return "Loading pools";
    if (isLoading) return "Swapping";
    if (!selectedPool) return "Select a pool";
    if (isLoadingPosition) return "Loading position";
    if (!hasPosition) return "No position found";
    if (!tokenIn || !tokenOut) return "Select tokens";
    if (tokenIn.address === tokenOut.address) return "Select different tokens";
    if (!amountIn || parseFloat(amountIn) <= 0) return "Enter amount";
    return "Swap";
  }, [
    isLoadingPools,
    isLoading,
    selectedPool,
    isLoadingPosition,
    hasPosition,
    tokenIn,
    tokenOut,
    amountIn,
  ]);

  return {
    state: {
      selectedPool,
      tokenIn,
      tokenOut,
      amountIn,
      pools,
    },
    computed: {
      estimatedAmountOut,
      formattedRate,
      exchangeRate,
      isLoading,
      isLoadingPools,
      isLoadingRate,
      isDisabled,
      hasPosition,
      tokenInBalance,
      tokenInBalanceParsed,
      buttonText,
    },
    actions: {
      setTokenIn,
      setTokenOut,
      setAmountIn,
      handlePoolSelect,
      handleSwapDirection,
      handleMaxClick,
      handleSwap,
    },
  };
};
