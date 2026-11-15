import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/space/mainnet" className="wordmark" aria-label="AI3 Info home">
        <Image src="/images/ai3-info.svg" alt="" width={42} height={42} />
        <span>AI3 Info</span>
      </Link>
      <span className="header-caption">Explore the Autonomys Network</span>
      <a
        className="text-link"
        href="https://autonomys.xyz"
        target="_blank"
        rel="noreferrer"
      >
        Meet Autonomys <FiArrowUpRight />
      </a>
    </header>
  );
}
