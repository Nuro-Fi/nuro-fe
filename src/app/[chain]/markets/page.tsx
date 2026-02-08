import { HomePage } from "@/components/home/home-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NuroFi | Markets",
  description: "Explore the markets on NuroFi.",
};

export default function HomeIndexRoute() {
  return <HomePage />;
}
