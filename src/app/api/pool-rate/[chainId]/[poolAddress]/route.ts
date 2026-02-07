import { NextRequest, NextResponse } from "next/server";

const POOL_API_URL = process.env.POOL_API_URL;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ chainId: string; poolAddress: string }> },
) {
  if (!POOL_API_URL) {
    return NextResponse.json(
      { error: "API URL not configured" },
      { status: 500 },
    );
  }

  const { chainId, poolAddress } = await params;

  try {
    const url = `${POOL_API_URL}/lendingPoolRate/${chainId}/${poolAddress}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch pool rate" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Pool rate proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
