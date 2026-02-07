"use client";

import type { FaucetListProps } from "./types";
import { FaucetTable } from "./components/faucet-table";

export const FaucetList = ({ userAddress }: FaucetListProps) => {
  return <FaucetTable userAddress={userAddress} />;
};

export default FaucetList;
