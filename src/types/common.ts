export type HexAddress = `0x${string}`;
export type TxHash = HexAddress;
export type PoolAddress = HexAddress;
export type TokenAddress = HexAddress;
export type TxStatus = "idle" | "loading" | "success" | "error";
export type TokenAmount = string & { readonly __brand: "TokenAmount" };
export type Percentage = number & { readonly __brand: "Percentage" };
export type Decimals = number & { readonly __brand: "Decimals" };
