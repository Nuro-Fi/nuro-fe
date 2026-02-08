"use client";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "@/lib/config";
import { CircleWalletProvider } from "@/contexts/circle-wallet-context";
import { useCircleWagmiSync } from "@/hooks/use-circle-wagmi-sync";

export const queryClient = new QueryClient();

function WagmiSync({ children }: { children: React.ReactNode }) {
  useCircleWagmiSync();
  return <>{children}</>;
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <CircleWalletProvider>
          <WagmiSync>{children}</WagmiSync>
        </CircleWalletProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
