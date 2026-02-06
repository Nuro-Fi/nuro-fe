"use client";

import { useRouter, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PoolsTableContainer } from "@/components/table/pools/pools-table-container";
import { PoolsTableContent } from "@/components/table/pools/pools-table-content";
import { PoolsTableEmpty } from "@/components/table/pools/pools-table-empty";
import { PoolsTableError } from "@/components/table/pools/pools-table-error";
import { PoolTableSkeleton } from "@/components/skeleton/pool-table-skeleton";
import { usePools } from "@/hooks/graphql/use-pools";
import { useMultiplePoolRates } from "@/hooks/graphql/use-pool-rates";
import { formatInterestRate } from "@/hooks/graphql/use-pool-rates";
import type {
  PoolSortColumn,
  PoolSortOption,
  PoolTableSort,
} from "./pools-table-types";
import { formatUnits } from "viem";
import { DEFAULT_CHAIN } from "@/lib/constants/chains";

export const PoolsTable = () => {
  const router = useRouter();
  const { data, isLoading, isError } = usePools();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PoolSortOption>("popular");
  const [tokenFilter, setTokenFilter] = useState<string>("all");
  const [tableSort, setTableSort] = useState<PoolTableSort | null>(null);

  const poolAddresses = useMemo(() => {
    return data?.map((pool) => pool.lendingPool) || [];
  }, [data]);

  const { data: rates, isLoading: isLoadingRates } =
    useMultiplePoolRates(poolAddresses);

  const tokenOptions = useMemo(() => {
    const map = new Map<string, string>();

    for (const pool of data || []) {
      if (pool.collateral?.address) {
        map.set(pool.collateral.address.toLowerCase(), pool.collateral.symbol);
      }
      if (pool.borrow?.address) {
        map.set(pool.borrow.address.toLowerCase(), pool.borrow.symbol);
      }
    }

    const options = Array.from(map.entries())
      .map(([address, symbol]) => ({ value: address, label: symbol }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return [{ value: "all", label: "All Tokens" }, ...options];
  }, [data]);

  const effectiveSort = useMemo(() => {
    if (tableSort) return tableSort;

    switch (filter) {
      case "highest-liquidity":
        return { column: "liquidity", direction: "desc" } as const;
      case "lowest-liquidity":
        return { column: "liquidity", direction: "asc" } as const;
      case "highest-apy":
        return { column: "apy", direction: "desc" } as const;
      case "lowest-apy":
        return { column: "apy", direction: "asc" } as const;
      case "popular":
        return { column: "borrowed", direction: "desc" } as const;
      case "custom":
        return tableSort;
      case "latest":
      default:
        return null;
    }
  }, [filter, tableSort]);

  const filteredAndSortedData = useMemo(() => {
    const query = search.trim().toLowerCase();
    let filtered = data || [];

    if (query) {
      filtered = filtered.filter((pool) => {
        const pair =
          `${pool.collateral.symbol}/${pool.borrow.symbol}`.toLowerCase();
        const address = pool.lendingPool.toLowerCase();
        return pair.includes(query) || address.includes(query);
      });
    }

    if (tokenFilter !== "all") {
      filtered = filtered.filter((pool) => {
        return (
          pool.collateral.address.toLowerCase() === tokenFilter ||
          pool.borrow.address.toLowerCase() === tokenFilter
        );
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      const rateA = rates?.[a.lendingPool];
      const rateB = rates?.[b.lendingPool];

      if (!effectiveSort) {
        if (filter === "latest") {
          return b.lendingPool.localeCompare(a.lendingPool);
        }
        return 0;
      }

      const dir = effectiveSort.direction === "asc" ? 1 : -1;

      const num = (v: number) => (Number.isFinite(v) ? v : 0);

      const getLiquidity = (pool: typeof a, rate: typeof rateA) =>
        rate?.totalLiquidity
          ? parseFloat(
              formatUnits(BigInt(rate.totalLiquidity), pool.borrow.decimals),
            )
          : 0;

      const getBorrowed = (pool: typeof a, rate: typeof rateA) =>
        rate?.totalBorrowAssets
          ? parseFloat(
              formatUnits(BigInt(rate.totalBorrowAssets), pool.borrow.decimals),
            )
          : 0;

      const getApy = (rate: typeof rateA) =>
        rate?.apy ? formatInterestRate(rate.apy) : 0;

      const getBorrowApy = (rate: typeof rateA) =>
        rate?.borrowRate ? formatInterestRate(rate.borrowRate) : 0;

      const getLtv = (pool: typeof a) => {
        const n = Number(pool.ltv);
        if (!Number.isFinite(n)) return 0;
        return n / 1e18;
      };

      switch (effectiveSort.column) {
        case "pool": {
          const pairA = `${a.collateral.symbol}/${a.borrow.symbol}`;
          const pairB = `${b.collateral.symbol}/${b.borrow.symbol}`;
          return pairA.localeCompare(pairB) * dir;
        }
        case "liquidity": {
          const vA = num(getLiquidity(a, rateA));
          const vB = num(getLiquidity(b, rateB));
          return (vA - vB) * dir;
        }
        case "apy": {
          const vA = num(getApy(rateA));
          const vB = num(getApy(rateB));
          return (vA - vB) * dir;
        }
        case "borrowed": {
          const vA = num(getBorrowed(a, rateA));
          const vB = num(getBorrowed(b, rateB));
          return (vA - vB) * dir;
        }
        case "borrowApy": {
          const vA = num(getBorrowApy(rateA));
          const vB = num(getBorrowApy(rateB));
          return (vA - vB) * dir;
        }
        case "ltv": {
          const vA = num(getLtv(a));
          const vB = num(getLtv(b));
          return (vA - vB) * dir;
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [data, search, rates, filter, tokenFilter, effectiveSort]);

  const params = useParams();
  const chain = (params?.chain as string) || DEFAULT_CHAIN.slug;

  const handlePoolClick = (poolAddress: string) => {
    router.push(`/${chain}/markets/${poolAddress}`);
  };

  const handleSortChange = (column: PoolSortColumn) => {
    setFilter("custom");

    setTableSort((prev) => {
      const previous = prev || effectiveSort;

      if (previous?.column === column) {
        return {
          column,
          direction: previous.direction === "asc" ? "desc" : "asc",
        };
      }

      const defaultDirection = column === "pool" ? "asc" : "desc";
      return { column, direction: defaultDirection };
    });
  };

  const handleFilterChange = (next: PoolSortOption) => {
    setFilter(next);

    // Clear custom table sort when user selects a preset.
    if (next !== "custom") {
      setTableSort(null);
    }
  };

  if (isLoading || isLoadingRates) {
    return (
      <PoolsTableContainer
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={handleFilterChange}
        tokenFilter={tokenFilter}
        tokenOptions={tokenOptions}
        onTokenFilterChange={setTokenFilter}
      >
        <PoolTableSkeleton />
      </PoolsTableContainer>
    );
  }

  if (isError) {
    return (
      <PoolsTableContainer
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={handleFilterChange}
        tokenFilter={tokenFilter}
        tokenOptions={tokenOptions}
        onTokenFilterChange={setTokenFilter}
      >
        <PoolsTableError />
      </PoolsTableContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <PoolsTableContainer
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={handleFilterChange}
        tokenFilter={tokenFilter}
        tokenOptions={tokenOptions}
        onTokenFilterChange={setTokenFilter}
      >
        <PoolsTableEmpty />
      </PoolsTableContainer>
    );
  }

  return (
    <PoolsTableContainer
      search={search}
      onSearchChange={setSearch}
      filter={filter}
      onFilterChange={handleFilterChange}
      tokenFilter={tokenFilter}
      tokenOptions={tokenOptions}
      onTokenFilterChange={setTokenFilter}
    >
      <PoolsTableContent
        pools={filteredAndSortedData}
        rates={rates}
        onPoolClick={handlePoolClick}
        sort={effectiveSort}
        onSortChange={handleSortChange}
      />
    </PoolsTableContainer>
  );
};

export default PoolsTable;
