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
    const api = await activate({ networkId: params.params.networkId });
    const [blockHeight, total, size] = await Promise.all([
      blockNumber(api),
      spacePledged(api),
      blockchainSize(api),
    ]);
    await api.disconnect();
    await kv.set(`last-data-${params.params.networkId}`, {
      blockHeight,
      spacePledged: formatSpaceToDecimal(parseInt(total.toString())),
      blockchainSize: formatSpaceToDecimal(parseInt(size.toString())),
    });
    return NextResponse.json({
      blockHeight,
      spacePledged: formatSpaceToDecimal(parseInt(total.toString())),
      blockchainSize: formatSpaceToDecimal(parseInt(size.toString())),
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({
      blockHeight: 0,
      spacePledged: "Error fetching data",
      blockchainSize: "Error fetching data",
    });
  }
}
