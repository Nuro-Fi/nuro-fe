/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import Image from "next/image";
import {
  Wallet,
  LogOut,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  User,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserAddressActions } from "@/hooks/use-user-address";
import { useQueryClient } from "@tanstack/react-query";

const appId = process.env.NEXT_PUBLIC_CIRCLE_APP_ID as string;
const ACCOUNT_TYPE = "SCA";
const PRIMARY_WALLET_BLOCKCHAIN = "ARC-TESTNET";

type LoginResult = {
  userToken: string;
  encryptionKey: string;
};

type WalletData = {
  id: string;
  address: string;
  blockchain: string;
  [key: string]: unknown;
};

type ConnectionState =
  | "disconnected"
  | "connecting"
  | "creating-user"
  | "getting-token"
  | "initializing"
  | "creating-wallet"
  | "connected";

const BLOCKCHAIN_INFO: Record<
  string,
  { name: string; icon: string; color: string }
> = {
  "ARC-TESTNET": {
    name: "ARC Testnet",
    icon: "/chain/arc.png",
    color: "from-white/20 to-white/10",
  },
  "ETH-SEPOLIA": {
    name: "Ethereum Sepolia",
    icon: "/chain/eth.png",
    color: "from-purple-600 to-purple-500",
  },
};

function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

function formatBalance(balance: string | number, decimals = 2): string {
  const num = typeof balance === "string" ? parseFloat(balance) : balance;
  if (isNaN(num)) return "0";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function CircleConnectButton() {
  const { invalidateUserAddress } = useUserAddressActions();
  const queryClient = useQueryClient();
  const sdkRef = useRef<W3SSdk | null>(null);

  const [sdkReady, setSdkReady] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [loginResult, setLoginResult] = useState<LoginResult | null>(null);
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mode, setMode] = useState<"create" | "login">("create");
  const [showDropdown, setShowDropdown] = useState(false);

  // Load USDC balance
  const loadUsdcBalance = useCallback(async (userToken: string, walletId: string) => {
    try {
      const response = await fetch("/api/endpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getTokenBalance",
          userToken,
          walletId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.tokenBalances) {
        const usdc = data.tokenBalances.find(
          (t: any) => t.token?.symbol === "USDC",
        );
        if (usdc) {
          setUsdcBalance(usdc.amount || "0");
        }
      }
    } catch (err) {
      console.error("Error loading balance:", err);
    }
  }, []);

  // Load wallets helper
  const loadWallets = useCallback(async (
    userToken: string,
    encryptionKey: string,
    currentUserId: string,
  ): Promise<WalletData[]> => {
    try {
      const response = await fetch("/api/endpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "listWallets", userToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to load wallets:", data);
        return [];
      }

      if (data.wallets && data.wallets.length > 0) {
        // Save session
        localStorage.setItem("circleUserId", currentUserId);
        localStorage.setItem("circleUserToken", userToken);
        localStorage.setItem("circleEncryptionKey", encryptionKey);
        localStorage.setItem("circleWallets", JSON.stringify(data.wallets));

        setWallets(data.wallets);

        // Load balance
        await loadUsdcBalance(userToken, data.wallets[0].id);

        return data.wallets;
      }

      return [];
    } catch (err) {
      console.error("Error loading wallets:", err);
      return [];
    }
  }, [loadUsdcBalance]);

  // Notify CircleWalletProvider context of wallet state changes
  const notifyWalletChanged = useCallback(() => {
    window.dispatchEvent(new Event("circle-wallet-changed"));
  }, []);

  // Clear session
  const clearSession = () => {
    localStorage.removeItem("circleUserId");
    localStorage.removeItem("circleUserToken");
    localStorage.removeItem("circleEncryptionKey");
    localStorage.removeItem("circleWallets");
  };

  // Restore session on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem("circleUserId") || "";
    const savedUserToken = localStorage.getItem("circleUserToken");
    const savedEncryptionKey = localStorage.getItem("circleEncryptionKey");
    const savedWallets = localStorage.getItem("circleWallets");

    // Batch all state updates in a microtask to avoid cascading renders
    queueMicrotask(() => {
      if (savedUserId) setUserId(savedUserId);

      if (savedUserToken && savedEncryptionKey) {
        setLoginResult({
          userToken: savedUserToken,
          encryptionKey: savedEncryptionKey,
        });
      }

      if (savedWallets) {
        try {
          const parsedWallets = JSON.parse(savedWallets) as WalletData[];
          setWallets(parsedWallets);

          if (
            savedUserId &&
            savedUserToken &&
            savedEncryptionKey &&
            parsedWallets.length > 0
          ) {
            setConnectionState("connected");
            // Load balance on restore
            const firstWallet = parsedWallets[0];
            if (firstWallet) {
              void loadUsdcBalance(savedUserToken, firstWallet.id);
            }
            // Notify context and invalidate queries
            notifyWalletChanged();
            void invalidateUserAddress();
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
    });
  }, [invalidateUserAddress, notifyWalletChanged, loadUsdcBalance]);

  // Auto-refetch USDC balance every 10 seconds when connected
  useEffect(() => {
    const wallet = wallets[0];
    if (connectionState !== "connected" || !loginResult?.userToken || !wallet?.id) return;

    const interval = setInterval(() => {
      void loadUsdcBalance(loginResult.userToken, wallet.id);
    }, 10_000);

    return () => clearInterval(interval);
  }, [connectionState, loginResult, wallets, loadUsdcBalance]);

  // Initialize SDK on mount
  useEffect(() => {
    let cancelled = false;

    const initSdk = async () => {
      try {
        const sdk = new W3SSdk({
          appSettings: { appId },
        });

        sdkRef.current = sdk;

        if (!cancelled) {
          setSdkReady(true);
        }
      } catch (err) {
        console.error("Failed to initialize Web SDK:", err);
        if (!cancelled) {
          setError("Failed to initialize SDK");
        }
      }
    };

    void initSdk();

    return () => {
      cancelled = true;
    };
  }, []);

  // Handle connection
  const handleConnect = useCallback(async () => {
    if (!sdkReady || !userId.trim()) {
      setError("Please enter a User ID");
      return;
    }

    setError(null);
    setConnectionState("connecting");

    try {
      // Step 1: Create User (only if mode is "create")
      if (mode === "create") {
        setConnectionState("creating-user");

        console.log("Creating user with ID:", userId);

        const createResponse = await fetch("/api/endpoints", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "createUser", userId }),
        });

        const createData = await createResponse.json();

        if (!createResponse.ok && createData.code !== 155106) {
          console.error("Create user failed:", createData);
          setError(
            createData.error || createData.message || "Failed to create user",
          );
          setConnectionState("disconnected");
          return;
        }
      }

      // Step 2: Get User Token
      setConnectionState("getting-token");

      console.log("Getting user token for:", userId);

      const tokenResponse = await fetch("/api/endpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getUserToken", userId }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        console.error("Get user token failed:", tokenData);
        let errorMsg = "Failed to get user token";

        if (tokenResponse.status === 400) {
          errorMsg =
            mode === "login"
              ? "User not found. Please use 'Create Wallet' if this is your first time."
              : "Invalid user ID or API parameters";
        } else {
          errorMsg = tokenData.error || tokenData.message || errorMsg;
        }

        setError(errorMsg);
        setConnectionState("disconnected");
        return;
      }

      const newLoginResult = {
        userToken: tokenData.userToken,
        encryptionKey: tokenData.encryptionKey,
      };
      setLoginResult(newLoginResult);

      // Step 3: Initialize User
      setConnectionState("initializing");

      console.log(
        "Initializing user with accountType:",
        ACCOUNT_TYPE,
        "blockchains:",
        [PRIMARY_WALLET_BLOCKCHAIN],
      );

      const initResponse = await fetch("/api/endpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "initializeUser",
          userToken: newLoginResult.userToken,
          accountType: ACCOUNT_TYPE,
          blockchains: [PRIMARY_WALLET_BLOCKCHAIN],
        }),
      });

      const initData = await initResponse.json();

      // User already initialized - load existing wallets
      if (!initResponse.ok) {
        if (initData.code === 155106) {
          console.log("User already initialized, loading existing wallets");
          const existingWallets = await loadWallets(
            newLoginResult.userToken,
            newLoginResult.encryptionKey,
            userId,
          );
          if (existingWallets.length > 0) {
            setConnectionState("connected");
            setIsDialogOpen(false);
            // Notify context and invalidate all queries after login
            notifyWalletChanged();
            await invalidateUserAddress();
            await queryClient.invalidateQueries();
            return;
          }
        }

        console.error("Initialize user failed:", initData);
        setError(
          initData.error || initData.message || "Failed to initialize user",
        );
        setConnectionState("disconnected");
        return;
      }

      // Step 4: Execute Challenge (Create Wallet)
      setConnectionState("creating-wallet");

      const sdk = sdkRef.current;
      if (!sdk) {
        setError("SDK not ready");
        setConnectionState("disconnected");
        return;
      }

      sdk.setAuthentication({
        userToken: newLoginResult.userToken,
        encryptionKey: newLoginResult.encryptionKey,
      });

      // Close our dialog to let Circle SDK UI show properly
      setIsDialogOpen(false);

      sdk.execute(initData.challengeId, async (sdkError, result) => {
        if (sdkError) {
          console.error("Execute challenge failed:", sdkError);
          setError((sdkError as any)?.message ?? "Failed to create wallet");
          setConnectionState("disconnected");
          setIsDialogOpen(true); // Reopen dialog to show error
          return;
        }

        console.log("Challenge executed successfully:", result);

        // Give Circle time to index the wallet
        setTimeout(async () => {
          const newWallets = await loadWallets(
            newLoginResult.userToken,
            newLoginResult.encryptionKey,
            userId,
          );
          if (newWallets.length > 0) {
            setConnectionState("connected");
            // Notify context and invalidate all queries after wallet creation
            notifyWalletChanged();
            await invalidateUserAddress();
            await queryClient.invalidateQueries();
          } else {
            setConnectionState("disconnected");
            setError("Wallet creation pending. Please try again.");
            setIsDialogOpen(true); // Reopen to show error
          }
        }, 2500);
      });
    } catch (err: any) {
      console.error("Connection error:", err);
      setError(err?.message || "Connection failed");
      setConnectionState("disconnected");
    }
  }, [sdkReady, userId, mode, invalidateUserAddress, queryClient, notifyWalletChanged, loadWallets]);

  const handleDisconnect = async () => {
    clearSession();
    setUserId("");
    setLoginResult(null);
    setWallets([]);
    setUsdcBalance(null);
    setConnectionState("disconnected");
    setError(null);
    setShowDropdown(false);
    // Notify context and invalidate all queries after disconnect
    notifyWalletChanged();
    await invalidateUserAddress();
    queryClient.removeQueries();
    await queryClient.invalidateQueries();
  };

  const handleRefresh = async () => {
    if (!loginResult?.userToken || !wallets[0]?.id) return;

    setIsRefreshing(true);
    await loadUsdcBalance(loginResult.userToken, wallets[0].id);
    setIsRefreshing(false);
  };

  const copyAddress = () => {
    if (wallets[0]?.address) {
      navigator.clipboard.writeText(wallets[0].address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyUserIdToClipboard = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    }
  };

  const getConnectionStateText = () => {
    switch (connectionState) {
      case "connecting":
        return "Connecting...";
      case "creating-user":
        return "Creating user...";
      case "getting-token":
        return "Authenticating...";
      case "initializing":
        return "Initializing...";
      case "creating-wallet":
        return "Creating wallet...";
      default:
        return "Connect Wallet";
    }
  };

  const primaryWallet = wallets[0];
  const blockchainInfo = primaryWallet?.blockchain
    ? BLOCKCHAIN_INFO[primaryWallet.blockchain]
    : null;

  // Loading State
  if (connectionState !== "disconnected" && connectionState !== "connected") {
    return (
      <button
        disabled
        className="relative inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs uppercase tracking-[0.14em] cursor-not-allowed rounded-full border border-white/15 bg-white/6 text-white/50"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{getConnectionStateText()}</span>
      </button>
    );
  }

  // Disconnected State - Show Dialog
  if (connectionState === "disconnected") {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="relative inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold cursor-pointer rounded-full bg-blue-500 text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20"
        >
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </button>

        {/* Modal Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm min-h-screen">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Circle Wallet
                </h2>
                <p className="text-white/40 mt-1">
                  Create or connect your programmable wallet
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode("create")}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                    mode === "create"
                    ? "bg-blue-500 text-white"
                    : "bg-white/6 text-white/50 hover:bg-white/10",
                  )}
                >
                  Create Wallet
                </button>
                <button
                  onClick={() => setMode("login")}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                    mode === "login"
                    ? "bg-blue-500 text-white"
                    : "bg-white/6 text-white/50 hover:bg-white/10",
                  )}
                >
                  Login
                </button>
              </div>

              {/* User ID Input */}
              <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-white/50">
                  <User className="w-4 h-4 inline mr-1" />
                  User ID
                </label>
                <input
                  type="text"
                  placeholder="Enter your unique user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/3 text-white placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/30"
                />
                <p className="text-xs text-white/30">
                  {mode === "create"
                    ? "Choose a unique ID. This will be your wallet identifier."
                    : "Enter your existing user ID to access your wallet."}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDialogOpen(false);
                    setError(null);
                  }}
                  className="flex-1 py-3 px-4 bg-white/6 text-white/60 rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!userId.trim()}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mode === "create" ? "Create Wallet" : "Connect"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Connected State - Show Dropdown
  if (connectionState === "connected" && primaryWallet) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-flex items-center gap-3 px-8 py-2 border border-white/15 rounded-full hover:bg-white/6 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-white">
                {formatBalance(usdcBalance || "0")} USDC
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-white/40">
                  {shortenAddress(primaryWallet.address)}
                </span>
              </div>
            </div>
            <Image
              src="/avatar.png"
              alt="Avatar"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border border-white/15 object-cover"
            />
          </div>
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-72 bg-[#0a0a0a] rounded-xl shadow-lg border border-white/10 z-50 overflow-hidden">
              {/* User Info */}
              <div className="p-4 border-b border-white/6">
                <div className="flex items-center gap-3">
                  <Image
                    src="/avatar.png"
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border border-white/15 object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      {userId}
                    </span>
                    <span className="text-xs text-white/40">
                      {shortenAddress(primaryWallet.address)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Balance Section */}
              <div className="px-4 py-3 border-b border-white/6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/40 uppercase tracking-wider">
                    Balance
                  </span>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-1 hover:bg-white/6 rounded transition-colors disabled:opacity-50"
                  >
                    <RefreshCw
                      className={cn(
                        "w-3.5 h-3.5 text-white/40",
                        isRefreshing && "animate-spin",
                      )}
                    />
                  </button>
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatBalance(usdcBalance || "0")} USDC
                </div>
                {blockchainInfo && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <Image
                      src={blockchainInfo.icon}
                      alt={blockchainInfo.name}
                      width={14}
                      height={14}
                      className="rounded-full"
                    />
                    <span className="text-xs text-white/40">
                      {blockchainInfo.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-2">
                <button
                  onClick={copyAddress}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/6 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/40" />
                  )}
                  <span className="text-sm text-white/60">
                    {copied ? "Copied!" : "Copy Address"}
                  </span>
                </button>

                <button
                  onClick={copyUserIdToClipboard}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/6 transition-colors"
                >
                  {copiedUserId ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <User className="w-4 h-4 text-white/40" />
                  )}
                  <span className="text-sm text-white/60">
                    {copiedUserId ? "Copied!" : "Copy User ID"}
                  </span>
                </button>

                <a
                  href={`https://testnet.arcscan.app/address/${primaryWallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/6 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-white/40" />
                  <span className="text-sm text-white/60">
                    View on Explorer
                  </span>
                </a>

                <div className="my-2 border-t border-white/6" />

                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">Disconnect</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}

export default CircleConnectButton;
