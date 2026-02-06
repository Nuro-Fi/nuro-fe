import type { HexAddress } from "./types";

export const isHexAddress = (value: unknown): value is HexAddress => {
  return typeof value === "string" && /^0x[a-fA-F0-9]{40}$/.test(value);
};

export const isValidAmount = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  const num = parseFloat(value);
  return !isNaN(num) && num > 0 && isFinite(num);
};

export function assertHexAddress(
  value: unknown,
  name = "address"
): asserts value is HexAddress {
  if (!isHexAddress(value)) {
    throw new Error(`Invalid ${name}: expected hex address, got ${typeof value}`);
  }
}

export const asHexAddress = (value: string): HexAddress => {
  assertHexAddress(value);
  return value;
};
