import type { ContentProps } from "../../types";
import type { HexAddress } from "@/types";
import { ModeToggle } from "../../ui/mode-toggle";
import { ActionButton } from "@/components/ui/action-button";
import { ConversionCard } from "../../ui/conversion-card";
import { AmountSection } from "../../sections/amount-section";
import { StatsSection } from "../../sections/stats-section";
import { TokenSelect } from "@/components/pool/token-select";
import { useRepayContent, getActiveToken } from "./use-repay-content";
import { useIsConnected } from "@/components/wallet/connection-guard";

export const RepayContent = ({
  poolAddress,
  borrowTokenAddress,
  borrowSymbol,
  borrowLogoUrl,
  borrowTokenDecimals,
  ltv,
}: ContentProps) => {
  const { address } = useIsConnected();

  const { state, computed, mutations, actions } = useRepayContent({
    poolAddress,
    borrowTokenAddress,
    borrowTokenDecimals,
    userAddress: address as HexAddress,
  });

  const activeToken = getActiveToken(
    state.repayMode,
    state.selectedToken,
    state.collateralToken,
    borrowTokenAddress,
    borrowTokenDecimals,
    borrowLogoUrl,
    borrowSymbol,
  );

  const handleAction = () => {
    if (!state.amount || parseFloat(state.amount) <= 0) return;
    if (state.repayMode === "position" && !state.selectedToken) return;
    if (state.repayMode === "token" && !state.collateralToken) return;

    if (state.repayMode === "position") {
      if (!state.hasApproved) {
        mutations.approve.mutation.mutate(
          {
            tokenAddress: computed.tokenToUse as HexAddress,
            spenderAddress: poolAddress as HexAddress,
            amount: state.amount,
            decimals: activeToken.decimals,
            bufferPercent: 10,
          },
          { onSuccess: () => actions.setHasApproved(true) },
        );
      } else {
        mutations.repay.mutation.mutate(
          {
            poolAddress: poolAddress as HexAddress,
            borrowTokenAddress: computed.tokenToUse as HexAddress,
            amount: computed.convertedAmount,
            decimals: borrowTokenDecimals,
            tokenInDecimals: activeToken.decimals,
          },
          {
            onSuccess: () => {
              actions.setAmount("");
              actions.setHasApproved(false);
            },
          },
        );
      }
    } else {
      mutations.repayByCollateral.mutation.mutate(
        {
          poolAddress: poolAddress as HexAddress,
          borrowTokenAddress: computed.tokenToUse as HexAddress,
          amount: computed.collateralConvertedAmount,
          decimals: borrowTokenDecimals,
          tokenInDecimals:
            state.collateralToken?.decimals ?? borrowTokenDecimals,
        },
        { onSuccess: () => actions.setAmount("") },
      );
    }
  };

  const getButtonLabel = () => {
    if (computed.isLoadingBorrowShares) return "Loading";
    if (!computed.hasBorrow) return "No Borrow to Repay";
    if (mutations.approve.status === "loading") return "Approving";
    if (
      mutations.repay.status === "loading" ||
      mutations.repayByCollateral.status === "loading"
    ) {
      return "Repaying";
    }
    if (state.repayMode === "position") {
      return state.hasApproved ? "Repay from Position" : "Approve Token";
    }
    return "Repay with Collateral";
  };

  const showConversionCard =
    state.repayMode === "position" &&
    state.selectedToken &&
    !computed.isSameAsBorrowToken &&
    state.amount &&
    parseFloat(state.amount) > 0;

  const showCollateralConversionCard =
    state.repayMode === "token" &&
    state.collateralToken &&
    !computed.isCollateralSameAsBorrowToken &&
    state.amount &&
    parseFloat(state.amount) > 0;

  const isButtonDisabled =
    !computed.hasBorrow ||
    computed.isLoadingBorrowShares ||
    !state.amount ||
    parseFloat(state.amount) <= 0 ||
    computed.isLoading ||
    (state.repayMode === "position" && !state.selectedToken) ||
    (state.repayMode === "position" &&
      !computed.isSameAsBorrowToken &&
      computed.positionExchange.isLoading) ||
    (state.repayMode === "token" && !state.collateralToken) ||
    (state.repayMode === "token" &&
      !computed.isCollateralSameAsBorrowToken &&
      computed.collateralExchange.isLoading);

  const exchangeProps =
    state.repayMode === "position" && !computed.isSameAsBorrowToken
      ? {
          exchangeRate: computed.positionExchange.rate,
          exchangeRateLoading: computed.positionExchange.isLoading,
          fromTokenSymbol: state.selectedToken?.symbol,
          calculatedAmountOut: computed.positionExchange.formattedAmountOut,
        }
      : state.repayMode === "token" && !computed.isCollateralSameAsBorrowToken
        ? {
            exchangeRate: computed.collateralExchange.rate,
            exchangeRateLoading: computed.collateralExchange.isLoading,
            fromTokenSymbol: state.collateralToken?.symbol,
            calculatedAmountOut: computed.collateralExchange.formattedAmountOut,
          }
        : {};

  return (
    <>
      <ModeToggle
        activeTab="Repay"
        mode="liquidity"
        onChange={() => {}}
        repayMode={state.repayMode}
        onRepayModeChange={actions.handleModeChange}
      />

      {state.repayMode === "position" && (
        <TokenSelect
          label="Select Token"
          selected={state.selectedToken}
          onSelect={actions.handleTokenSelect}
          showBalance
          balanceType="wallet"
        />
      )}

      {state.repayMode === "token" && (
        <TokenSelect
          label="Select Collateral Token"
          selected={state.collateralToken}
          onSelect={actions.setCollateralToken}
          showBalance
          balanceType="collateral"
          poolAddress={poolAddress as `0x${string}`}
        />
      )}

      <AmountSection
        actionLabel={
          state.repayMode === "position"
            ? "Repay with"
            : "Repay with Collateral"
        }
        assetSymbol={activeToken.symbol}
        assetLogoUrl={activeToken.logo}
        amount={state.amount}
        onAmountChange={actions.setAmount}
        tokenAddress={activeToken.address as HexAddress}
        decimals={activeToken.decimals}
        balanceType={state.repayMode === "token" ? "collateral" : "wallet"}
        poolAddress={
          state.repayMode === "token"
            ? (poolAddress as `0x${string}`)
            : undefined
        }
      />

      {showConversionCard && (
        <ConversionCard
          outputAmount={computed.convertedAmount}
          outputSymbol={borrowSymbol || ""}
          outputLogoUrl={borrowLogoUrl}
          isLoading={computed.positionExchange.isLoading}
        />
      )}

      {showCollateralConversionCard && (
        <ConversionCard
          outputAmount={computed.collateralConvertedAmount}
          outputSymbol={borrowSymbol || ""}
          outputLogoUrl={borrowLogoUrl}
          isLoading={computed.collateralExchange.isLoading}
        />
      )}

      <StatsSection
        poolAddress={poolAddress}
        ltv={ltv}
        mode="repay"
        borrowTokenDecimals={borrowTokenDecimals}
        toTokenSymbol={
          (state.repayMode === "position" && !computed.isSameAsBorrowToken) ||
          (state.repayMode === "token" &&
            !computed.isCollateralSameAsBorrowToken)
            ? borrowSymbol
            : undefined
        }
        inputAmount={state.amount}
        simulatedHealthFactor={
          state.amount && parseFloat(state.amount) > 0
            ? computed.healthFactorAfter
            : null
        }
        {...exchangeProps}
      />

      <ActionButton
        variant="repay"
        onClick={handleAction}
        disabled={isButtonDisabled}
        isLoading={computed.isLoading}
        loadingText={getButtonLabel()}
        fullWidth
      >
        {getButtonLabel()}
      </ActionButton>
    </>
  );
};
