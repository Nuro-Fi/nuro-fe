import { formatUnits, parseUnits } from "viem";

export function parseAmountToBigInt(amount: string, decimals: number): bigint {
  try {
    return parseUnits(amount, decimals);
  } catch (error) {
    console.error("Error parsing amount to BigInt:", error);
    return BigInt(0);
  }
}

export function formatBigIntToAmount(
  amount: bigint,
  decimals: number,
  maxDecimals?: number
): string {
  try {
    const formatted = formatUnits(amount, decimals);

    if (maxDecimals !== undefined) {
      const num = parseFloat(formatted);
      return num.toFixed(maxDecimals);
    }

    return formatted;
  } catch (error) {
    console.error("Error formatting BigInt to amount:", error);
    return "0";
  }
}

export function formatNumberWithCommas(
  value: string | number,
  decimals: number = 2
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "0";

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return "";
  if (address.length < chars * 2 + 2) return address;

  return `${address.substring(0, chars + 2)}...${address.substring(
    address.length - chars
  )}`;
}
