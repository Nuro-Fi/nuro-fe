import type { HexAddress } from "@/types/types.d";
import { FAUCET_TOKENS } from "../constants";
import { FaucetTokenRow } from "./faucet-token-row";
import { NativeFaucetRow } from "./native-faucet-row";

interface FaucetTableProps {
  userAddress: HexAddress;
}

export const FaucetTable = ({ userAddress }: FaucetTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-primary bg-surface-primary/60">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                Token
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                Balance
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                Claim Amount
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/50">
            <NativeFaucetRow userAddress={userAddress} />
            {FAUCET_TOKENS.map((token) => (
              <FaucetTokenRow
                key={token.address}
                token={token}
                userAddress={userAddress}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
