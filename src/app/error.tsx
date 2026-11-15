"use client";

import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";
import { useEffect } from "react";
import { FiArrowRight, FiRefreshCw } from "react-icons/fi";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="observatory">
      <SiteHeader />
      <main className="status-page">
        <p className="eyebrow">Error / Signal lost</p>
        <h1>Something went wrong</h1>
        <p>{error.message || "An unexpected error occurred"}</p>
        <div className="status-actions">
          <button className="text-button" onClick={reset}>
            <FiRefreshCw aria-hidden="true" /> Try again
          </button>
          <Link href="/space/mainnet" className="text-link">
            Go back home <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
