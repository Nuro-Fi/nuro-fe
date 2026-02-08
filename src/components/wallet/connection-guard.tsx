"use client";

import type { ReactNode } from "react";
import { Wallet } from "lucide-react";
import { useUserAddress } from "@/hooks/use-user-address";
import { CircleConnectButton } from "@/components/wallet/circle-connect-button";

interface ConnectWalletPromptProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  variant?: "card" | "fullpage";
}

export const ConnectWalletPrompt = ({
  title = "Connect Your Wallet",
  description = "Please connect your wallet to continue",
  icon,
  variant = "card",
}: ConnectWalletPromptProps) => {
  if (variant === "fullpage") {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-full border border-border-primary bg-surface-secondary p-6">
            {icon || <Wallet className="h-12 w-12 text-text-muted" />}
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
          <p className="max-w-md text-sm text-text-secondary">{description}</p>
        </div>
        <CircleConnectButton />
      </section>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border-primary bg-surface-primary/50 py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary">
        {icon || <Wallet className="h-8 w-8 text-text-muted" />}
      </div>
      <h2 className="mb-2 text-lg font-semibold text-text-primary">{title}</h2>
      <p className="mb-6 max-w-sm text-center text-sm text-text-muted">
        {description}
      </p>
      <CircleConnectButton />
    </div>
  );
};

interface LoadingSpinnerProps {
  variant?: "card" | "fullpage";
}

export const LoadingSpinner = ({ variant = "card" }: LoadingSpinnerProps) => {
  if (variant === "fullpage") {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-primary border-t-transparent" />
      </section>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-primary border-t-transparent" />
    </div>
  );
};

interface ConnectionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  promptTitle?: string;
  promptDescription?: string;
  promptIcon?: ReactNode;
  variant?: "card" | "fullpage";
  showLoading?: boolean;
}

export const ConnectionGuard = ({
  children,
  fallback,
  loadingFallback,
  promptTitle,
  promptDescription,
  promptIcon,
  variant = "card",
  showLoading = false,
}: ConnectionGuardProps) => {
  const { isConnected, connectionState } = useUserAddress();
  const isLoading = connectionState === "connecting" || connectionState === "creating-wallet";

  if (showLoading && isLoading) {
    return <>{loadingFallback || <LoadingSpinner variant={variant} />}</>;
  }

  if (!isConnected) {
    return (
      <>
        {fallback || (
          <ConnectWalletPrompt
            title={promptTitle}
            description={promptDescription}
            icon={promptIcon}
            variant={variant}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
};

export const useIsConnected = () => {
  const { address, isConnected, connectionState } = useUserAddress();
  return {
    address,
    isConnected,
    isConnecting: connectionState === "connecting" || connectionState === "creating-wallet",
  };
};
