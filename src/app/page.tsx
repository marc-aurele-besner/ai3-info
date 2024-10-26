import { Scene } from "@/components/Scene";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-8 bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Autonomys Gemini 3h Testnet</h1>
      <Scene />
    </div>
  );
}
