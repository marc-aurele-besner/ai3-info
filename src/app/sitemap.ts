import { url } from "@/constants/metadata";
import { networks } from "@autonomys/auto-utils";
import type { MetadataRoute } from "next";

// "/" permanently redirects to /space/mainnet, so only the canonical network
// pages are listed. Their readings change with every block, so the generation
// time is an honest lastmod.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return networks
    .filter((n) => n.isLocalhost === undefined)
    .map((n) => ({
      url: `${url}/space/${n.id}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: n.id === "mainnet" ? 1 : 0.7,
    }));
}
