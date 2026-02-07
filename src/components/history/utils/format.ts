export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatAddress = (address: string): string =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;
