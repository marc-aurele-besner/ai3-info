"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  Suspense,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import type { ApiData } from "@/utils/api";
import { NetworkModels } from "./NetworkModels";

export type SceneProps = {
  view: "station" | "storage";
  data: ApiData | null;
  layout: "globe" | "grid";
  spread: number;
  playing: boolean;
  reducedMotion: boolean;
  selected: number | null;
  onSelect: (index: number | null) => void;
  resetKey: number;
  contribution: number;
  metric: "space" | "chain" | "blocks";
};
export const CELL_COUNT = 125;

function StorageSculpture({
  layout,
  spread,
  playing,
  reducedMotion,
  selected,
  onSelect,
  contribution,
  metric,
  resetKey,
}: SceneProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const invalidate = useThree((state) => state.invalidate);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const current = useMemo(
    () => Array.from({ length: CELL_COUNT }, () => new THREE.Vector3()),
    [],
  );
  const targets = useMemo(
    () =>
      Array.from({ length: CELL_COUNT }, (_, i) => {
        const spacing = 0.57 + spread * 0.005;
        if (layout === "grid")
          return new THREE.Vector3(
            ((i % 5) - 2) * spacing,
            ((Math.floor(i / 5) % 5) - 2) * spacing,
            (Math.floor(i / 25) - 2) * spacing,
          );
        const phi = Math.acos(1 - (2 * (i + 0.5)) / CELL_COUNT);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const radius = 1.85 + spread * 0.014;
        return new THREE.Vector3().setFromSphericalCoords(radius, phi, theta);
      }),
    [layout, spread],
  );

  useEffect(() => {
    group.current?.rotation.set(0.12, 0.2, -0.1);
    invalidate();
  }, [resetKey, invalidate]);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    targets.forEach((target, i) => {
      if (reducedMotion || current[i].lengthSq() === 0) current[i].copy(target);
      dummy.position.copy(current[i]);
      dummy.scale.setScalar(i === selected ? 1.35 : 1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
      color.set(
        i === selected
          ? "#90e4c3"
          : i === hovered
            ? "#c7d5ff"
            : i % 7 === 0
              ? "#9eb4ec"
              : metric === "chain"
                ? "#5ca0b8"
                : metric === "blocks"
                  ? "#8e8bce"
                  : "#576eb2",
      );
      mesh.current!.setColorAt(i, color);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor)
      mesh.current.instanceColor.needsUpdate = true;
    mesh.current.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);
    invalidate();
  }, [
    targets,
    reducedMotion,
    current,
    dummy,
    color,
    selected,
    hovered,
    metric,
    invalidate,
  ]);

  useFrame((_, delta) => {
    if (!mesh.current || !group.current) return;
    let moving = false;
    targets.forEach((target, i) => {
      if (current[i].distanceToSquared(target) > 0.00001) {
        current[i].lerp(target, 1 - Math.exp(-7 * Math.min(delta, 0.1)));
        moving = true;
      }
      dummy.position.copy(current[i]);
      dummy.rotation.set(i * 0.12, i * 0.08, 0);
      dummy.scale.setScalar(i === selected ? 1.35 : 1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (playing && !reducedMotion)
      group.current.rotation.y += Math.min(delta, 0.1) * 0.13;
    if (moving || (playing && !reducedMotion)) invalidate();
  });

  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(
      ".scene-viewport canvas",
    );
    if (canvas) canvas.style.cursor = hovered === null ? "grab" : "pointer";
    return () => {
      if (canvas) canvas.style.cursor = "grab";
    };
  }, [hovered]);

  return (
    <group ref={group} rotation={[0.12, 0.2, -0.1]}>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, CELL_COUNT]}
        onPointerMove={(event) => {
          event.stopPropagation();
          setHovered(event.instanceId ?? null);
        }}
        onPointerOut={() => setHovered(null)}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(event.instanceId ?? null);
        }}
      >
        <boxGeometry args={[0.33, 0.33, 0.33]} />
        <meshStandardMaterial roughness={0.38} metalness={0.12} />
      </instancedMesh>
      <mesh rotation={[Math.PI / 2.6, 0.3, 0]}>
        <torusGeometry args={[3.55, 0.012, 8, 160]} />
        <meshBasicMaterial color="#7e91c6" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 2.6, 0.3, 0]}>
        <torusGeometry args={[3.7, 0.006, 8, 160]} />
        <meshBasicMaterial color="#7e91c6" transparent opacity={0.28} />
      </mesh>
      {contribution > 0 && (
        <mesh position={[3.55, 0.25, 0]}>
          <icosahedronGeometry
            args={[0.15 + (contribution / 1024) * 0.24, 1]}
          />
          <meshStandardMaterial color="#90e4c3" roughness={0.35} />
        </mesh>
      )}
    </group>
  );
}

