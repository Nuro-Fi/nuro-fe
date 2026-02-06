"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { helperAbi } from "@/lib/abis/helper-abi";
import { Address, pad } from "viem";

export type SendParam = {
  readonly dstEid: number;
  readonly to: `0x${string}`; // bytes32 format
  readonly amountLD: bigint;
  readonly minAmountLD: bigint;
  readonly extraOptions: `0x${string}`;
  readonly composeMsg: `0x${string}`;
  readonly oftCmd: `0x${string}`;
};

export type MessagingFee = {
  readonly nativeFee: bigint;
  readonly lzTokenFee: bigint;
};

export type BorrowParams = {
  readonly sendParam: SendParam;
  readonly fee: MessagingFee;
  readonly amount: bigint;
  readonly chainId: bigint;
  readonly addExecutorLzReceiveOption: bigint;
};

interface UseGetFeeParams {
  helperAddress: Address;
  lendingPool: Address;
  userAddress: Address;
  amount: bigint;
  destEid: number;
  destChainId: bigint;
  payInLzToken?: boolean;
  addExecutorLzReceiveOption?: bigint;
  enabled?: boolean;
}

export const getFeeKeys = {
  all: ["getFee"] as const,
  fee: (params: {
    helperAddress: string;
    lendingPool: string;
    userAddress: string;
    amount: string; 
    destEid: number;
    destChainId: string; 
    payInLzToken: boolean;
    addExecutorLzReceiveOption: string; 
  }) => [...getFeeKeys.all, params] as const,
};

export function useGetFee({
  helperAddress,
  lendingPool,
  userAddress,
  amount,
  destEid,
  destChainId,
  payInLzToken = false,
  addExecutorLzReceiveOption = BigInt(0),
  enabled = true,
}: UseGetFeeParams) {
  const buildBorrowParams = (): BorrowParams => ({
    sendParam: {
      dstEid: destEid,
      to: pad(userAddress, { size: 32 }), // Convert address to bytes32
      amountLD: amount,
      minAmountLD: BigInt(0), 
      extraOptions: "0x" as const,
      composeMsg: "0x" as const,
      oftCmd: "0x" as const,
    },
    fee: {
      nativeFee: BigInt(0),
      lzTokenFee: BigInt(0),
    },
    amount,
    chainId: destChainId,
    addExecutorLzReceiveOption,
  });

  const isEnabled =
    enabled &&
    !!helperAddress &&
    !!lendingPool &&
    !!userAddress &&
    amount > BigInt(0);

  const { data, isLoading, isError, error, refetch } = useQuery({
    // Convert BigInt to string in query key for serialization
    queryKey: getFeeKeys.fee({
      helperAddress,
      lendingPool,
      userAddress,
      amount: amount.toString(),
      destEid,
      destChainId: destChainId.toString(),
      payInLzToken,
      addExecutorLzReceiveOption: addExecutorLzReceiveOption.toString(),
    }),
    queryFn: async () => {
      const borrowParams = buildBorrowParams();

      const result = await readContract(config, {
        address: helperAddress,
        abi: helperAbi,
        functionName: "getFee",
        args: [borrowParams, lendingPool, payInLzToken],
      });

      return result;
    },
    refetchOnWindowFocus: false,
    enabled: isEnabled,
    staleTime: 30_000, 
    gcTime: 60_000, 
  });

  const borrowParams = buildBorrowParams();

  return {
    nativeFee: data?.[0] ?? BigInt(0),
    lzTokenFee: data?.[1] ?? BigInt(0),
    borrowParams, 
    isLoading,
    isError,
    error,
    refetch,
  };
}
