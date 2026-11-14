import { kv } from "@vercel/kv";
import type { ApiData } from "./api";

const TIMEOUT_MS = 3000;

/**
 * Server-only: read the last reading the data API stored in KV, so network
 * pages ship real numbers in their HTML for search engines and AI crawlers
 * that do not run JavaScript. Never calls the chain; returns null when KV is
 * not configured, slow, or holds an incomplete reading.
 */
export async function getNetworkSnapshot(
  networkId: string,
): Promise<ApiData | null> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const data = await Promise.race([
      kv.get<ApiData>(`last-data-${networkId}`),
      new Promise<null>((resolve) => {
        timer = setTimeout(() => resolve(null), TIMEOUT_MS);
      }),
    ]);
    if (
      !data ||
      !Number.isSafeInteger(data.blockHeight) ||
      data.blockHeight <= 0 ||
      typeof data.spacePledged !== "string" ||
      typeof data.blockchainSize !== "string" ||
      typeof data.updatedAt !== "string" ||
      Number.isNaN(Date.parse(data.updatedAt)) ||
      /error|loading/i.test(data.spacePledged + data.blockchainSize)
    ) {
      return null;
    }
    return {
      blockHeight: data.blockHeight,
      spacePledged: data.spacePledged,
      blockchainSize: data.blockchainSize,
      spacePledgedBytes: data.spacePledgedBytes,
      blockchainSizeBytes: data.blockchainSizeBytes,
      updatedAt: data.updatedAt,
      cached: true,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
