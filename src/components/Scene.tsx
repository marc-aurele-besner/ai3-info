"use client";

import { MotionPathControls, Stars, useMotion } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { FC, useRef } from "react";
import { CubicBezierCurve3, Group, Object3D, Vector3 } from "three";
import { Cube } from "./Cube";
import { Ring } from "./Ring";

export const Scene: FC = () => {
  const poi = useRef<Group>(new Group());

  return (
    <Canvas
      camera={{
        position: [100, 90, 60],
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
      <group rotation={[0, 1, 0]} ref={poi}>
        {/* Ring Model */}
        <Ring />

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
      <MotionPathControls
        focus={poi}
        damping={0.25}
        focusDamping={0.25}
        smooth={true}
      >
        <CameraPath />
        <Loop />
      </MotionPathControls>
    </Canvas>
  );
};

export const CameraPath: FC = () => {
  return (
    <>
      {[
        [
          new Vector3(100, 90, 60),
          new Vector3(100, 80, 60),
          new Vector3(100, 70, 60),
          new Vector3(100, 60, 60),
          new Vector3(100, 50, 60),
          new Vector3(100, 40, 60),
          new Vector3(100, 30, 60),
        ],
        [
          new Vector3(100, 30, 60),
          new Vector3(100, 40, 60),
          new Vector3(100, 50, 60),
          new Vector3(100, 60, 60),
          new Vector3(100, 70, 60),
          new Vector3(100, 80, 60),
          new Vector3(100, 90, 60),
        ],
      ].map(([v0, v1, v2, v3], index) => (
        <primitive key={index} object={new CubicBezierCurve3(v0, v1, v2, v3)} />
      ))}
    </>
  );
};

const Loop: FC<{ factor?: number }> = ({ factor = 0.15 }) => {
  const motion = useMotion();
  useFrame((state, delta) => (motion.current += Math.min(0.1, delta) * factor));
  return null;
};
