"use client";

import { Lightformer, useGLTF } from "@react-three/drei";
import { FC } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    cube: THREE.Mesh;
  };
  materials: {
    ["Satin Glass"]: THREE.MeshStandardMaterial;
  };
};

export const Cube: FC = (props: JSX.IntrinsicElements["group"]) => {
  const { nodes, materials } = useGLTF("/models/cube.glb") as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.cube.geometry}
        material={materials["Satin Glass"]}
        scale={0.991}
      />
      <hemisphereLight intensity={0.5} />
      <Lightformer
        color="blue"
        intensity={1}
        scale={[1.8, 0.2, 1]}
        position={[0, 0.7, 0.85]}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />
      <Lightformer
        color="blue"
        intensity={1}
        scale={[1.8, 0.2, 1]}
        position={[0, 0.7, -0.85]}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />
      <Lightformer
        color="blue"
        intensity={1}
        scale={[1.8, 0.2, 1]}
        position={[0, -0.7, 0.85]}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />
      <Lightformer
        color="blue"
        intensity={1}
        scale={[1.8, 0.2, 1]}
        position={[0, 0 - 0.7, -0.85]}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />
    </group>
  );
};

useGLTF.preload("/models/cube.glb");
