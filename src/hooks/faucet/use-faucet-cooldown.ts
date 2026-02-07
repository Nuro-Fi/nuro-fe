"use client";

import { useState, useCallback } from "react";
import { FAUCET_COOLDOWN } from "@/lib/constants/faucet.constants";

const STORAGE_KEY = "faucet_last_claim";

interface LastClaimData {
  [tokenAddress: string]: number; // timestamp
}

export const useFaucetCooldown = () => {
  const [, setTick] = useState(0);

  const getLastClaimData = useCallback((): LastClaimData => {
    if (typeof window === "undefined") return {};
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }, []);

  const setLastClaim = useCallback((tokenAddress: string) => {
    const data = getLastClaimData();
    data[tokenAddress.toLowerCase()] = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setTick((t) => t + 1); // Force re-render
  }, [getLastClaimData]);

  const getTimeUntilNextClaim = useCallback(
    (tokenAddress: string): number => {
      const data = getLastClaimData();
      const lastClaim = data[tokenAddress.toLowerCase()];
      if (!lastClaim) return 0;

      const elapsed = (Date.now() - lastClaim) / 1000;
      const remaining = FAUCET_COOLDOWN - elapsed;
      return Math.max(0, Math.ceil(remaining));
    },
    [getLastClaimData]
  );

  const canClaim = useCallback(
    (tokenAddress: string): boolean => {
      return getTimeUntilNextClaim(tokenAddress) === 0;
    },
    [getTimeUntilNextClaim]
  );

  const formatCooldown = useCallback((seconds: number): string => {
    if (seconds <= 0) return "";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }, []);

  return {
    canClaim,
    setLastClaim,
    getTimeUntilNextClaim,
    formatCooldown,
  };
};

export default useFaucetCooldown;
