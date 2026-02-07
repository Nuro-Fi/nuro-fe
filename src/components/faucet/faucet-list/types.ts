import type { TokenConfig } from "@/lib/addresses/types";
import type { HexAddress } from "@/types/types.d";

export interface FaucetTokenRowProps {
  token: TokenConfig;
  userAddress: HexAddress;
}

export interface FaucetListProps {
  userAddress: HexAddress;
}
