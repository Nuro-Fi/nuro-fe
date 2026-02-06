import { zeroAddress } from "viem";

export const NATIVE_TOKEN_ALT =
  "0x0000000000000000000000000000000000000001";

export const isNativeTokenAddress = (address: string) => {
  const a = address.toLowerCase();
  return a === zeroAddress.toLowerCase() || a === NATIVE_TOKEN_ALT.toLowerCase();
};

export const formatTokenAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;
