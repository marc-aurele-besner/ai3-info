"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-[#576EB2]">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4 text-center text-red-500">
          Oops! Something went wrong
        </h1>
        <p className="text-lg mb-8 text-center text-gray-300">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 border border-[#576EB2] text-[#576EB2] rounded hover:bg-[#576EB2] hover:text-black transition duration-300"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
