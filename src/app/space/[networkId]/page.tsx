import { Observatory } from "@/components/Observatory";
import {
  images,
  metadata as metadataConstants,
  url,
} from "@/constants/metadata";
import type { NetworkIdParam } from "@/types/app";
import { capitalizeFirstLetter, networks } from "@autonomys/auto-utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<NetworkIdParam>;
}): Promise<Metadata> => {
  const { networkId } = await params;
  return {
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
  };
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return networks
    .filter((n) => n.isLocalhost === undefined)
    .map((n) => ({ networkId: n.id }));
}

export default async function Home({
  params,
}: {
  params: Promise<NetworkIdParam>;
}) {
  const { networkId } = await params;
  const supported = networks.some(
    (n) => n.id === networkId && n.isLocalhost === undefined,
  );
  if (!supported) {
    notFound();
  }

  return (
    <Observatory
      key={networkId}
      networkId={networkId}
      networks={networks
        .filter((network) => network.isLocalhost === undefined)
        .map(({ id, name }) => ({ id, name }))}
    />
  );
}
