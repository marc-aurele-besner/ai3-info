export type ApiData = {
  blockHeight: number;
  spacePledged: string;
  blockchainSize: string;
  spacePledgedBytes?: string;
  blockchainSizeBytes?: string;
  updatedAt?: string;
  cached?: boolean;
};

export async function fetchApiData(
  networkId: string,
  signal?: AbortSignal,
): Promise<ApiData> {
  const response = await fetch(`/api/data/${encodeURIComponent(networkId)}`, {
    signal,
  });
  if (!response.ok)
    throw new Error("The network is taking a little longer to respond.");
  const data: ApiData = await response.json();
  if (
    !Number.isSafeInteger(data.blockHeight) ||
    data.blockHeight < 0 ||
    typeof data.spacePledged !== "string" ||
    typeof data.blockchainSize !== "string" ||
    /error|loading/i.test(data.spacePledged + data.blockchainSize)
  ) {
    throw new Error("The network returned an incomplete reading.");
  }
  return data;
}
