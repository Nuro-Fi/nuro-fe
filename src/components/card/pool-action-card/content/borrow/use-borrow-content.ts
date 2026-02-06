import { useState, useMemo, useCallback } from "react";
import { useBorrow } from "@/hooks/mutation/use-borrow";
import { useBorrowCrossChain } from "@/hooks/mutation/use-borrow-crosschain";
import { useGetFee } from "@/hooks/use-get-fee";
import { useSimulatedHealthFactor } from "@/hooks/use-health-factor";
import { useMaxBorrowAmount } from "@/hooks/use-max-borrow-amount";
import { parseUnits } from "viem";
import {
  DEFAULT_CHAIN,
  CONTRACT_ADDRESSES,
  CHAIN_IDS,
  type CrossChainConfig,
} from "@/lib/constants/chains";
import type { HexAddress } from "@/types";
import { zeroAddress } from "viem";

interface UseBorrowContentParams {
  poolAddress: string;
  borrowTokenDecimals: number;
  userAddress: HexAddress | undefined;
  ltv?: string;
  liquidationThreshold?: string;
}

const parsePct = (value?: string): number | undefined => {
  if (!value) return undefined;
  const n = parseFloat(value.replace("%", ""));
  return Number.isFinite(n) ? n : undefined;
};

export const useBorrowContent = ({
  poolAddress,
  borrowTokenDecimals,
  userAddress,
  ltv,
  liquidationThreshold,
}: UseBorrowContentParams) => {
  const [amount, setAmount] = useState("");
  const [selectedChain, setSelectedChain] = useState<CrossChainConfig | null>(
    DEFAULT_CHAIN,
  );

  const borrow = useBorrow();
  const borrowCrossChain = useBorrowCrossChain();

  const { maxBorrowAmountRaw, maxBorrowAmountFormatted } = useMaxBorrowAmount({
    lendingPoolAddress: poolAddress as HexAddress,
    userAddress,
    tokenDecimals: borrowTokenDecimals,
    enabled: !!userAddress,
  });

  const ltvPct = parsePct(ltv);
  const ltPct = parsePct(liquidationThreshold);

  const canSimulateBorrow = Boolean(
    maxBorrowAmountRaw &&
      maxBorrowAmountRaw > BigInt(0) &&
      ltvPct &&
      ltvPct > 0 &&
      ltPct &&
      ltPct > 0,
  );

  const simulatedAmount = canSimulateBorrow ? amount : "";

  const { after: healthFactorAfter } = useSimulatedHealthFactor(
    userAddress,
    poolAddress as HexAddress,
    simulatedAmount,
    borrowTokenDecimals,
    "borrow",
    undefined,
    ltvPct,
    ltPct,
    maxBorrowAmountRaw ?? undefined,
  );

  const isCrossChain = useMemo(() => {
    if (!selectedChain) return false;
    return Number(selectedChain.chainId) !== CHAIN_IDS.ARC;
  }, [selectedChain]);

  const amountBigInt =
    amount && parseFloat(amount) > 0
      ? parseUnits(amount, borrowTokenDecimals)
      : BigInt(0);

  const {
    nativeFee,
    borrowParams,
    isLoading: isFeeLoading,
  } = useGetFee({
    helperAddress: CONTRACT_ADDRESSES.HELPER,
    lendingPool: poolAddress as HexAddress,
    userAddress: (userAddress || zeroAddress) as HexAddress,
    amount: amountBigInt,
    destEid: selectedChain?.destEid || DEFAULT_CHAIN.destEid,
    destChainId: selectedChain?.chainId || DEFAULT_CHAIN.chainId,
    enabled: isCrossChain && !!userAddress && amountBigInt > BigInt(0),
  });

  const isLoading =
    borrow.status === "loading" || borrowCrossChain.status === "loading";
  const getButtonLabel = useCallback(() => {
    if (isLoading) {
      return isCrossChain ? "Borrowing Cross-Chain" : "Borrowing";
    }
    return isCrossChain ? "Borrow Cross-Chain" : "Borrow";
  }, [isLoading, isCrossChain]);

  const isButtonDisabled =
    !amount ||
    parseFloat(amount) <= 0 ||
    isLoading ||
    !selectedChain ||
    (isCrossChain && isFeeLoading);

  const handleAction = useCallback(() => {
    if (!amount || parseFloat(amount) <= 0) return;

    if (isCrossChain) {
      borrowCrossChain.mutation.mutate(
        {
          poolAddress: poolAddress as HexAddress,
          borrowParams,
          nativeFee,
        },
        { onSuccess: () => setAmount("") },
      );
    } else {
      borrow.mutation.mutate(
        {
          poolAddress: poolAddress as HexAddress,
          amount,
          decimals: borrowTokenDecimals,
        },
        { onSuccess: () => setAmount("") },
      );
    }
  }, [
    amount,
    isCrossChain,
    borrowCrossChain.mutation,
    borrow.mutation,
    poolAddress,
    borrowParams,
    nativeFee,
    borrowTokenDecimals,
  ]);

  return {
    state: { amount, selectedChain },
    computed: {
      isCrossChain,
      isLoading,
      isButtonDisabled,
      healthFactorAfter,
      nativeFee,
      isFeeLoading,
      maxBorrowAmountFormatted,
    },
    actions: { setAmount, setSelectedChain, handleAction, getButtonLabel },
  };
};
