"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FC, useEffect, useMemo, useRef, useState } from "react";
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

const LARGE_CUBE_SCALE = 2;

const ONE_CUBE_SIDE_LENGTH = 4;
const TOTAL_CUBES =
  ONE_CUBE_SIDE_LENGTH * ONE_CUBE_SIDE_LENGTH * ONE_CUBE_SIDE_LENGTH;

const CUBES_POSITION_RANGE = 0.5;
const CUBE_SCALE = 0.2;
const CUBE_SPACING = 0.2;

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const data = Array.from({ length: TOTAL_CUBES }, () => ({
  color: `hsl(217, 71%, ${50 + Math.random() * 10}%)`,
  scale: 0.1,
}));

export const Cube: FC = (props: JSX.IntrinsicElements["group"]) => {
  const { nodes, materials } = useGLTF("/models/cube.glb") as GLTFResult;

  return (
    <group {...props} dispose={null}>
      {/* <DragControls> */}
      <mesh
        geometry={nodes.cube.geometry}
        material={materials["Satin Glass"]}
        scale={LARGE_CUBE_SCALE}
      />
      <Boxes />
    </group>
  );
};

const Boxes: FC = () => {
  const [hovered, set] = useState<number | undefined>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(TOTAL_CUBES)
          .fill(0)
          .flatMap((_, i) => tempColor.set(data[i].color).toArray())
      ),
    []
  );
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const prevRef = useRef<number | undefined>();
  useEffect(() => void (prevRef.current = hovered), [hovered]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current!.rotation.x = Math.sin(time / 4);
    meshRef.current!.rotation.y = Math.sin(time / 2);
    let i = 0;
    for (let x = 0; x < ONE_CUBE_SIDE_LENGTH; x++)
      for (let y = 0; y < ONE_CUBE_SIDE_LENGTH; y++)
        for (let z = 0; z < ONE_CUBE_SIDE_LENGTH; z++) {
          const id = i++;
          tempObject.position.set(
            CUBES_POSITION_RANGE - x * (CUBE_SCALE + CUBE_SPACING),
            CUBES_POSITION_RANGE - y * (CUBE_SCALE + CUBE_SPACING),
            CUBES_POSITION_RANGE - z * (CUBE_SCALE + CUBE_SPACING)
          );
          tempObject.rotation.y =
            Math.sin(x / 4 + time) +
            Math.sin(y / 4 + time) +
            Math.sin(z / 4 + time);
          tempObject.rotation.z = tempObject.rotation.y * 2;
          if (hovered !== prevRef.current) {
            (id === hovered
              ? tempColor.setRGB(10, 10, 10)
              : tempColor.set(data[id].color)
            ).toArray(colorArray, id * 3);
            meshRef.current!.geometry.attributes.color.needsUpdate = true;
          }
          tempObject.updateMatrix();
          meshRef.current!.setMatrixAt(id, tempObject.matrix);
        }
    meshRef.current!.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, TOTAL_CUBES]}
      onPointerMove={(e) => (e.stopPropagation(), set(e.instanceId))}
      onPointerOut={() => set(undefined)}
    >
      <boxGeometry args={[CUBE_SCALE, CUBE_SCALE, CUBE_SCALE]}>
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </boxGeometry>
      <meshBasicMaterial toneMapped={false} vertexColors />
    </instancedMesh>
  );
};

useGLTF.preload("/models/cube.glb");
