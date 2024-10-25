import { formatSpacePledged } from "@/utils/number";
import { spacePledged } from "@autonomys/auto-consensus";
import { activate, NetworkId, NetworkName } from "@autonomys/auto-utils";

async function fetchSpacePledge() {
  try {
    const api = await activate({ networkId: NetworkId.TAURUS });
    const total = await spacePledged(api);
    await api.disconnect();
    return formatSpacePledged(total);
  } catch (error) {
    console.error("Error fetching space pledge:", error);
    return "Error fetching data";
  }
}

export default async function Home() {
  const spacePledge = await fetchSpacePledge();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">
        Autonomys {NetworkName.TAURUS}
      </h1>
      <h2 className="text-4xl font-bold mb-4">Current Space Pledge</h2>
      <p className="text-6xl">{spacePledge}</p>
    </div>
  );
}
