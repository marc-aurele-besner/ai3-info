"use client";

import { NetworkIdParam } from "@/types/app";
import { ApiData, DEFAULT_API_DATA, fetchApiData } from "@/utils/api";
import {
  CameraControls,
  Loader,
  Stars,
  Text,
  useGLTF,
} from "@react-three/drei";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { useParams } from "next/navigation";
import {
  FC,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { ShapeGeometry } from "three";
import { GLTF, SVGLoader } from "three-stdlib";

extend({ ShapeGeometry });

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

const LARGE_CUBE_SCALE = 2;

const ONE_CUBE_SIDE_LENGTH = 4;
const TOTAL_CUBES =
  ONE_CUBE_SIDE_LENGTH * ONE_CUBE_SIDE_LENGTH * ONE_CUBE_SIDE_LENGTH;

const CUBES_POSITION_RANGE = 0.5;
const CUBE_SCALE = 0.2;
const CUBE_SPACING = 0.2;

const Boxes: FC = () => {
  const [hovered, set] = useState<number | undefined>();

  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const prevRef = useRef<number | undefined>();

  const tempObject = new THREE.Object3D();
  const tempColor = new THREE.Color();

  const data = useMemo(
    () =>
      Array.from({ length: TOTAL_CUBES }, () => ({
        color: `hsl(217, 71%, ${50 + Math.random() * 10}%)`,
        scale: 0.1,
      })),
    []
  );

  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(TOTAL_CUBES)
          .fill(0)
          .flatMap((_, i) => tempColor.set(data[i].color).toArray())
      ),
    []
  );

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (hovered !== (prevRef as any).Current) {
            (id === hovered
              ? tempColor.setRGB(10, 10, 10)
              : tempColor.set(data[id].color)
            ).toArray(colorArray, id * 3);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (meshRef as any).current.geometry.attributes.color.needsUpdate =
              true;
          }
          tempObject.updateMatrix();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (meshRef as any).current.setMatrixAt(id, tempObject.matrix);
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
      {svgData.paths.map((path: THREE.ShapePath, pathIndex: number) =>
        path.toShapes(true).map((shape: THREE.Shape, shapeIndex: number) => {
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
        })
      )}
    </group>
  );
};

export const Models: FC = (props: JSX.IntrinsicElements["group"]) => {
  const [ring, cube] = useGLTF(["/models/ring.glb", "/models/cube.glb"]);
  const { nodes: ringNodes, materials: ringMaterials } = ring as RingGLTFResult;
  const { nodes: cubeNodes, materials: cubeMaterials } = cube as CubeGLTFResult;

  const { networkId } = useParams<NetworkIdParam>();
  const [apiData, setApiData] = useState<ApiData>(DEFAULT_API_DATA);

  const fetchData = useCallback(async () => {
    const data = await fetchApiData(networkId);
    setApiData(data);
  }, [networkId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchData]);

  return (
    <group {...props} dispose={null}>
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
      <group {...props} dispose={null}>
        <mesh
          geometry={cubeNodes.cube.geometry}
          material={cubeMaterials["Satin Glass"]}
          scale={LARGE_CUBE_SCALE}
        />
        <Boxes />
      </group>
    </group>
  );
};

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
            <Models />

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
          <CameraControls />
        </Canvas>
      </Suspense>
      <Loader />
    </>
  );
};

useGLTF.preload(["/models/ring.glb", "/models/cube.glb"]);
