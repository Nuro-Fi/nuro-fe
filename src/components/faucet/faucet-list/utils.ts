export const formatBalance = (bal: string | number): string => {
  const num = typeof bal === "string" ? parseFloat(bal) : bal;
  if (num === 0) return "0";
  if (num < 0.0001) return "<0.0001";
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
  return num.toFixed(4);
};

export const formatBigIntBalance = (
  bal: bigint | undefined,
  decimals: number | undefined,
): string => {
  if (!bal || decimals === undefined) return "0";
  const num = Number(bal) / Math.pow(10, decimals);
  return formatBalance(num);
};
