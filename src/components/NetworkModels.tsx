"use client";

import { Stars, Text, useGLTF } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { GLTF, SVGLoader } from "three-stdlib";
import type { SceneProps } from "./Scene";

type CubeGLTFResult = GLTF & {
  nodes: {
    cube: THREE.Mesh;
  };
  materials: {
    ["Satin Glass"]: THREE.MeshStandardMaterial;
  };
};

type RingGLTFResult = GLTF & {
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

function Boxes({
  playing,
  reducedMotion,
  spread,
  selected,
  onSelect,
  resetKey,
}: SceneProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const invalidate = useThree((state) => state.invalidate);
  const elapsed = useRef(0);
  const gl = useThree((state) => state.gl);
  const bounds = useMemo(() => new THREE.Sphere(new THREE.Vector3(), 4), []);
  useEffect(
    () => () => {
      gl.domElement.style.cursor = "";
    },
    [gl],
  );
  const update = useCallback(
    (time: number) => {
      if (!mesh.current) return;
      const gap = 0.4 + spread * 0.006;
      for (let i = 0; i < 64; i++) {
        const x = i % 4,
          y = Math.floor(i / 4) % 4,
          z = Math.floor(i / 16);
        dummy.position.set((1.5 - x) * gap, (1.5 - y) * gap, (1.5 - z) * gap);
        const angle =
          Math.sin(x / 4 + time) +
          Math.sin(y / 4 + time) +
          Math.sin(z / 4 + time);
        dummy.rotation.set(0, angle, angle * 2);
        dummy.scale.setScalar(i === selected ? 1.6 : 1);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
        mesh.current.setColorAt(
          i,
          color.set(
            i === selected
              ? "#a6ffe1"
              : i === hovered
                ? "#e7eeff"
                : `hsl(217, 71%, ${50 + (i % 10)}%)`,
          ),
        );
      }
      mesh.current.rotation.set(Math.sin(time / 4), Math.sin(time / 2), 0);
      mesh.current.instanceMatrix.needsUpdate = true;
      if (mesh.current.instanceColor)
        mesh.current.instanceColor.needsUpdate = true;
      mesh.current.boundingSphere = bounds;
    },
    [spread, selected, hovered, dummy, color, bounds],
  );
  useLayoutEffect(() => {
    elapsed.current = 0;
  }, [resetKey]);
  useLayoutEffect(() => {
    update(elapsed.current);
    invalidate();
  }, [update, invalidate, resetKey]);
  useFrame((_, delta) => {
    if (!playing || reducedMotion) return;
    elapsed.current += Math.min(delta, 0.1);
    update(elapsed.current);
    invalidate();
  });
  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, 64]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(event.instanceId ?? null);
      }}
      onPointerMove={(event) => {
        setHovered(event.instanceId ?? null);
        event.stopPropagation();
        gl.domElement.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(null);
        gl.domElement.style.cursor = "";
      }}
    >
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

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
            font="/fonts/GeistVF.woff"
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
interface CurvedAutonomysLogoProps {
  url: string;
  radius: number;
  angleRange: number;
  depth: number;
  scale: number;
}

const CurvedAutonomysLogo: React.FC<CurvedAutonomysLogoProps> = ({
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
      position={[-1.5, 0.35, depth]}
      scale={[-scale, scale, scale]}
      rotation={[0, 0, Math.PI]}
    >
      {svgData.paths.map((path, pathIndex) =>
        path.toShapes().map((shape, shapeIndex) => {
          const angle =
            -angleRange / 2 +
            (pathIndex / svgData.paths.length - 0.5) * angleRange;
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
        }),
      )}
    </group>
  );
};

function Models(props: SceneProps) {
  const apiData = props.data ?? {
    blockHeight: "—",
    spacePledged: "Awaiting reading",
    blockchainSize: "Awaiting reading",
  };
  const [ring, cube] = useGLTF(["/models/ring.glb", "/models/cube.glb"]);
  const { nodes: ringNodes, materials: ringMaterials } =
    ring as unknown as RingGLTFResult;
  const { nodes: cubeNodes, materials: cubeMaterials } =
    cube as unknown as CubeGLTFResult;

  return (
    <group dispose={null}>
      <mesh
        geometry={ringNodes.light_strip.geometry}
        material={ringMaterials["Material.001"]}
        scale={[1, 0.54, 1]}
      />
      <mesh
        geometry={ringNodes.rin_base.geometry}
        material={ringMaterials.Material}
        position={[0, -0.215, 0]}
        scale={[1, 1.944, 1]}
      />
      <mesh
        geometry={ringNodes.screen_handles.geometry}
        material={ringMaterials.Material}
        position={[0, 0, -8.5]}
      />
      {/* Autonomys logo + Text */}
      <CurvedAutonomysLogo
        url="/images/Autonomys.svg"
        radius={10}
        angleRange={Math.PI / 10}
        depth={7.75}
        scale={0.003}
      />
      {/* Block Height Text */}
      <CurvedText
        text={`Block Height: ${apiData.blockHeight}`}
        radius={10}
        angleRange={Math.PI / 9.5}
        yOffset={-0.4}
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
        geometry={ringNodes.screen.geometry}
        material={ringMaterials["Satin Glass"]}
        position={[0.08, 0, -8.5]}
        scale={[0.949, 1, 1]}
      />
      <mesh
        geometry={ringNodes.side_pattern.geometry}
        material={ringMaterials["Material.001"]}
        position={[0, -0.688, -0.05]}
      />
      <mesh
        geometry={ringNodes.middle_frame.geometry}
        material={ringMaterials.Material}
        position={[0, 0.1, 0]}
        scale={[1.001, 0.296, 1.001]}
      />
      <mesh
        geometry={ringNodes.top_pattern.geometry}
        material={ringMaterials.Material}
        position={[0, -0.148, 0]}
      />

      {/* The Cube */}
      <group dispose={null}>
        <mesh
          geometry={cubeNodes.cube.geometry}
          material={cubeMaterials["Satin Glass"]}
          scale={2}
          raycast={() => {}}
        />
        <Boxes {...props} />
      </group>
    </group>
  );
}

export function NetworkModels(props: SceneProps) {
  return (
    <>
      <Stars count={props.reducedMotion ? 2000 : 7000} speed={0} />
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
        <Models {...props} />

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
      </group>
    </>
  );
}
