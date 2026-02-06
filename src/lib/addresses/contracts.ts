import { Network, ContractAddresses } from "./types";

export const CONTRACT_ADDRESSES: Record<Network, ContractAddresses> = {
  [Network.ARC]: {
    FACTORY: "0x0000000000000000000000000000000000000000", 
    HELPER: "0x0000000000000000000000000000000000000000", 
  },
};

export const getContractAddress = (
  network: Network,
  contractName: keyof ContractAddresses,
): string | undefined => {
  return CONTRACT_ADDRESSES[network][contractName];
};

export const getContractAddresses = (network: Network): ContractAddresses => {
  return CONTRACT_ADDRESSES[network];
};
