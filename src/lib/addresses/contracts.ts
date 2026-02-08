import { Network, ContractAddresses } from "./types";

export const CONTRACT_ADDRESSES: Record<Network, ContractAddresses> = {
  [Network.ARC]: {
    FACTORY: "0xb0FCA55167f94D0f515877C411E0deb904321761", 
    HELPER: "0x6c454d20F4CB5f69e2D66693fA8deE931D7432dF", 
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
