"use client";
import { useConnection } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { getBalance } from "wagmi/actions";
import { config } from "@/lib/config";
import type { HexAddress } from "@/types/types";

const useUserBalance = () => {
  const { address } = useConnection();

  const { data, isPending, isError } = useQuery({
    queryKey: ["balance", address],
    queryFn: async () => {
      if (!address) return null;
      return await getBalance(config, { address: address as HexAddress });
    },
    enabled: !!address,
    refetchInterval: 10000,
    staleTime: 5000,
  });

  return {
    address: address as HexAddress,
    balance: data?.value,
    decimals: data?.decimals,
    symbol: data?.symbol,
    isPending,
    isError,
  };
};

export default useUserBalance;
