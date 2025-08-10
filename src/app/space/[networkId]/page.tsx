import { Footer } from "@/components/Footer";
import {
  images,
  metadata as metadataConstants,
  url,
} from "@/constants/metadata";
import type { NetworkIdParam } from "@/types/app";
import { capitalizeFirstLetter, networks } from "@autonomys/auto-utils";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export const generateMetadata = ({
  params: { networkId },
}: {
  params: NetworkIdParam;
}): Metadata => ({
  ...metadataConstants,
  openGraph: {
    ...metadataConstants.openGraph,
    title: `Autonomys Network Info - ${capitalizeFirstLetter(networkId)}`,
    url: `${url}/space/${networkId}`,
    images: {
      ...images,
      url: `${url}/space/${networkId}/image`,
      secureUrl: `${url}/space/${networkId}/image`,
    },
  },
  twitter: {
    ...metadataConstants.twitter,
    title: `Autonomys Network Info - ${capitalizeFirstLetter(networkId)}`,
    images: {
      ...images,
      url: `${url}/space/${networkId}/image`,
      secureUrl: `${url}/space/${networkId}/image`,
    },
  },
  alternates: {
    canonical: `${url}/space/${networkId}`,
  },
});

export async function generateStaticParams() {
  return networks
    .filter((n) => n.isLocalhost === undefined)
    .map((n) => ({ networkId: n.id }));
}

export default async function Home({
  params: { networkId },
}: {
  params: NetworkIdParam;
}) {
  const supported = networks.some((n) => n.id === networkId && n.isLocalhost === undefined);
  if (!supported) {
    notFound();
  }

  const Scene = dynamic(() => import("@/components/Scene").then((m) => m.Scene), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-[60vh] text-[#576EB2]">Loading 3D scene...</div>
    ),
  });
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
