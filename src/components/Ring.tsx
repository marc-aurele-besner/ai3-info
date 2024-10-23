"use client";

import { useGLTF } from "@react-three/drei";
import { FC } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    light_strip: THREE.Mesh;
    rin_base: THREE.Mesh;
    screen_handles: THREE.Mesh;
    screen: THREE.Mesh;
    side_pattern: THREE.Mesh;
    middle_frame: THREE.Mesh;
    top_pattern: THREE.Mesh;
  };
  materials: {
    ["Satin Glass"]: THREE.MeshStandardMaterial;
    Material: THREE.MeshStandardMaterial;
  };
  // animations: GLTFAction[]
};

export const Ring: FC = (props: JSX.IntrinsicElements["group"]) => {
  const { nodes, materials } = useGLTF("/models/ring.glb") as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.light_strip.geometry}
        material={materials["Satin Glass"]}
        scale={[1, 0.54, 1]}
      />
      <mesh
        geometry={nodes.rin_base.geometry}
        material={materials.Material}
        position={[0, -0.215, 0]}
        scale={[1, 1.944, 1]}
      />
      <mesh
        geometry={nodes.screen_handles.geometry}
        material={materials.Material}
        position={[0, 0, -8.5]}
      />
      <mesh
        geometry={nodes.screen.geometry}
        material={materials["Satin Glass"]}
        position={[0.08, 0, -8.5]}
        scale={[0.949, 1, 1]}
      />
      <mesh
        geometry={nodes.side_pattern.geometry}
        material={materials["Satin Glass"]}
        position={[0, -0.688, -0.05]}
      />
      <mesh
        geometry={nodes.middle_frame.geometry}
        material={materials.Material}
        position={[0, 0.1, 0]}
        scale={[1.001, 0.296, 1.001]}
      />
      <mesh
        geometry={nodes.top_pattern.geometry}
        material={materials.Material}
        position={[0, -0.148, 0]}
      />
    </group>
  );
};

useGLTF.preload("/models/ring.glb");
