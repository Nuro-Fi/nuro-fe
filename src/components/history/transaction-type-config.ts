import type { TransactionType } from "@/hooks/graphql/use-history";

export interface TransactionTypeConfig {
  label: string;
  color: string;
  bgColor: string;
}
export const TRANSACTION_TYPE_CONFIGS: Record<
  TransactionType,
  TransactionTypeConfig
> = {
  supply_collateral: {
    label: "Supply Collateral",
    color: "text-status-success",
    bgColor: "bg-status-success-bg border-status-success-border",
  },
  supply_liquidity: {
    label: "Earn",
    color: "text-status-success",
    bgColor: "bg-status-success-bg border-status-success-border",
  },
  withdraw_collateral: {
    label: "Withdraw Collateral",
    color: "text-status-warning",
    bgColor: "bg-status-warning-bg border-status-warning-border",
  },
  withdraw_liquidity: {
    label: "Withdraw Liquidity",
    color: "text-status-warning",
    bgColor: "bg-status-warning-bg border-status-warning-border",
  },
  borrow: {
    label: "Borrow",
    color: "text-status-info",
    bgColor: "bg-status-info-bg border-status-info-border",
  },
  repay: {
    label: "Repay",
    color: "text-status-secondary",
    bgColor: "bg-status-secondary-bg border-status-secondary-border",
  },
  crosschain_borrow: {
    label: "Cross-Chain Borrow",
    color: "text-status-accent",
    bgColor: "bg-status-accent-bg border-status-accent-border",
  },
  liquidation: {
    label: "Liquidation",
    color: "text-status-danger",
    bgColor: "bg-status-danger-bg border-status-danger-border",
  },
};

export const getTransactionTypeConfig = (
  type: TransactionType,
): TransactionTypeConfig => TRANSACTION_TYPE_CONFIGS[type];
