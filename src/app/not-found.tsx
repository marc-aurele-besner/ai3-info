import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="observatory">
      <SiteHeader />
      <main className="status-page">
        <p className="eyebrow">404 / Off the map</p>
        <h1>Page not found</h1>
        <p>
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved. The network is still out there, though.
        </p>
        <div className="status-actions">
          <Link href="/space/mainnet" className="text-link">
            Explore the network <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
