"use client";

import { useCircleWallet } from "@/contexts/circle-wallet-context";
import { useCallback } from "react";
import type { Address, Abi } from "viem";
import { formatEther } from "viem";

interface AbiInput {
  type: string;
  name?: string;
  components?: AbiInput[];
}

interface AbiFunction {
  type: string;
  name: string;
  inputs: AbiInput[];
}

interface WriteContractParams<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
> {
  address: Address;
  abi: TAbi;
  functionName: TFunctionName;
  args?: readonly unknown[];
  value?: bigint;
}

// Build type signature from ABI input, handling tuples recursively
function buildTypeSignature(input: AbiInput): string {
  if (input.type === 'tuple' && input.components) {
    const innerTypes = input.components.map(buildTypeSignature).join(',');
    return `(${innerTypes})`;
  }
  if (input.type.startsWith('tuple[') && input.components) {
    const innerTypes = input.components.map(buildTypeSignature).join(',');
    const arrayPart = input.type.slice(5); // e.g., "[]" or "[3]"
    return `(${innerTypes})${arrayPart}`;
  }
  return input.type;
}

type CircleParam = string | CircleParam[];

// Convert argument to Circle API format, handling tuples/objects
// Returns string for primitives, array for tuples/arrays
function convertArgument(arg: unknown, input: AbiInput): CircleParam {
  if (arg === null || arg === undefined) {
    return '';
  }

  // Handle tuple types - convert object to array format
  if (input.type === 'tuple' && input.components && typeof arg === 'object' && !Array.isArray(arg)) {
    const obj = arg as Record<string, unknown>;
    return input.components.map((component) => {
      const value = obj[component.name!];
      return convertArgument(value, component);
    });
  }

  // Handle array of tuples
  if (input.type.startsWith('tuple[') && input.components && Array.isArray(arg)) {
    return arg.map((item) => {
      if (typeof item === 'object' && !Array.isArray(item)) {
        const obj = item as Record<string, unknown>;
        return input.components!.map((component) => {
          const value = obj[component.name!];
          return convertArgument(value, component);
        });
      }
      return String(item);
    });
  }

  // Handle arrays of primitives
  if (Array.isArray(arg)) {
    return arg.map((item) => {
      if (typeof item === 'bigint') return item.toString();
      if (typeof item === 'number') return item.toString();
      if (typeof item === 'boolean') return item.toString();
      return String(item);
    });
  }

  // Handle bigint
  if (typeof arg === 'bigint') {
    return arg.toString();
  }

  // Handle number
  if (typeof arg === 'number') {
    return arg.toString();
  }

  // Handle boolean
  if (typeof arg === 'boolean') {
    return arg.toString();
  }

  return String(arg);
}

export function useCircleWriteContract() {
  const { isConnected, walletId, loginResult, executeTransaction } =
    useCircleWallet();

  const writeContract = useCallback(
    async <TAbi extends Abi | readonly unknown[], TFunctionName extends string>({
      address: contractAddress,
      abi,
      functionName,
      args,
      value = BigInt(0),
    }: WriteContractParams<TAbi, TFunctionName>): Promise<`0x${string}`> => {
      if (!isConnected || !walletId || !loginResult) {
        throw new Error("Circle wallet not connected");
      }

      // Find the function in the ABI
      const abiItem = (abi as readonly unknown[]).find(
        (item: unknown) => 
          typeof item === 'object' && 
          item !== null && 
          'type' in item && 
          (item as { type: string }).type === 'function' && 
          'name' in item && 
          (item as { name: string }).name === functionName
      ) as AbiFunction | undefined;

      if (!abiItem) {
        throw new Error(`Function ${functionName} not found in ABI`);
      }

      // Build function signature handling tuple types
      const paramTypes = abiItem.inputs.map(buildTypeSignature).join(',');
      const abiFunctionSignature = `${functionName}(${paramTypes})`;

      // Convert args to Circle API format
      const argsArray = args || [];
      const abiParameters = abiItem.inputs.map((input, index) => {
        return convertArgument(argsArray[index], input);
      });

      const response = await fetch("/api/endpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createTransaction",
          userToken: loginResult.userToken,
          walletId,
          contractAddress,
          abiFunctionSignature,
          abiParameters,
          value: formatEther(value),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create transaction");
      }

      const { challengeId } = result;

      const success = await executeTransaction(challengeId);
      
      if (!success) {
        throw new Error("Transaction failed or was rejected");
      }

      // Return a placeholder hash since Circle SDK doesn't provide it
      return "0x0000000000000000000000000000000000000000000000000000000000000001" as `0x${string}`;
    },
    [isConnected, walletId, loginResult, executeTransaction],
  );

  return {
    writeContract,
    isConnected,
  };
}

export function useCircleSendTransaction() {
  const { isConnected, walletId, loginResult, executeTransaction } =
    useCircleWallet();

  const sendTransaction = useCallback(
    async ({ to, amount }: { to: Address; amount: bigint }): Promise<`0x${string}`> => {
      if (!isConnected || !walletId || !loginResult) {
        throw new Error("Circle wallet not connected");
      }

      const response = await fetch("/api/endpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendTransaction",
          userToken: loginResult.userToken,
          walletId,
          to,
          amount: amount.toString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create transaction");
      }

      const { challengeId } = result;
      const success = await executeTransaction(challengeId);
      
      if (!success) {
        throw new Error("Transaction failed or was rejected");
      }

      // Return a placeholder hash since Circle SDK doesn't provide it
      return "0x0000000000000000000000000000000000000000000000000000000000000001" as `0x${string}`;
    },
    [isConnected, walletId, loginResult, executeTransaction],
  );

  return {
    sendTransaction,
    isConnected,
  };
}
