import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";
import { CHAIN_IDS } from "@/lib/constants/chains";

export interface PoolRate {
  lendingPoolBaseRate: string;
  lendingPoolRateAtOptimal: string;
  lendingPoolOptimalUtilization: string;
  lendingPoolMaxRate: string;
  tokenReserveFactor: string;
  totalBorrowAssets: string;
  totalReserveAssets: string;
  totalLiquidity: string;
  totalSupplyAssets: string;
  utilizationRate: string;
  borrowRate: string;
  supplyRate: string;
  apy: string;
}

const fetchPoolRate = async (poolAddress: string): Promise<PoolRate> => {
  let url = `/api/pool-rate/${CHAIN_IDS.ARC}/${poolAddress}`;

  if (typeof window === "undefined") {
    if (process.env.POOL_API_URL) {
      url = `${process.env.POOL_API_URL}/lendingPoolRate/${CHAIN_IDS.ARC}/${poolAddress}`;
    } else {
      return {
        lendingPoolBaseRate: "0",
        lendingPoolRateAtOptimal: "0",
        lendingPoolOptimalUtilization: "0",
        lendingPoolMaxRate: "0",
        tokenReserveFactor: "0",
        totalBorrowAssets: "0",
        totalReserveAssets: "0",
        totalLiquidity: "0",
        totalSupplyAssets: "0",
        utilizationRate: "0",
        borrowRate: "0",
        supplyRate: "0",
        apy: "0",
      };
    }
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch pool rate: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const usePoolRateByAddress = (
  poolAddress: string | undefined | null,
) => {
  return useQuery<PoolRate | null, Error>({
    queryKey: ["poolRate", poolAddress],
    queryFn: async () => {
      if (!poolAddress) return null;
      try {
        return await fetchPoolRate(poolAddress);
      } catch (err) {
        throw err as Error;
      }
    },
    enabled: !!poolAddress,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

export const useMultiplePoolRates = (poolAddresses: string[]) => {
  return useQuery<Record<string, PoolRate>, Error>({
    queryKey: ["poolRates", poolAddresses],
    queryFn: async () => {
      const results: Record<string, PoolRate> = {};

      await Promise.all(
        poolAddresses.map(async (address) => {
          try {
            const rate = await fetchPoolRate(address);
            results[address.toLowerCase()] = rate;
          } catch (err) {
            console.error(`Failed to fetch rate for ${address}:`, err);
          }
        }),
      );

      return results;
    },
    enabled: poolAddresses.length > 0,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

export const formatApy = (apy: string): number => {
  try {
    const formatted = formatUnits(BigInt(apy), 16);
    return parseFloat(formatted);
  } catch {
    return 0;
  }
};

export const formatInterestRate = (rate: string): number => {
  try {
    const formatted = formatUnits(BigInt(rate), 16);
    return parseFloat(formatted);
  } catch {
    return 0;
  }
};

export const formatTotalSupply = (total: string, decimals: number): number => {
  try {
    const formatted = formatUnits(BigInt(total), decimals);
    return parseFloat(formatted);
  } catch {
    return 0;
  }
};

export const formatTotalBorrow = (total: string, decimals: number): number => {
  try {
    const formatted = formatUnits(BigInt(total), decimals);
    return parseFloat(formatted);
  } catch {
    return 0;
  }
};
