import type { NetworkId } from "@autonomys/auto-utils";

export type ApiData = {
  blockHeight: number;
  spacePledged: string;
  blockchainSize: string;
};

export const DEFAULT_API_DATA: ApiData = {
  blockHeight: 0,
  spacePledged: "loading...",
  blockchainSize: "loading...",
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("Request timed out")), ms);
    promise
      .then((value) => {
        clearTimeout(id);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(id);
        reject(err);
      });
  });
}

export const fetchApiData = async (networkId: NetworkId): Promise<ApiData> => {
  try {
    const res = await withTimeout(fetch(`/api/data/${networkId}`), 8000);
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    return (await res.json()) as ApiData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      blockHeight: 0,
      spacePledged: "Error fetching data",
      blockchainSize: "Error fetching data",
    };
  }
};
