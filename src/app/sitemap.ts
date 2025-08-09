import type { MetadataRoute } from "next";
import { url } from "@/constants/metadata";
import { networks } from "@autonomys/auto-utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${url}/`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...networks
      .filter((n) => n.isLocalhost === undefined)
      .map((n) => ({
        url: `${url}/space/${n.id}`,
        lastModified: now,
        changeFrequency: "hourly" as const,
        priority: 0.8,
      })),
  ];
  return entries;
}