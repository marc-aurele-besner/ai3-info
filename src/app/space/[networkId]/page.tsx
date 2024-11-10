import { Scene } from "@/components/Scene";
import { NetworkIdParam } from "@/types/app";
import { capitalizeFirstLetter } from "@autonomys/auto-utils";

export default async function Home({
  params: { networkId },
}: {
  params: NetworkIdParam;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-8 bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Autonomys Network Info</h1>
      <h2 className="text-4xl font-bold mb-4">
        {capitalizeFirstLetter(networkId)}
      </h2>
      <Scene />
    </div>
  );
}
