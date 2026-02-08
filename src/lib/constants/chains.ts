export interface CrossChainConfig {
  chainId: bigint;
  chainIdNumber: number;
  destEid: number;
  name: string;
  slug: string;
  logo: string;
  nativeCurrency: string;
  blockExplorer: string;
}

const ARC_CHAIN: CrossChainConfig = {
  chainId: BigInt(5042002),
  chainIdNumber: 5042002,
  destEid: 40258,
  name: "Arc Testnet",
  slug: "Arc",
  logo: "/chain/arc.png",
  nativeCurrency: "USDC",
  blockExplorer: "https://testnet.arcscan.app",
};

const BASE_SEPOLIA_CHAIN: CrossChainConfig = {
  chainId: BigInt(84532),
  chainIdNumber: 84532,
  destEid: 40245,
  name: "Base Sepolia",
  slug: "base-sepolia",
  logo: "/chain/base.svg",
  nativeCurrency: "ETH",
  blockExplorer: "https://sepolia.basescan.org",
};

export const SUPPORTED_CHAINS = {
  ARC: ARC_CHAIN,
  BASE_SEPOLIA: BASE_SEPOLIA_CHAIN,
} as const;

export type SupportedChainKey = keyof typeof SUPPORTED_CHAINS;

export const DEFAULT_CHAIN: CrossChainConfig = ARC_CHAIN;

export const CHAIN_IDS = {
  ARC: SUPPORTED_CHAINS.ARC.chainIdNumber,
  BASE_SEPOLIA: SUPPORTED_CHAINS.BASE_SEPOLIA.chainIdNumber,
} as const;

export const LAYERZERO_EIDS = {
  ARC: SUPPORTED_CHAINS.ARC.destEid,
  BASE_SEPOLIA: SUPPORTED_CHAINS.BASE_SEPOLIA.destEid,
} as const;

export const CHAIN_NAMES: Record<number, string> = {
  [SUPPORTED_CHAINS.ARC.chainIdNumber]: SUPPORTED_CHAINS.ARC.name,
  [SUPPORTED_CHAINS.BASE_SEPOLIA.chainIdNumber]:
    SUPPORTED_CHAINS.BASE_SEPOLIA.name,
  [SUPPORTED_CHAINS.ARC.destEid]: SUPPORTED_CHAINS.ARC.name,
  [SUPPORTED_CHAINS.BASE_SEPOLIA.destEid]: SUPPORTED_CHAINS.BASE_SEPOLIA.name,
};

export const EID_TO_CHAIN_ID: Record<number, number> = {
  [SUPPORTED_CHAINS.ARC.destEid]: SUPPORTED_CHAINS.ARC.chainIdNumber,
  [SUPPORTED_CHAINS.BASE_SEPOLIA.destEid]:
    SUPPORTED_CHAINS.BASE_SEPOLIA.chainIdNumber,
};

export const BLOCK_EXPLORERS: Record<number, string> = {
  [SUPPORTED_CHAINS.ARC.chainIdNumber]:
    SUPPORTED_CHAINS.ARC.blockExplorer,
  [SUPPORTED_CHAINS.BASE_SEPOLIA.chainIdNumber]:
    SUPPORTED_CHAINS.BASE_SEPOLIA.blockExplorer,
};

export const LAYERZERO_EXPLORER = "https://testnet.layerzeroscan.com";

export const CONTRACT_ADDRESSES = {
  HELPER: "0x6c454d20F4CB5f69e2D66693fA8deE931D7432dF" as const,
} as const;

export const getChainConfig = (key: SupportedChainKey): CrossChainConfig => {
  return SUPPORTED_CHAINS[key];
};

export const getAllChains = (): CrossChainConfig[] => {
  return Object.values(SUPPORTED_CHAINS);
};

export const getChainName = (chainIdOrEid: number): string => {
  return CHAIN_NAMES[chainIdOrEid] || `Chain ${chainIdOrEid}`;
};

export const getChainById = (chainId: number): CrossChainConfig | undefined => {
  return Object.values(SUPPORTED_CHAINS).find(
    (chain) => chain.chainIdNumber === chainId,
  );
};

export const getChainByEid = (eid: number): CrossChainConfig | undefined => {
  return Object.values(SUPPORTED_CHAINS).find((chain) => chain.destEid === eid);
};

export const getChainBySlug = (slug: string): CrossChainConfig | undefined => {
  return Object.values(SUPPORTED_CHAINS).find((chain) => chain.slug === slug);
};