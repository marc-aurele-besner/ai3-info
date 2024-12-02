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

export const fetchApiData = async (networkId: NetworkId): Promise<ApiData> => {
  try {
    return await fetch(`/api/data/${networkId}`).then((res) => res.json());
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      blockHeight: 0,
      spacePledged: "Error fetching data",
      blockchainSize: "Error fetching data",
    };
  }
};
