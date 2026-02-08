import { NextResponse } from "next/server";

const CIRCLE_BASE_URL = "https://api.circle.com";
const CIRCLE_API_KEY = process.env.CIRCLE_API_KEY || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ...params } = body ?? {};

    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 });
    }

    switch (action) {
      case "createUser": {
        const { userId } = params;

        if (!userId) {
          return NextResponse.json(
            { error: "Missing required field: userId" },
            { status: 400 },
          );
        }

        const response = await fetch(`${CIRCLE_BASE_URL}/v1/w3s/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${CIRCLE_API_KEY}`,
          },
          body: JSON.stringify({
            userId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data.data, { status: 200 });
      }

      case "getUserToken": {
        const { userId } = params;

        if (!userId) {
          return NextResponse.json(
            { error: "Missing required field: userId" },
            { status: 400 },
          );
        }

        const response = await fetch(`${CIRCLE_BASE_URL}/v1/w3s/users/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${CIRCLE_API_KEY}`,
          },
          body: JSON.stringify({
            userId,
          }),
          signal: AbortSignal.timeout(30000),
        });

        const data = await response.json();

        if (!response.ok) {
          return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data.data, { status: 200 });
      }

      case "initializeUser": {
        const { userToken, accountType, blockchains } = params;
        if (!userToken) {
          return NextResponse.json(
            { error: "Missing userToken" },
            { status: 400 },
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const requestBody: any = {
          idempotencyKey: crypto.randomUUID(),
        };

        if (accountType) requestBody.accountType = accountType;
        if (blockchains) requestBody.blockchains = blockchains;

        const response = await fetch(
          `${CIRCLE_BASE_URL}/v1/w3s/user/initialize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${CIRCLE_API_KEY}`,
              "X-User-Token": userToken,
            },
            body: JSON.stringify(requestBody),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data.data, { status: 200 });
      }

      case "listWallets": {
        const { userToken } = params;
        if (!userToken) {
          return NextResponse.json(
            { error: "Missing userToken" },
            { status: 400 },
          );
        }

        const response = await fetch(`${CIRCLE_BASE_URL}/v1/w3s/wallets`, {
          method: "GET",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${CIRCLE_API_KEY}`,
            "X-User-Token": userToken,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data.data, { status: 200 });
      }

      case "getTokenBalance": {
        const { userToken, walletId } = params;
        if (!userToken || !walletId) {
          return NextResponse.json(
            { error: "Missing userToken or walletId" },
            { status: 400 },
          );
        }

        const response = await fetch(
          `${CIRCLE_BASE_URL}/v1/w3s/wallets/${walletId}/balances`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${CIRCLE_API_KEY}`,
              "X-User-Token": userToken,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data.data, { status: 200 });
      }

      case "createTransaction": {
        const { userToken, walletId, contractAddress, abiFunctionSignature, abiParameters, value } = params;
        if (!userToken || !walletId || !contractAddress || !abiFunctionSignature) {
          return NextResponse.json(
            { error: "Missing required fields (userToken, walletId, contractAddress, abiFunctionSignature)" },
            { status: 400 },
          );
        }

        const requestBody = {
          idempotencyKey: crypto.randomUUID(),
          walletId,
          contractAddress,
          abiFunctionSignature,
          abiParameters: abiParameters || [],
          feeLevel: "MEDIUM",
          ...(value && value !== "0" ? { amount: value } : {}),
        };

        const response = await fetch(
          `${CIRCLE_BASE_URL}/v1/w3s/user/transactions/contractExecution`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${CIRCLE_API_KEY}`,
              "X-User-Token": userToken,
            },
            body: JSON.stringify(requestBody),
          },
        );

        const responseData = await response.json();

        if (!response.ok) {
          return NextResponse.json(responseData, { status: response.status });
        }

        return NextResponse.json(responseData.data, { status: 200 });
      }

      case "sendTransaction": {
        const { userToken, walletId, to, amount } = params;
        if (!userToken || !walletId || !to) {
          return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 },
          );
        }

        const requestBody = {
          idempotencyKey: crypto.randomUUID(),
          walletId,
          destinationAddress: to,
          amounts: [amount || "0"],
          feeLevel: "MEDIUM",
        };

        const response = await fetch(
          `${CIRCLE_BASE_URL}/v1/w3s/user/transactions/transfer`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${CIRCLE_API_KEY}`,
              "X-User-Token": userToken,
            },
            body: JSON.stringify(requestBody),
          },
        );

        const responseData = await response.json();

        if (!response.ok) {
          return NextResponse.json(responseData, { status: response.status });
        }

        return NextResponse.json(responseData.data, { status: 200 });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
