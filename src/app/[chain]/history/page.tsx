import { HistoryPage } from "@/components/history/history-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NuroFi | History",
  description: "View your transaction history on NuroFi.",
};

export default function Page() {
  return <HistoryPage />;
}
