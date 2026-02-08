export type Address = `0x${string}`;

export enum Network {
  ARC = "arc",
}

export interface TokenConfig {
  name: string;
  symbol: string;
  logo: string;
  decimals: number;
  address: Address;
}

export enum TokenSymbol {
  mUSDC = "mUSDC",
  mUSDT = "mUSDT",
  mEURC = "mEURC",
}

export type TokensConfig = {
  [key in TokenSymbol]: TokenConfig;
};

export interface ContractAddresses {
  FACTORY: Address;
  HELPER: Address;
}
