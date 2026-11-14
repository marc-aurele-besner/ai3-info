import { permanentRedirect } from "next/navigation";

// Mainnet is the home page. A permanent (308) redirect tells search engines to
// index /space/mainnet instead of treating "/" as a separate, duplicate page.
export default function Home() {
  permanentRedirect("/space/mainnet");
}
