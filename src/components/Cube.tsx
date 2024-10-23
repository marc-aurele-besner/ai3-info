"use client";

import { Lightformer, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { BallCollider, CuboidCollider, RigidBody } from "@react-three/rapier";
import { FC, useCallback, useRef } from "react";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api = useRef<any>();
  const { viewport } = useThree();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCollisionEnter = useCallback((state: any) => {
    state.api.reset();
    api.current.setTranslation({ x: 0, y: 4, z: 0 });
    api.current.setLinvel({ x: 0, y: 4, z: 0 });
  }, []);

  return (
    <group {...props} dispose={null}>
      <RigidBody
        ccd
        ref={api}
        angularDamping={0.8}
        restitution={1}
        canSleep={false}
        colliders={false}
        enabledTranslations={[true, true, false]}
      >
        <BallCollider args={[0.5]} />
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
      </RigidBody>

      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, -viewport.height * 2, 0]}
        restitution={2.1}
        onCollisionEnter={onCollisionEnter}
      >
        <CuboidCollider args={[1000, 2, 1000]} />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, viewport.height * 4, 0]}
        restitution={2.1}
        onCollisionEnter={onCollisionEnter}
      >
        <CuboidCollider args={[1000, 2, 1000]} />
      </RigidBody>
    </group>
  );
};

useGLTF.preload("/models/cube.glb");
