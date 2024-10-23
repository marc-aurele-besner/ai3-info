"use client";

import { CameraControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { FC, Suspense } from "react";
import { Cube } from "./Cube";
import { Ring } from "./Ring";

export const Scene: FC = () => {
  return (
    <Canvas
      camera={{
        position: [100, 100, 60],
        fov: 5,
      }}
    >
      <Suspense fallback={null}>
        <Stars />
        <ambientLight intensity={Math.PI / 1.5} />
        <spotLight
          position={[50, 50, 50]}
          angle={0.15}
          penumbra={1}
          color="#566EB1"
          decay={0}
          intensity={Math.PI * 10}
        />
        <spotLight
          position={[-50, 50, 50]}
          angle={0.15}
          penumbra={1}
          color="#7E91C6"
          decay={0}
          intensity={Math.PI * 10}
        />
        <pointLight
          position={[-10, -10, -10]}
          color="#7E91C6"
          decay={0.3}
          intensity={Math.PI}
        />
        <pointLight
          position={[10, -10, -10]}
          color="#566EB1"
          decay={0.3}
          intensity={Math.PI}
        />
        <pointLight
          position={[-10, 10, -10]}
          color="#566EB1"
          decay={0.3}
          intensity={Math.PI}
        />
        <pointLight
          position={[-10, -50, -30]}
          color="#7E91C6"
          decay={0.3}
          intensity={Math.PI}
        />
        <group rotation={[0, 1, 0]}>
          <Ring />
          <Physics gravity={[0, -40, 0]} timeStep={1}>
            <group>
              <Cube />
              <spotLight
                position={[0, -1, 0]}
                angle={1}
                color="#7E91C6"
                decay={0}
                intensity={Math.PI * 1000}
              />
            </group>
          </Physics>
        </group>
        <CameraControls />
      </Suspense>
    </Canvas>
  );
};
