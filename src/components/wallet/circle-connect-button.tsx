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
    color: "from-blue-600 to-blue-500",
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

  // Load wallets helper
  const loadWallets = async (
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
  };

  // Load USDC balance
  const loadUsdcBalance = async (userToken: string, walletId: string) => {
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
  };

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
          void loadUsdcBalance(savedUserToken, parsedWallets[0].id);
          // Invalidate user address cache
          void invalidateUserAddress();
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [invalidateUserAddress]);

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
            // Invalidate user address cache setelah login
            await invalidateUserAddress();
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
            // Invalidate user address cache setelah register wallet
            await invalidateUserAddress();
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
  }, [sdkReady, userId, mode, invalidateUserAddress]);

  const handleDisconnect = async () => {
    clearSession();
    setUserId("");
    setLoginResult(null);
    setWallets([]);
    setUsdcBalance(null);
    setConnectionState("disconnected");
    setError(null);
    setShowDropdown(false);
    // Invalidate user address cache setelah disconnect
    await invalidateUserAddress();
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
        className="relative inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs uppercase tracking-[0.14em] cursor-not-allowed bg-gray-100 border border-gray-300 text-gray-500"
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
          className="relative inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs uppercase tracking-[0.14em] cursor-pointer bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-800 transition-all duration-150"
        >
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </button>

        {/* Modal Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 min-h-screen">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Circle Wallet
                </h2>
                <p className="text-gray-600 mt-1">
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
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  )}
                >
                  Create Wallet
                </button>
                <button
                  onClick={() => setMode("login")}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                    mode === "login"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  )}
                >
                  Login
                </button>
              </div>

              {/* User ID Input */}
              <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 inline mr-1" />
                  User ID
                </label>
                <input
                  type="text"
                  placeholder="Enter your unique user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500">
                  {mode === "create"
                    ? "Choose a unique ID. This will be your wallet identifier."
                    : "Enter your existing user ID to access your wallet."}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDialogOpen(false);
                    setError(null);
                  }}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!userId.trim()}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="inline-flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">
                {formatBalance(usdcBalance || "0")} USDC
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">
                  {shortenAddress(primaryWallet.address)}
                </span>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
              {userId.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
              {/* User Info */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium">
                    {userId.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {userId}
                    </span>
                    <span className="text-xs text-gray-600">
                      {shortenAddress(primaryWallet.address)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Balance Section */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600 uppercase tracking-wider">
                    Balance
                  </span>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                  >
                    <RefreshCw
                      className={cn(
                        "w-3.5 h-3.5 text-gray-500",
                        isRefreshing && "animate-spin",
                      )}
                    />
                  </button>
                </div>
                <div className="text-2xl font-bold text-gray-900">
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
                    <span className="text-xs text-gray-600">
                      {blockchainInfo.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-2">
                <button
                  onClick={copyAddress}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-sm text-gray-700">
                    {copied ? "Copied!" : "Copy Address"}
                  </span>
                </button>

                <button
                  onClick={copyUserIdToClipboard}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {copiedUserId ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <User className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-sm text-gray-700">
                    {copiedUserId ? "Copied!" : "Copy User ID"}
                  </span>
                </button>

                <a
                  href={`https://testnet.arcscan.app/address/${primaryWallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    View on Explorer
                  </span>
                </a>

                <div className="my-2 border-t border-gray-100" />

                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">Disconnect</span>
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