function Controls({
  resetKey,
  station,
}: {
  resetKey: number;
  station: boolean;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  useEffect(() => {
    controls.current?.reset();
  }, [resetKey]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping={false}
      minDistance={station ? 50 : 6}
      maxDistance={station ? 300 : 16}
    />
  );
}

function Fallback() {
  return (
    <div className="scene-fallback">
      <span aria-hidden="true">◈</span>
      <strong>Your observatory, in 2D.</strong>
      <p>
        3D isn’t available on this device. Explore every reading and the storage
        sandbox below.
      </p>
    </div>
  );
}

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Fallback /> : this.props.children;
  }
}

export function Scene(props: SceneProps) {
  const [lost, setLost] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const probe = document.createElement("canvas");
      const context = probe.getContext("webgl2");
      setSupported(!!context);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setSupported(false);
    }
  }, []);
  const [visible, setVisible] = useState(true);
  const viewport = useRef<HTMLDivElement>(null);
  const inViewport = useRef(true);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      inViewport.current = entry.isIntersecting;
      setVisible(entry.isIntersecting && !document.hidden);
    });
    if (viewport.current) observer.observe(viewport.current);
    const update = () => setVisible(inViewport.current && !document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <div
      ref={viewport}
      className="scene-viewport"
      role="group"
      aria-label="Interactive storage model. Drag to orbit, scroll to zoom. Equivalent controls and data follow the model."
    >
      {supported === null ? (
        <div className="scene-fallback" role="status">
          Preparing the 3D view…
        </div>
      ) : lost || !supported ? (
        <Fallback />
      ) : (
        <SceneBoundary>
          <Canvas
            key={props.view}
            camera={
              props.view === "station"
                ? { position: [100, 100, 60], fov: 7 }
                : { position: [6, 4, 7], fov: 46 }
            }
            dpr={[1, 1.5]}
            frameloop="demand"
            gl={{ antialias: true, powerPreference: "low-power" }}
            fallback={<Fallback />}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener(
                "webglcontextlost",
                (event) => {
                  event.preventDefault();
                  setLost(true);
                },
                { once: true },
              );
            }}
            onPointerMissed={() => props.onSelect(null)}
          >
            <Suspense
              fallback={
                <Html center>
                  <span className="model-loading" role="status">
                    Loading network models…
                  </span>
                </Html>
              }
            >
              {props.view === "station" ? (
                <NetworkModels {...props} playing={props.playing && visible} />
              ) : (
                <>
                  <ambientLight intensity={1.6} />
                  <directionalLight
                    position={[4, 7, 5]}
                    intensity={3}
                    color="#b9ccff"
                  />
                  <directionalLight
                    position={[-5, 2, -3]}
                    intensity={1.5}
                    color="#7e91c6"
                  />
                  <StorageSculpture
                    {...props}
                    playing={props.playing && visible}
                  />
                </>
              )}
            </Suspense>
            <Controls
              resetKey={props.resetKey}
              station={props.view === "station"}
            />
          </Canvas>
        </SceneBoundary>
      )}
    </div>
  );
}
