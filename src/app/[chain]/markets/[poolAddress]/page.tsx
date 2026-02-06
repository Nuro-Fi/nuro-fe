import { Metadata } from "next";
import { PoolPage } from "@/components/pool/pool-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ poolAddress: string }>;
}): Promise<Metadata> {
  const { poolAddress } = await params;

  return {
    title: `Pool ${poolAddress.slice(0, 6)}...${poolAddress.slice(-4)} - nuro`,
    description: `View detailed information about lending pool ${poolAddress}. Check APY rates, total liquidity, borrow rates, and LTV.`,
  };
}

export default function HomePoolDetailRoute() {
  return <PoolPage />;
}
