"use client";

import { useEffect } from "react";
import { useConnect, useDisconnect, useAccount } from "wagmi";
import { useCircleWallet } from "@/contexts/circle-wallet-context";
import { useConnectors } from "wagmi";
import { useUserAddressActions } from "@/hooks/use-user-address";
import { useQueryClient } from "@tanstack/react-query";

export function useCircleWagmiSync() {
  const {
    isConnected: isCircleConnected,
    address: circleAddress,
    connectionState,
  } = useCircleWallet();
  const connect = useConnect();
  const connectors = useConnectors();
  const disconnect = useDisconnect();
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const { invalidateUserAddress } = useUserAddressActions();
  const queryClient = useQueryClient();

  useEffect(() => {
    const circleConnector = connectors.find((c) => c.id === "circle-wallet");

    if (!circleConnector) {
      console.warn("Circle connector not found in wagmi connectors");
      return;
    }

    const syncConnection = () => {
      if (isCircleConnected && circleAddress) {
        // Circle is connected, check if wagmi needs to sync
        if (!isWagmiConnected || wagmiAddress !== circleAddress) {
          console.log("Syncing wagmi with Circle wallet:", circleAddress);

          try {
            connect.mutate(
              { connector: circleConnector },
              {
                onSuccess: async () => {
                  console.log(
                    "Wagmi connected, invalidating all queries",
                  );
                  await invalidateUserAddress();
                  await queryClient.invalidateQueries();
                },
              },
            );
          } catch (error) {
            console.error("Failed to sync wagmi connection:", error);
          }
        }
      } else if (!isCircleConnected && isWagmiConnected) {
        // Circle is disconnected but wagmi is still connected
        console.log("Disconnecting wagmi to sync with Circle wallet state");
        disconnect.mutate(undefined, {
          onSuccess: async () => {
            console.log("Wagmi disconnected, invalidating all queries");
            await invalidateUserAddress();
            queryClient.removeQueries();
            await queryClient.invalidateQueries();
          },
        });
      }
    };

    // Run sync whenever Circle connection state changes
    syncConnection();
  }, [
    isCircleConnected,
    circleAddress,
    connectionState,
    wagmiAddress,
    isWagmiConnected,
    connect,
    disconnect,
    connectors,
    invalidateUserAddress,
    queryClient,
  ]);
}
