import { redirect } from "next/navigation";

export default async function ChainIndexRoute({
  params,
}: {
  params: Promise<{ chain: string }>;
}) {
  const { chain } = await params;
  redirect(`/${chain}/markets`);
}
