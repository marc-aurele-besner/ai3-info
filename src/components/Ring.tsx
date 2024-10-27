"use client";

import { ApiData, fetchApiData } from "@/utils/api";
import { Text, useGLTF } from "@react-three/drei";
import { extend, useLoader } from "@react-three/fiber";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ShapeGeometry } from "three";
import { GLTF, SVGLoader } from "three-stdlib";

extend({ ShapeGeometry });

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
    ["Material.001"]: THREE.MeshStandardMaterial;
    Material: THREE.MeshStandardMaterial;
    ["Satin Glass"]: THREE.MeshStandardMaterial;
  };
};

export const Ring: FC = (props: JSX.IntrinsicElements["group"]) => {
  const { nodes, materials } = useGLTF("/models/ring.glb") as GLTFResult;
  const [apiData, setApiData] = useState<ApiData>({
    spacePledged: "loading...",
    blockchainSize: "loading...",
  });

  const fetchData = useCallback(async () => {
    const { spacePledged, blockchainSize } = await fetchApiData();
    setApiData({ spacePledged, blockchainSize });
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchData]);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.light_strip.geometry}
        material={materials["Material.001"]}
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
      {/* Autonomys logo + Text */}
      <CurvedSVGText
        url="images/Autonomys.svg"
        radius={10}
        angleRange={Math.PI / 10}
        depth={7.8}
        scale={0.003}
      />
      {/* Space Pledge Text */}
      <CurvedText
        text={`Space Pledged: ${apiData.spacePledged}`}
        radius={10}
        angleRange={Math.PI / 9.5}
        yOffset={-0.7}
      />
      {/* Blockchain size */}
      <CurvedText
        text={`Chain size: ${apiData.blockchainSize}`}
        radius={10}
        angleRange={Math.PI / 9.5}
        yOffset={-1}
      />
      <mesh
        geometry={nodes.screen.geometry}
        material={materials["Satin Glass"]}
        position={[0.08, 0, -8.5]}
        scale={[0.949, 1, 1]}
      />
      <mesh
        geometry={nodes.side_pattern.geometry}
        material={materials["Material.001"]}
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

interface CurvedTextProps {
  text: string;
  radius: number;
  angleRange: number;
  yOffset: number;
}

const CurvedText: FC<CurvedTextProps> = ({
  text,
  radius,
  angleRange,
  yOffset,
}) => {
  return (
    <group>
      {Array.from(text).map((char, index) => {
        const angle =
          -angleRange / 2 + (index / (text.length - 1)) * angleRange;
        const x = radius * Math.sin(angle);
        const z = radius * Math.cos(angle) - 2.15;

        return (
          <Text
            key={index}
            position={[x, yOffset, z]}
            rotation={[0, angle, 0]}
            fontSize={0.25}
            fontWeight={700}
            maxWidth={0.5}
            textAlign="left"
            overflowWrap="break-word"
            color={"#566EB1"}
            letterSpacing={-0.1}
          >
            {char}
          </Text>
        );
      })}
    </group>
  );
};
interface CurvedSVGTextProps {
  url: string;
  radius: number;
  angleRange: number;
  depth: number;
  scale: number;
}

const CurvedSVGText: React.FC<CurvedSVGTextProps> = ({
  url,
  radius,
  angleRange,
  depth,
  scale,
}) => {
  const svgData = useLoader(SVGLoader, url);
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group
      ref={groupRef}
      position={[-1.5, -0.15, depth]}
      scale={[-scale, scale, scale]}
      rotation={[0, 0, Math.PI]}
    >
      {svgData.paths.map((path: THREE.ShapePath, pathIndex: number) =>
        path.toShapes(true).map((shape: THREE.Shape, shapeIndex: number) => {
          const angle =
            -angleRange / 2 +
            (pathIndex / svgData.paths.length - 0.4) * angleRange;
          const x = radius * Math.sin(angle);
          const z = radius * Math.cos(angle) - 2.1;

          return (
            <mesh
              key={`${pathIndex}-${shapeIndex}`}
              position={[x, 0.05, z]}
              rotation={[0, angle, 0]}
            >
              <shapeGeometry args={[shape]} />
              <meshBasicMaterial color={"#566EB1"} />
            </mesh>
          );
        })
      )}
    </group>
  );
};

useGLTF.preload("/models/ring.glb");
