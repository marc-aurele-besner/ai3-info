import { Observatory } from "@/components/Observatory";
import { fieldNotes } from "@/constants/faq";
import {
  images,
  metadata as metadataConstants,
  networkDescription,
  networkJsonLd,
  networkLabel,
  networkTitle,
  url,
} from "@/constants/metadata";
import type { NetworkIdParam } from "@/types/app";
import { getNetworkSnapshot } from "@/utils/snapshot";
import { networks } from "@autonomys/auto-utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Re-render the prerendered HTML periodically so the server-side snapshot of
// network readings stays reasonably fresh for crawlers.
export const revalidate = 300;

const publicNetworks = networks
  .filter((network) => network.isLocalhost === undefined)
  .map(({ id, name }) => ({ id, name }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<NetworkIdParam>;
}): Promise<Metadata> => {
  const { networkId } = await params;
  const network = publicNetworks.find((n) => n.id === networkId);
  if (!network) return {};
  const title = networkTitle(network);
  const description = networkDescription(network);
  const pageUrl = `${url}/space/${networkId}`;
  const image = {
    ...images,
    url: `${pageUrl}/image`,
    secureUrl: `${pageUrl}/image`,
    alt: `Autonomys ${networkLabel(network)} network readings on AI3 Info`,
  };
  return {
    title,
    description,
    openGraph: {
      ...metadataConstants.openGraph,
      title,
      description,
      url: pageUrl,
      images: image,
    },
    twitter: {
      ...metadataConstants.twitter,
      title,
      description,
      images: image,
    },
    alternates: {
      ...metadataConstants.alternates,
      canonical: pageUrl,
    },
  };
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return publicNetworks.map((n) => ({ networkId: n.id }));
}

export default async function Home({
  params,
}: {
  params: Promise<NetworkIdParam>;
}) {
  const { networkId } = await params;
  const network = publicNetworks.find((n) => n.id === networkId);
  if (!network) {
    notFound();
  }
  const snapshot = await getNetworkSnapshot(networkId);
  const jsonLd = networkJsonLd(network, fieldNotes(64), snapshot?.updatedAt);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Observatory
        key={networkId}
        networkId={networkId}
        networks={publicNetworks}
        initialData={snapshot}
      />
    </>
  );
}
