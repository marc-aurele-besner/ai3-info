"use client";

import { FC } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    cube: THREE.Mesh;
  };
  materials: {
    ["Material.002"]: THREE.MeshStandardMaterial;
  };
};

export const Cube: FC = (props: JSX.IntrinsicElements["group"]) => {
  const { nodes, materials } = useGLTF("/models/cube.glb") as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.cube.geometry}
        material={materials["Material.002"]}
        scale={0.991}
      />
    </group>
  );
};

useGLTF.preload("/models/cube.glb");
