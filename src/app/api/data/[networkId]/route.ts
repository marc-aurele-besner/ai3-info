import { NetworkIdParam } from "@/types/app";
import {
  blockchainSize,
  formatSpaceToDecimal,
  spacePledged,
} from "@autonomys/auto-consensus";
import { activate, networks } from "@autonomys/auto-utils";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ networkId: string }> },
) {
  const { networkId } = await params;
  try {
    if (!networkId) {
      return NextResponse.json({ error: "Missing networkId" }, { status: 400 });
    }

    const supported = networks.some(
      (n) => n.id === networkId && n.isLocalhost === undefined,
    );
    if (!supported) {
      return NextResponse.json(
        { error: `Unsupported networkId: ${networkId}` },
        { status: 400 },
      );
    }

    const api = await activate({
      networkId: networkId as NetworkIdParam["networkId"],
    });
    const [latestHeader, total, size] = await Promise.all([
      // Read the header directly: the SDK full-block helper can decode height as zero.
      api.rpc.chain.getHeader(),
      spacePledged(api),
      blockchainSize(api),
    ]).finally(() => api.disconnect());

    const payload = {
      blockHeight: latestHeader.number.toNumber(),
      spacePledgedBytes: total.toString(),
      blockchainSizeBytes: size.toString(),
      updatedAt: new Date().toISOString(),
      cached: false,
      spacePledged: formatSpaceToDecimal(parseInt(total.toString())),
      blockchainSize: formatSpaceToDecimal(parseInt(size.toString())),
    };

    try {
      await kv.set(`last-data-${networkId}`, payload);
    } catch (cacheError) {
      console.warn("KV set failed:", cacheError);
    }

    const res = NextResponse.json(payload);
    res.headers.set("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return res;
  } catch (error) {
    console.error("Error fetching data:", error);
    try {
      const cached = await kv.get<Record<string, unknown>>(
        `last-data-${networkId}`,
      );
      if (cached) {
        const res = NextResponse.json({ ...cached, cached: true });
        res.headers.set(
          "Cache-Control",
          "s-maxage=60, stale-while-revalidate=120",
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
      { status: 500 },
    );
  }
}
