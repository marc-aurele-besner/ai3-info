"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiData, fetchApiData } from "./api";

export function useNetworkData(networkId: string, demo: boolean) {
  const [data, setData] = useState<ApiData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<number[]>([]);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    if (demo) return;
    let disposed = false;
    let active: AbortController | null = null;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      if (disposed) return;
      if (document.hidden) {
        timer = setTimeout(poll, 10000);
        return;
      }
      active = new AbortController();
      const timeout = setTimeout(() => active?.abort(), 12000);
      setLoading(true);
      try {
        const next = await fetchApiData(networkId, active.signal);
        if (disposed) return;
        setData(next);
        setError(null);
        setHistory((previous) =>
          previous.at(-1) === next.blockHeight
            ? previous
            : [...previous, next.blockHeight].slice(-6),
        );
      } catch {
        if (!disposed)
          setError(
            "Live readings are unavailable. Retry, or explore with sample data.",
          );
      } finally {
        clearTimeout(timeout);
        if (!disposed) {
          setLoading(false);
          timer = setTimeout(poll, 30000);
        }
      }
    }
    void poll();
    return () => {
      disposed = true;
      active?.abort();
      clearTimeout(timer);
    };
  }, [networkId, demo, revision]);

  return { data, error, loading, history, refresh };
}
