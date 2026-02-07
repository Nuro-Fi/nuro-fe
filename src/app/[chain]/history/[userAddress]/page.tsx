import { HistoryPage } from "@/components/history/history-page";

export default async function Page({
  params,
}: {
  params: Promise<{ userAddress: string }>;
}) {
  const { userAddress } = await params;
  return <HistoryPage userAddress={userAddress} />;
}
