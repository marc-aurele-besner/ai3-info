import { Metadata } from "next";

// The apex domain (ai3.info) permanently redirects to www, so production
// canonicals, the sitemap and Open Graph URLs must use the www origin.
// Otherwise every canonical points at a redirect and search engines have to
// guess which host is authoritative.
export const productionUrl = "https://www.ai3.info";

const isProduction =
  (process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV) ===
  "production";

export const url = (
  isProduction
    ? productionUrl
    : process.env.NEXT_PUBLIC_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
).replace(/\/+$/, "");

export const siteName = "AI3 Info";
const title = "AI3 Info — Autonomys Network Explorer & Space Pledged Tracker";
const description =
  "Live Autonomys (AI3) network stats: total space pledged by farmers, blockchain size and block height, in an interactive 3D observatory with a storage calculator.";
const keywords = [
  "Autonomys",
  "AI3",
  "Autonomys Network",
  "space pledged",
  "Autonomys space pledged",
  "Autonomys mainnet",
  "Autonomys farming",
  "proof of archival storage",
  "blockchain size",
  "block height",
  "Chronos testnet",
  "Taurus testnet",
];
const author = {
  name: "Marc-Aurèle Besner",
  url: "https://marcaureleb.com",
};
const twitter = "@marcaureleb";
export const githubUrl = "https://github.com/marc-aurele-besner/ai3-info";
const authorProfiles = [
  author.url,
  "https://github.com/marc-aurele-besner",
  "https://www.linkedin.com/in/marc-aurele-besner/",
  "https://x.com/marcaureleb",
];

export const images = {
  url: url + "/images/ai3-info-og.png",
  secureUrl: url + "/images/ai3-info-og.png",
  width: 1200,
  height: 630,
  alt: "AI3 Info — Autonomys network explorer",
};

export const metadata: Metadata = {
  title: { default: title, template: `%s · ${siteName}` },
  description,
  applicationName: siteName,
  icons: {
    icon: "/favicon.ico",
    apple: "/favicons/apple-icon-180x180.png",
  },
  manifest: "/manifest.json",
  metadataBase: new URL(url),
  keywords,
  authors: [author],
  creator: author.name,
  publisher: author.name,
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    types: { "text/plain": `${url}/llms.txt` },
  },
  openGraph: {
    title,
    type: "website",
    url,
    siteName,
    locale: "en_US",
    description,
    images,
  },
  twitter: {
    card: "summary_large_image",
    site: twitter,
    creator: twitter,
    description,
    title,
    images,
  },
  formatDetection: { telephone: false },
};

export type NetworkSummary = { id: string; name: string };

/** "Mainnet", "Chronos Testnet", … — reads better in titles than "Testnet - Chronos". */
export const networkLabel = ({ id, name }: NetworkSummary) => {
  const match = /^testnet\s*-\s*(.+)$/i.exec(name);
  return match ? `${match[1]} Testnet` : name || id;
};

export const networkTitle = (network: NetworkSummary) =>
  `Autonomys ${networkLabel(network)} Space Pledged & Stats`;

export const networkDescription = (network: NetworkSummary) =>
  `Live Autonomys ${networkLabel(network)} stats: space pledged by farmers, blockchain size and block height. Explore them in 3D and compare your own storage.`;

const authorEntity = {
  "@type": "Person",
  "@id": `${url}/#author`,
  name: author.name,
  url: author.url,
  sameAs: authorProfiles,
};

/** JSON-LD graph for a network page. Only describes content visible on the page. */
export const networkJsonLd = (
  network: NetworkSummary,
  faq: { question: string; answer: string }[],
  dateModified?: string,
) => {
  const pageUrl = `${url}/space/${network.id}`;
  const label = networkLabel(network);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url: `${url}/`,
        name: siteName,
        alternateName: "AI3.info",
        description,
        inLanguage: "en",
        publisher: { "@id": `${url}/#author` },
      },
      authorEntity,
      {
        "@type": "WebApplication",
        "@id": `${url}/#app`,
        name: siteName,
        url: `${url}/`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any (web browser)",
        browserRequirements: "Requires JavaScript and WebGL for the 3D view",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description,
        author: { "@id": `${url}/#author` },
        codeRepository: githubUrl,
        about: {
          "@type": "Thing",
          name: "Autonomys Network",
          url: "https://autonomys.xyz",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: networkTitle(network),
        description: networkDescription(network),
        inLanguage: "en",
        isPartOf: { "@id": `${url}/#website` },
        mainEntity: { "@id": `${url}/#app` },
        primaryImageOfPage: `${pageUrl}/image`,
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        ...(dateModified ? { dateModified } : {}),
        about: {
          "@type": "Thing",
          name: `Autonomys ${label}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: siteName,
            item: `${url}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: label,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        isPartOf: { "@id": `${pageUrl}#webpage` },
        mainEntity: faq.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };
};
