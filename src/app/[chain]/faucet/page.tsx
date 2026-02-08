import FaucetPage from "@/components/faucet/faucet-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NuroFi | Faucet",
  description: "Get testnet tokens from the NuroFi faucet to start using the protocol.",
};

export default function FaucetRoute() {
  return <FaucetPage />;
}
