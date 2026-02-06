import { routerAbi } from "@/lib/abis/router-abi";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { HexAddress } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { zeroAddress } from "viem";
import { useConnection, usePublicClient } from "wagmi";

export const positionAddressKeys = QUERY_KEYS.positionAddress;

const useReadPosition = (routerAddress: string) => {
  const { address } = useConnection();
  const publicClient = usePublicClient();

  const query = useQuery({
    queryKey: positionAddressKeys.byRouter(routerAddress, address || ""),
    queryFn: async () => {
      if (!publicClient || !address) return null;

      const positionAddress = await publicClient.readContract({
        abi: routerAbi,
        address: routerAddress as HexAddress,
        functionName: "addressPositions",
        args: [address],
      });

      return positionAddress;
    },
    enabled: !!routerAddress && !!address && !!publicClient,
    staleTime: 1000 * 60, // 1 minute cache
  });

  const positionAddress = query.data;
  const hasPosition = !!positionAddress && positionAddress !== zeroAddress;

  return {
    ...query,
    positionAddress: hasPosition ? positionAddress : undefined,
    hasPosition,
  };
};

export default useReadPosition;
