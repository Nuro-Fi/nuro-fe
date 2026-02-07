import useReadPosition from "@/hooks/address/use-read-position";
import { usePoolByAddress } from "@/hooks/graphql/use-pools";

export interface PositionStatus {
  hasPosition: boolean;
  positionAddress: string | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useRequirePosition = (
  lendingPoolAddress: string | undefined | null,
): PositionStatus => {
  const {
    data: pool,
    isLoading: isLoadingPool,
    error: poolError,
  } = usePoolByAddress(lendingPoolAddress);
  const routerAddress = pool?.router;

  const {
    positionAddress,
    hasPosition,
    isLoading: isLoadingPosition,
    error: positionError,
  } = useReadPosition(routerAddress || "");

  return {
    hasPosition,
    positionAddress,
    isLoading: isLoadingPool || isLoadingPosition,
    isError: !!poolError || !!positionError,
    error: poolError || positionError || null,
  };
};

export default useRequirePosition;
