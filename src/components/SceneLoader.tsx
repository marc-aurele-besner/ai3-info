"use client";

import dynamic from "next/dynamic";
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

export const SceneLoader = (props: SceneProps) => <Scene {...props} />;
