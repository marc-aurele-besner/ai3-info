"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/Scene").then((m) => m.Scene), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-[60vh] text-[#576EB2]">
      Loading 3D scene...
    </div>
  ),
});

export const SceneLoader = () => <Scene />;
