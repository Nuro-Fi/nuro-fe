import { redirect } from "next/navigation";
import { DEFAULT_CHAIN } from "@/lib/constants/chains";

export default function Home() {
  redirect(`/${DEFAULT_CHAIN.slug}/markets`);
}
