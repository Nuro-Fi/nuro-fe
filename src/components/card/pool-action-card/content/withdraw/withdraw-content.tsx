import type { ContentProps } from "../../types";
import type { HexAddress } from "@/types";
import { ModeToggle } from "../../ui/mode-toggle";
import { ActionButton } from "@/components/ui/action-button";
import { AmountSection } from "../../sections/amount-section";
import { StatsSection } from "../../sections/stats-section";
import { useWithdrawContent } from "./use-withdraw-content";
import { useIsConnected } from "@/components/wallet/connection-guard";

export const WithdrawContent = ({
  poolAddress,
  collateralTokenAddress,
  borrowTokenAddress,
  collateralSymbol,
  borrowSymbol,
  collateralLogoUrl,
  borrowLogoUrl,
  borrowTokenDecimals,
  collateralTokenDecimals,
  ltv,
}: ContentProps) => {
  const { address } = useIsConnected();

  const { state, activeAsset, computed, actions } = useWithdrawContent({
    poolAddress,
    collateralTokenAddress,
    borrowTokenAddress,
    collateralSymbol,
    borrowSymbol,
    collateralLogoUrl,
    borrowLogoUrl,
    borrowTokenDecimals,
    collateralTokenDecimals,
    userAddress: address as HexAddress,
  });

  return (
    <>
      <ModeToggle
        activeTab="Withdraw"
        mode={state.mode}
        onChange={actions.setMode}
      />

      <AmountSection
        actionLabel="Withdraw"
        assetSymbol={activeAsset.symbol}
        assetLogoUrl={activeAsset.logoUrl}
        amount={state.amount}
        onAmountChange={actions.setAmount}
        tokenAddress={activeAsset.tokenAddress as HexAddress}
        decimals={activeAsset.decimals}
        poolAddress={poolAddress as HexAddress}
        balanceType={state.mode === "liquidity" ? "supply" : "collateral"}
      />

      <StatsSection
        poolAddress={poolAddress}
        ltv={ltv}
        mode={
          state.mode === "liquidity"
            ? "withdraw-liquidity"
            : "withdraw-collateral"
        }
        tokenAddress={activeAsset.tokenAddress}
        tokenSymbol={activeAsset.symbol}
        tokenDecimals={activeAsset.decimals}
        simulatedHealthFactor={
          state.isCollateralMode && state.amount && parseFloat(state.amount) > 0
            ? computed.healthFactorAfter
            : null
        }
      />


      <ActionButton
        variant="withdraw"
        onClick={actions.handleAction}
        disabled={computed.isButtonDisabled}
        isLoading={computed.isLoading}
        loadingText={actions.getButtonLabel()}
        fullWidth
      >
        {actions.getButtonLabel()}
      </ActionButton>
    </>
  );
};
