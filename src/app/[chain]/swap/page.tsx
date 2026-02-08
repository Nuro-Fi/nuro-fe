import SwapPage from "@/components/swap/swap-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NuroFi | Swap",
  description: "Swap tokens on NuroFi to manage your portfolio efficiently.",
};
export default function SwapRoute() {
  return <SwapPage />;
}
