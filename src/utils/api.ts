import { formatSpacePledged } from "@/utils/number";
import {
  blockchainSize,
  blockNumber,
  spacePledged,
} from "@autonomys/auto-consensus";
import { activate, NetworkId } from "@autonomys/auto-utils";

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

export const fetchApiData = async (): Promise<ApiData> => {
  try {
    const api = await activate({ networkId: NetworkId.TAURUS });
    const [blockHeight, total, size] = await Promise.all([
      blockNumber(api),
      spacePledged(api),
      blockchainSize(api),
    ]);
    await api.disconnect();
    return {
      blockHeight,
      spacePledged: formatSpacePledged(total),
      blockchainSize: formatSpacePledged(size),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      blockHeight: 0,
      spacePledged: "Error fetching data",
      blockchainSize: "Error fetching data",
    };
  }
};
