import { NetworkIdParam } from "@/types/app";
import {
  blockchainSize,
  blockNumber,
  formatSpaceToDecimal,
  spacePledged,
} from "@autonomys/auto-consensus";
import { activate } from "@autonomys/auto-utils";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  params: { params: NetworkIdParam }
) {
  try {
    const { networkId } = params.params;
    if (!networkId) {
      return NextResponse.json(
        { error: "Missing networkId" },
        { status: 400 }
      );
    }

    const api = await activate({ networkId: params.params.networkId });
    const [blockHeight, total, size] = await Promise.all([
      blockNumber(api),
      spacePledged(api),
      blockchainSize(api),
    ]);
    await api.disconnect();

    const payload = {
      blockHeight,
      spacePledged: formatSpaceToDecimal(parseInt(total.toString())),
      blockchainSize: formatSpaceToDecimal(parseInt(size.toString())),
    };

    try {
      await kv.set(`last-data-${params.params.networkId}`, payload);
    } catch (cacheError) {
      console.warn("KV set failed:", cacheError);
    }

    const res = NextResponse.json(payload);
    res.headers.set("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return res;
  } catch (error) {
    console.error("Error fetching data:", error);
    try {
      const cached = await kv.get(`last-data-${params.params.networkId}`);
      if (cached) {
        const res = NextResponse.json(cached);
        res.headers.set(
          "Cache-Control",
          "s-maxage=60, stale-while-revalidate=120"
        );
        return res;
      }
    } catch (cacheReadError) {
      console.warn("KV get failed:", cacheReadError);
    }
    return NextResponse.json(
      {
        blockHeight: 0,
        spacePledged: "Error fetching data",
        blockchainSize: "Error fetching data",
      },
      { status: 500 }
    );
  }
}
