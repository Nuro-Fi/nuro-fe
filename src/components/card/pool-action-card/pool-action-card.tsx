import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { PoolActionCardProps, Tab } from "./types";
import { ActionTabs } from "./ui/action-tabs";
import { SupplyContent } from "./content/supply/supply-content";
import { BorrowContent } from "./content/borrow/borrow-content";
import { WithdrawContent } from "./content/withdraw/withdraw-content";
import { RepayContent } from "./content/repay/repay-content";
import { ConnectionGuard } from "@/components/wallet/connection-guard";

export const PoolActionCard = ({
  poolAddress,
  collateralTokenAddress,
  borrowTokenAddress,
  collateralSymbol,
  borrowSymbol,
  collateralLogoUrl,
  borrowLogoUrl,
  borrowTokenDecimals = 18,
  collateralTokenDecimals = 18,
  ltv,
  liquidationThreshold,
}: PoolActionCardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("Supply");

  const contentProps = {
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
    liquidationThreshold,
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Supply":
        return <SupplyContent {...contentProps} />;
      case "Borrow":
        return <BorrowContent {...contentProps} />;
      case "Withdraw":
        return <WithdrawContent {...contentProps} />;
      case "Repay":
        return <RepayContent {...contentProps} />;
      default:
        return null;
    }
  };

  return (
    <Card className="flex h-full w-104 flex-col rounded-2xl border-white/10 bg-white/3 gap-0 p-4">
      <ActionTabs activeTab={activeTab} onChange={setActiveTab} />
      <CardContent className="flex flex-1 flex-col gap-3 p-0">
        <ConnectionGuard
          promptTitle="Connect Wallet"
          promptDescription="Connect your wallet to supply, borrow, withdraw, or repay assets."
        >
          {renderContent()}
        </ConnectionGuard>
      </CardContent>
    </Card>
  );
};

export default PoolActionCard;

export type { PoolActionCardProps, Tab, Mode, RepayMode } from "./types";
