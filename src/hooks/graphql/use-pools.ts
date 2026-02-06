import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { graphClient } from "@/lib/graphql/client";
import { queryPools } from "@/lib/graphql/pool.query";
import { getTokenByAddress, type Token } from "../../../public/tokens";

interface RawPool {
  lendingPool: string;
  collateralToken: string;
  borrowToken: string;
  ltv: string;
  baseRate: string;
  liquidationBonus: string;
  liquidationThreshold: string;
  maxRate: string;
  maxUtilization: string;
  optimalUtilization: string;
  rateAtOptimal: string;
  router: string;
}

export interface PoolWithTokens extends RawPool {
  collateral: Token & { address: string };
  borrow: Token & { address: string };
}

const fetchPools = async (): Promise<PoolWithTokens[]> => {
  const query = queryPools();

  const data = await graphClient.request<{
    lendingPoolCreateds: { items: RawPool[] };
  }>(query);

  const pools = data.lendingPoolCreateds.items || [];

  return pools
    .map((pool) => {
      const collateral = getTokenByAddress(pool.collateralToken);
      const borrow = getTokenByAddress(pool.borrowToken);

      if (!collateral || !borrow) return null;

      return {
        ...pool,
        collateral,
        borrow,
      };
    })
    .filter((p): p is PoolWithTokens => p !== null);
};

export const usePools = () => {
  return useQuery<PoolWithTokens[], Error>({
    queryKey: ["pools"],
    queryFn: async () => {
      try {
        return await fetchPools();
      } catch (err) {
        throw err as Error;
      }
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

type PoolByAddressResult = Omit<
  UseQueryResult<PoolWithTokens[], Error>,
  "data"
> & {
  data: PoolWithTokens | null;
};

export const usePoolByAddress = (
  poolAddress: string | undefined | null,
): PoolByAddressResult => {
  const poolsQuery = usePools();
  const { data: pools, ...rest } = poolsQuery;

  const normalized = poolAddress?.toLowerCase();
  const pool =
    normalized && pools
      ? (pools.find((p) => p.lendingPool.toLowerCase() === normalized) ?? null)
      : null;

  return {
    ...rest,
    data: pool,
  };
};
