import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUserWalletBalance } from "@/hooks/balance/use-user-token-balance";
import { useCollateralBalanceUser } from "@/hooks/balance/use-collateral-balance-user";
import { useReadUserSupplyBalance } from "@/hooks/balance/use-user-supply-balance";

interface AmountSectionProps {
  actionLabel: string;
  assetSymbol: string;
  assetLogoUrl?: string | undefined;
  amount: string;
  onAmountChange: (value: string) => void;
  tokenAddress: `0x${string}`;
  decimals: number;
  onMaxClick?: (() => void) | undefined;
  poolAddress?: `0x${string}` | undefined;
  balanceType?: "wallet" | "collateral" | "supply" | undefined;
}

export const AmountSection = ({
  actionLabel,
  assetSymbol,
  assetLogoUrl,
  amount,
  onAmountChange,
  tokenAddress,
  decimals,
  onMaxClick,
  poolAddress,
  balanceType = "wallet",
}: AmountSectionProps) => {
  const { userWalletBalanceFormatted, walletBalanceLoading } =
    useUserWalletBalance(tokenAddress, decimals);

  const { userCollateralBalanceFormatted, userCollateralBalanceLoading } =
    useCollateralBalanceUser(
      poolAddress!,
      tokenAddress,
      decimals
    );

  const { userSupplyBalanceFormatted, userSupplyBalanceLoading } =
    useReadUserSupplyBalance(
      poolAddress!,
      tokenAddress,
      decimals
    );

  const displayBalance =
    balanceType === "collateral"
      ? userCollateralBalanceFormatted
      : balanceType === "supply"
        ? userSupplyBalanceFormatted
        : userWalletBalanceFormatted;

  const isBalanceLoading =
    balanceType === "collateral"
      ? userCollateralBalanceLoading
      : balanceType === "supply"
        ? userSupplyBalanceLoading
        : walletBalanceLoading;

  const balanceLabel =
    balanceType === "collateral"
      ? "Collateral"
      : balanceType === "supply"
        ? "Supply"
        : "Wallet";

  const handleMaxClick = () => {
    if (onMaxClick) {
      onMaxClick();
    } else {
      onAmountChange(displayBalance || "0");
    }
  };

  return (
    <div className="pool-card-section space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-tertiary">
          {actionLabel} {assetSymbol}
        </span>
        {assetLogoUrl && (
          <Image
            src={assetLogoUrl}
            alt={assetSymbol}
            width={24}
            height={24}
            className="h-6 w-6 rounded-full"
          />
        )}
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.00"
          className="pool-card-input"
        />
        <Button
          type="button"
          onClick={handleMaxClick}
          className="btn-secondary"
        >
          MAX
        </Button>
      </div>

      <span className="text-[11px] text-text-muted">
        {balanceLabel}:{" "}
        {isBalanceLoading
          ? "Loading..."
          : `${displayBalance} ${assetSymbol}`}
      </span>
    </div>
  );
};
