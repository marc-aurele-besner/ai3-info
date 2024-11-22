"use client";

import { CameraControls, Loader, Stars, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { FC, Suspense } from "react";
import { Cube } from "./Cube";
// import { RingCompressed } from "./RingCompressed";

const Ring = dynamic(() => import("./Ring").then((mod) => mod.Ring), {
  ssr: false,
});
export const Scene: FC = () => {
  return (
    <>
      <Suspense fallback={<span>loading...</span>}>
        <Canvas
          camera={{
            position: [100, 100, 60],
            fov: 5,
          }}
        >
          <Stars count={50000} />
          <ambientLight intensity={Math.PI / 1.5} />
          {/* Key Top Light */}
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
          <spotLight
            position={[50, 50, -50]}
            angle={0.15}
            penumbra={1}
            color="#566EB1"
            decay={0}
            intensity={Math.PI * 10}
          />
          <spotLight
            position={[-50, 50, -50]}
            angle={0.15}
            penumbra={1}
            color="#7E91C6"
            decay={0}
            intensity={Math.PI * 10}
          />

          {/* Side Outside Ring Light - Left Front */}
          <pointLight
            position={[-15, 1, 15]}
            color="#7E91C6"
            decay={0.5}
            intensity={Math.PI * 8}
          />
          {/* Side Outside Ring Light - Right Front */}
          <pointLight
            position={[15, 1, 15]}
            color="#7E91C6"
            decay={0.5}
            intensity={Math.PI * 8}
          />
          {/* Side Outside Ring Light - Left Back */}
          <pointLight
            position={[-15, 1, -15]}
            color="#7E91C6"
            decay={0.5}
            intensity={Math.PI * 8}
          />
          {/* Side Outside Ring Light - Right Back */}
          <pointLight
            position={[15, 1, -15]}
            color="#7E91C6"
            decay={0.5}
            intensity={Math.PI * 8}
          />

          {/* Rotate Ring Model */}
          <group rotation={[0, 1, 0]}>
            {/* Ring Model */}
            {/* <Suspense fallback={<RingCompressed />}> */}
            <Ring />
            {/* </Suspense> */}

            {/* Top Spot Light */}
            <spotLight
              position={[0, 15, 0]}
              angle={25}
              color="#566EB1"
              decay={0}
              intensity={Math.PI * 100}
            />
            {/* Bottom Spot Light */}
            <spotLight
              position={[0, -15, 0]}
              angle={1}
              color="#566EB1"
              decay={1}
              intensity={Math.PI * 100}
            />

            {/* Top Spot Light - Front Facing Arc around Cube */}
            <spotLight
              position={[0, -10, 2.5]}
              angle={1}
              color="#566EB1"
              decay={1}
              intensity={Math.PI * 100}
            />
            <spotLight
              position={[0, -7.5, 2.5]}
              angle={1}
              color="#566EB1"
              decay={1}
              intensity={Math.PI * 100}
            />
            <spotLight
              position={[0, -5, 5]}
              angle={1}
              color="#566EB1"
              decay={1}
              intensity={Math.PI * 100}
            />
            <spotLight
              position={[0, -2.5, 7.5]}
              angle={1}
              color="#566EB1"
              decay={1}
              intensity={Math.PI * 100}
            />
            <spotLight
              position={[0, 2.5, 7.5]}
              angle={1}
              color="#566EB1"
              decay={1}
              intensity={Math.PI * 100}
            />
            <spotLight
              position={[0, 5, 5]}
              angle={1}
              color="#566EB1"
              decay={1}
              intensity={Math.PI * 100}
            />
            <spotLight
              position={[0, 7.5, 2.5]}
              angle={1}
              color="#566EB1"
              decay={1}
              intensity={Math.PI * 100}
            />
            <spotLight
              position={[0, 10, 2.5]}
              angle={1}
              color="#566EB1"
              decay={1}
              intensity={Math.PI * 100}
            />

            {/* Front Facing Inside Ring Light */}
            <spotLight
              position={[0, 0, 7.5]}
              angle={0.5}
              color="#566EB1"
              decay={1}
              intensity={Math.PI * 100}
            />
            {/* Back Facing Inside Ring Light */}
            <spotLight
              position={[0, 0, -7.5]}
              angle={2}
              color="#566EB1"
              decay={1}
              intensity={Math.PI * 100}
            />
            {/* Left Facing Inside Ring Light */}
            <spotLight
              position={[-7.5, 0, 0]}
              angle={2}
              color="#566EB1"
              decay={1}
              intensity={Math.PI * 100}
            />
            {/* Right Facing Inside Ring Light */}
            <spotLight
              position={[7.5, 0, 0]}
              angle={2}
              color="#566EB1"
              decay={1}
              intensity={Math.PI * 100}
            />

            {/* The Cube */}
            <Cube />
          </group>
          <CameraControls />
        </Canvas>
      </Suspense>
      <Loader />
    </>
  );
};

// useGLTF.preload("/models/ring-transformed.glb");
