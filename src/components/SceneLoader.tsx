"use client";

import dynamic from "next/dynamic";
import { memo } from "react";
import type { SceneProps } from "./Scene";

const Scene = dynamic(() => import("./Scene").then((module) => module.Scene), {
  ssr: false,
  loading: () => (
    <div className="scene-fallback" role="status">
      <span aria-hidden="true">◈</span>
      <p>Assembling your observatory…</p>
    </div>
  ),
});

// Memoized so the page's once-a-second freshness tick does not re-render the
// 3D tree: every drei <Text> re-syncs and requests a new frame on each render.
export const SceneLoader = memo(function SceneLoader(props: SceneProps) {
  return <Scene {...props} />;
});
