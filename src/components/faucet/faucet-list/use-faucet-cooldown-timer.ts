import { useState, useEffect } from "react";
import { useFaucetCooldown } from "@/hooks/faucet/use-faucet-cooldown";

export const useFaucetCooldownTimer = (tokenAddress: string) => {
  const { canClaim, getTimeUntilNextClaim, formatCooldown } =
    useFaucetCooldown();

  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const isOnCooldown = !canClaim(tokenAddress);

  useEffect(() => {
    const updateCooldown = () => {
      setCooldownRemaining(getTimeUntilNextClaim(tokenAddress));
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [tokenAddress, getTimeUntilNextClaim]);

  return {
    isOnCooldown,
    cooldownRemaining,
    formatCooldown,
  };
};
