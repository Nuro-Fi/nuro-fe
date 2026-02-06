import type { ContentProps } from "../../types";
import type { HexAddress } from "@/types";
import { ActionButton } from "@/components/ui/action-button";
import { AmountSection } from "../../sections/amount-section";
import { StatsSection } from "../../sections/stats-section";
import { ChainSelect } from "@/components/chain/chain-select";
import { useBorrowContent } from "./use-borrow-content";
import { useIsConnected } from "@/components/wallet/connection-guard";
import { RequirePosition } from "@/components/guards/require-position";

export const BorrowContent = ({
  poolAddress,
  borrowTokenAddress,
  borrowSymbol,
  borrowLogoUrl,
  borrowTokenDecimals,
  ltv,
  liquidationThreshold,
}: ContentProps) => {
  const { address } = useIsConnected();

  const { state, computed, actions } = useBorrowContent({
    poolAddress,
    borrowTokenDecimals,
    userAddress: address as HexAddress,
    ltv,
    liquidationThreshold,
  });

  return (
    <RequirePosition
      poolAddress={poolAddress}
      noPositionMessage="Supply collateral first to start borrowing."
    >
      <div className="space-y-3">
        <AmountSection
          actionLabel="Borrow"
          assetSymbol={borrowSymbol ?? "Borrow"}
          assetLogoUrl={borrowLogoUrl}
          amount={state.amount}
          onAmountChange={actions.setAmount}
          tokenAddress={borrowTokenAddress as HexAddress}
          decimals={borrowTokenDecimals}
        />

        <ChainSelect
          label="Destination Chain"
          selected={state.selectedChain}
          onSelect={actions.setSelectedChain}
        />

        <StatsSection
          poolAddress={poolAddress}
          ltv={ltv}
          mode="borrow"
          maxBorrowAmount={computed.maxBorrowAmountFormatted ?? undefined}
          borrowSymbol={borrowSymbol}
          borrowTokenDecimals={borrowTokenDecimals}
          simulatedHealthFactor={
            state.amount && parseFloat(state.amount) > 0
              ? computed.healthFactorAfter
              : null
          }
          crossChainFee={
            computed.isCrossChain &&
            computed.nativeFee > BigInt(0) &&
            !computed.isFeeLoading
              ? computed.nativeFee
              : undefined
          }
          isCrossChain={computed.isCrossChain}
        />

        <ActionButton
          variant="borrow"
          onClick={actions.handleAction}
          disabled={computed.isButtonDisabled}
          isLoading={computed.isLoading}
          loadingText={actions.getButtonLabel()}
          fullWidth
        >
          {actions.getButtonLabel()}
        </ActionButton>
      </div>
    </RequirePosition>
  );
};
