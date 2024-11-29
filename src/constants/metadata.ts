import { Metadata } from "next";

export const url = "https://localhost:3000";

const title = "AI3 Info";
const description = "Get info on Autonomys Network";
const keywords = "Autonomys, AI3, Info, Network, Blockchain";
const organization = "Marc-Aurèle Besner";
const twitter = "@marcaureleb";

export const images = {
  url: url + "/images/share.png",
  secureUrl: url + "image/png",
  width: 900,
  height: 600,
  alt: title,
};

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/favicon.ico", apple: "/favicon.ico" },
  manifest: "/manifest.json",
  metadataBase: new URL(url),
  keywords: keywords ? keywords.split(",") : [],
  authors: {
    name: organization,
    url: "https://marcaureleb.com",
  },
  publisher: organization,
  robots: { index: true, follow: true },
  openGraph: {
    title,
    type: "website",
    url,
    siteName: title,
    description,
    images,
  },
  twitter: {
    card: "summary_large_image",
    site: twitter,
    description,
    title,
    images,
  },
  formatDetection: { telephone: true },
};
