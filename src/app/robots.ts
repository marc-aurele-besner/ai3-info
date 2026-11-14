import { url } from "@/constants/metadata";
import type { MetadataRoute } from "next";

// Open to search engines and AI assistants (OAI-SearchBot, ChatGPT-User,
// Claude-SearchBot, PerplexityBot, …) through the wildcard group. The JSON
// data API stays crawlable so assistants can fetch live readings (see
// /llms.txt).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${url}/sitemap.xml`,
  };
}
