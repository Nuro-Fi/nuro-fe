import { getTokensArray } from "@/lib/addresses/tokens";
import { Network } from "@/lib/addresses/types";

export const FAUCET_TOKENS = getTokensArray(Network.ARC).filter(
  (token) => token.address !== "0x0000000000000000000000000000000000000001",
);
