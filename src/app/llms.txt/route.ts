import { fieldNotes, farmingDocsUrl } from "@/constants/faq";
import { githubUrl, networkLabel, url } from "@/constants/metadata";
import { networks } from "@autonomys/auto-utils";

// llms.txt (https://llmstxt.org): a Markdown summary for AI assistants,
// generated from the same network list as the sitemap so it never drifts.
export const dynamic = "force-static";

export function GET() {
  const publicNetworks = networks.filter((n) => n.isLocalhost === undefined);
  const pages = publicNetworks
    .map(
      (n) =>
        `- [Autonomys ${networkLabel(n)}](${url}/space/${n.id}): space pledged, blockchain size and block height for ${n.name}, with a 3D view and storage calculator`,
    )
    .join("\n");
  const api = publicNetworks
    .map(
      (n) =>
        `- [${networkLabel(n)} readings (JSON)](${url}/api/data/${n.id}): latest reading for ${n.name}`,
    )
    .join("\n");
  const faq = fieldNotes(64)
    .map(({ question, answer }) => `### ${question}\n\n${answer}`)
    .join("\n\n");

  const body = `# AI3 Info

> AI3 Info (${url}) is a free, open-source explorer for the Autonomys Network (AI3). It shows live network readings (total space pledged by farmers, blockchain size and block height) for Autonomys Mainnet and its public testnets, in an interactive 3D observatory with a calculator that compares your own storage with the network.

- Readings are refreshed every 30 seconds in the browser; the API may serve a cached reading, flagged with \`"cached": true\` and an \`updatedAt\` ISO timestamp.
- Storage values use decimal units (1 TB = 1,000 GB). The calculator compares capacity only; it is not a farming reward estimate.
- Built by Marc-Aurèle Besner.

## Network pages

${pages}

## Data API

Each endpoint returns JSON: \`blockHeight\`, \`spacePledged\` and \`blockchainSize\` (human-readable), \`spacePledgedBytes\` and \`blockchainSizeBytes\` (exact byte counts as strings), \`updatedAt\` and \`cached\`.

${api}

## FAQ

${faq}

## Optional

- [Autonomys Network](https://autonomys.xyz): official project site
- [Autonomys documentation](${farmingDocsUrl}): farming and network documentation
- [Source code](${githubUrl}): AI3 Info on GitHub
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
