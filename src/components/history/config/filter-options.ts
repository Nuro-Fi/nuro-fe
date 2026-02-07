import type { TransactionType } from "@/hooks/graphql/use-history";

export const FILTER_OPTIONS: {
  value: TransactionType | "all";
  label: string;
}[] = [
  { value: "all", label: "All Transactions" },
  { value: "supply_collateral", label: "Supply Collateral" },
  { value: "supply_liquidity", label: "Supply Liquidity" },
  { value: "withdraw_collateral", label: "Withdraw Collateral" },
  { value: "withdraw_liquidity", label: "Withdraw Liquidity" },
  { value: "borrow", label: "Borrow" },
  { value: "repay", label: "Repay" },
  { value: "crosschain_borrow", label: "Cross-Chain Borrow" },
  { value: "liquidation", label: "Liquidation" },
];
