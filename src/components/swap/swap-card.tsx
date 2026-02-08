"use client";

import { InlineState } from "@/components/error/inline-state";
import { ActionButton } from "@/components/ui/action-button";
import { useSwapCard } from "./use-swap-card";
import { SwapHeader } from "./ui/swap-header";
import { SwapDirectionButton } from "./ui/swap-direction-button";
import { SwapDetails } from "./ui/swap-details";
import { PoolSelector } from "./ui/pool-selector";
import { SwapInput } from "./swap-input";
import { RequirePosition } from "@/components/guards/require-position";

interface SwapCardProps {
  className?: string;
}

export const SwapCard = ({ className = "" }: SwapCardProps) => {
  const { state, computed, actions } = useSwapCard();

  const { selectedPool, tokenIn, tokenOut, amountIn, pools } = state;

  const {
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
  } = computed;

  const {
    setTokenIn,
    setTokenOut,
    setAmountIn,
    handlePoolSelect,
    handleSwapDirection,
    handleMaxClick,
    handleSwap,
  } = actions;

  return (
    <div
      className={`rounded-2xl border border-border-primary bg-surface-primary p-5 ${className}`}
    >
      <SwapHeader />

      <div className="space-y-2">
        <PoolSelector
          pool={selectedPool}
          pools={pools}
          isLoading={isLoadingPools}
          onSelect={handlePoolSelect}
        />

        {selectedPool ? (
          <RequirePosition
            poolAddress={selectedPool.lendingPool}
            noPositionMessage="Supply collateral first to enable swaps."
          >
            <div className="space-y-2">
              <SwapInput
                label="You pay"
                token={tokenIn}
                onTokenSelect={setTokenIn}
                amount={amountIn}
                onAmountChange={setAmountIn}
                excludeAddress={tokenOut?.address}
                disabled={isLoading}
                balance={hasPosition && tokenIn ? tokenInBalance : undefined}
                onMaxClick={
                  hasPosition && tokenInBalanceParsed > 0
                    ? handleMaxClick
                    : undefined
                }
                dialogShowBalance
                dialogBalanceType="collateral"
                dialogPoolAddress={selectedPool.lendingPool as `0x${string}`}
              />

              <SwapDirectionButton
                onClick={handleSwapDirection}
                disabled={!tokenIn || !tokenOut || isLoading}
              />

              <SwapInput
                label="You receive"
                token={tokenOut}
                onTokenSelect={setTokenOut}
                amount={estimatedAmountOut}
                excludeAddress={tokenIn?.address}
                disabled={isLoading}
                readOnly
                dialogShowBalance
                dialogBalanceType="collateral"
                dialogPoolAddress={selectedPool.lendingPool as `0x${string}`}
              />

              {tokenIn && tokenOut && (
                <SwapDetails
                  tokenIn={tokenIn}
                  tokenOut={tokenOut}
                  rate={formattedRate}
                  exchangeRate={exchangeRate}
                  isLoadingRate={isLoadingRate}
                />
              )}

              <div className="mt-4">
                <ActionButton
                  variant="swap"
                  onClick={handleSwap}
                  disabled={isDisabled}
                  isLoading={isLoading || isLoadingPools}
                  loadingText={buttonText}
                  fullWidth
                >
                  {buttonText}
                </ActionButton>
              </div>
            </div>
          </RequirePosition>
        ) : (
          <InlineState
            padding="none"
            className="py-8"
            variant="empty"
            message="Select a pool to start swapping"
          />
        )}
      </div>
    </div>
  );
};

export default SwapCard;
