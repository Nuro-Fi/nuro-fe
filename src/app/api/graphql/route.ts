import { NextRequest, NextResponse } from "next/server";

const POOL_API_URL = process.env.POOL_API_URL;

export async function POST(request: NextRequest) {
  if (!POOL_API_URL) {
    return NextResponse.json(
      { error: "API URL not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(POOL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from indexer" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GraphQL proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
