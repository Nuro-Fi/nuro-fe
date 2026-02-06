import Image from "next/image";
import { AddressRow } from "./header-address";
import { useParams } from "next/navigation";
import { usePoolByAddress } from "@/hooks/graphql/use-pools";
import useReadPosition from "@/hooks/address/use-read-position";

const PoolHeader = () => {
  const params = useParams<{ poolAddress: string }>();
  const poolAddress = params.poolAddress;
  const { data: pool, isLoading: isPoolLoading } =
    usePoolByAddress(poolAddress);

  const { positionAddress } = useReadPosition(pool?.router || "");

  if (isPoolLoading) {
    return (
      <div className="flex h-20 items-center gap-4 animate-pulse">
        <div className="h-12 w-16 rounded bg-surface-secondary/50" />
        <div className="flex flex-col gap-2">
          <div className="h-6 w-32 rounded bg-surface-secondary/50" />
          <div className="h-4 w-48 rounded bg-surface-secondary/50" />
        </div>
      </div>
    );
  }

  if (!pool) return null;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-16">
          <div className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border border-border-primary bg-surface-primary">
            <Image
              src={pool.collateral.logoUrl}
              alt={pool.collateral.symbol}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full"
            />
          </div>
          <div className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border border-border-primary bg-surface-primary">
            <Image
              src={pool.borrow.logoUrl}
              alt={pool.borrow.symbol}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-text-heading">
            {pool.collateral.symbol} / {pool.borrow.symbol}
          </h1>
          <div className="mt-1 flex flex-col gap-1 text-xs text-text-disabled">
            <AddressRow label="Pool address" address={pool.lendingPool} />
            <AddressRow
              label="Router"
              address={pool.router}
              isLoading={false}
            />
            {positionAddress && (
              <AddressRow label="Position" address={positionAddress} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PoolHeader;
