import { networks } from "@autonomys/auto-utils";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaHeart, FaLinkedin, FaTwitter } from "react-icons/fa";

export default async function Home() {
  const publicNetworks = networks.filter(
    (network) => network.isLocalhost === undefined
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-8 bg-black text-[#576EB2]">
      <h1 className="text-4xl font-bold mb-4">Autonomys Network Info</h1>
      <p className="text-lg mb-4">
        Explore AI3 in a fun and inviting 3D environment, gain insight on
        network status and more...
      </p>
      <Image
        src="/images/ai3-info-blur.png"
        alt="Autonomys"
        width={1200}
        height={1200}
        className="w-auto h-auto"
        style={{ objectFit: "contain" }}
      />
      <h2 className="text-4xl font-bold mb-4 ">Select a Network</h2>
      <div className="flex flex-row gap-4">
        {publicNetworks.map((network) => (
          <Link
            key={network.id}
            href={`/space/${network.id}`}
            className="px-4 py-2 border border-[#576EB2] text-[#576EB2] rounded hover:bg-[#576EB2] hover:text-black transition duration-300"
          >
            {network.name}
          </Link>
        ))}
      </div>
      <footer className="flex justify-center items-center bg-gray-900 text-white py-4 w-full fixed bottom-0">
        <a
          href="https://github.com/marc-aurele-besner/ai3-info"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mr-8"
        >
          <FaGithub size={24} />
          <span>GitHub Repo</span>
        </a>
        <p className="flex items-center gap-2">
          Made with <FaHeart className="text-red-500" /> by Marc-Aurèle
        </p>
        <a
          href="https://github.com/marc-aurele-besner"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-8"
        >
          <FaGithub className="text-white hover:text-gray-400" size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/marc-aurele-besner/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4"
        >
          <FaLinkedin className="text-white hover:text-gray-400" size={24} />
        </a>
        <a
          href="https://x.com/marcaureleb"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4"
        >
          <FaTwitter className="text-white hover:text-gray-400" size={24} />
        </a>
      </footer>
    </div>
  );
}
