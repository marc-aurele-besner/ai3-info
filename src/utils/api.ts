import { formatSpacePledged } from "@/utils/number";
import { blockchainSize, spacePledge } from "@autonomys/auto-consensus";
import { activate, NetworkId } from "@autonomys/auto-utils";

export type ApiData = {
  spacePledged: string;
  blockchainSize: string;
};

export const fetchApiData = async (): Promise<ApiData> => {
  try {
    const api = await activate({ networkId: NetworkId.TAURUS });
    const [total, size] = await Promise.all([
      spacePledge(api),
      blockchainSize(api),
    ]);
    await api.disconnect();
    return {
      spacePledged: formatSpacePledged(total),
      blockchainSize: formatSpacePledged(size),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      spacePledged: "Error fetching data",
      blockchainSize: "Error fetching data",
    };
  }
};
