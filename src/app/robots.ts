import type { MetadataRoute } from "next";
import { url } from "@/constants/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}