import type { ContentProps } from "../../types";
import type { HexAddress } from "@/types";
import { ModeToggle } from "../../ui/mode-toggle";
import { ActionButton } from "@/components/ui/action-button";
import { AmountSection } from "../../sections/amount-section";
import { StatsSection } from "../../sections/stats-section";
import { useSupplyContent } from "./use-supply-content";
import { useIsConnected } from "@/components/wallet/connection-guard";

export const SupplyContent = ({
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

  const { state, activeAsset, computed, actions } = useSupplyContent({
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
        activeTab="Supply"
        mode={state.mode}
        onChange={actions.setMode}
      />

      <AmountSection
        actionLabel="Supply"
        assetSymbol={activeAsset.symbol}
        assetLogoUrl={activeAsset.logoUrl}
        amount={state.amount}
        onAmountChange={actions.setAmount}
        tokenAddress={activeAsset.tokenAddress as HexAddress}
        decimals={activeAsset.decimals}
        poolAddress={poolAddress as HexAddress}
        balanceType="wallet"
      />

      <StatsSection
        poolAddress={poolAddress}
        ltv={ltv}
        mode={
          state.mode === "liquidity" ? "supply-liquidity" : "supply-collateral"
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
        variant="supply"
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
