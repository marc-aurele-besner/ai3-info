import { Footer } from "@/components/Footer";
import { Scene } from "@/components/Scene";
import { NetworkIdParam } from "@/types/app";
import { capitalizeFirstLetter } from "@autonomys/auto-utils";

export default async function Home({
  params: { networkId },
}: {
  params: NetworkIdParam;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen pt-8 bg-black text-[#576EB2]">
      <h1 className="text-4xl font-bold mb-4">
        Autonomys Network Info - {capitalizeFirstLetter(networkId)}
      </h1>
      <Scene />
      <Footer />
    </div>
  );
}
