import { activate } from '@autonomys/auto-utils';
import { spacePledge } from '@autonomys/auto-consensus';
import { formatSpacePledged } from '@/utils/number';

async function fetchSpacePledge() {
  try {
    const api = await activate({ networkId: 'gemini-3h' });
    const total = await spacePledge(api);
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
      <h1 className="text-4xl font-bold mb-4">Autonomys Gemini 3h Testnet</h1>
      <h2 className="text-4xl font-bold mb-4">Current Space Pledge</h2>
      <p className="text-6xl">{spacePledge}</p>
    </div>
  );
}
