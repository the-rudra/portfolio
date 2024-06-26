"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Float,
  Html,
  Environment,
  useGLTF,
  OrbitControls,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { a as three } from "@react-spring/three";
import { a as web } from "@react-spring/web";
import { useSpring } from "react-spring";

function Model({ open, hinge, ...props }) {
  const group = useRef();
  // Load model
  const { nodes, materials } = useGLTF("/mac-draco.glb");
  // Take care of cursor state on hover
  const [hovered, setHovered] = useState(false);
  useEffect(
    () => void (document.body.style.cursor = hovered ? "pointer" : "auto"),
    [hovered],
  );
  // Make it float in the air when it's opened
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      open ? Math.cos(t / 10) / 10 + 0.25 : 0,
      0.1,
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      open ? Math.sin(t / 10) / 4 : 0,
      0.1,
    );
    // group.current.rotation.z = THREE.MathUtils.lerp(
    //   group.current.rotation.z,
    //   open ? Math.sin(t / 10) / 10 : 0,
    //   0.1,
    // );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      open ? (-6 + Math.sin(t)) / 3 : -4.3,
      0.1,
    );
  });
  // The view was auto-generated by: https://github.com/pmndrs/gltfjsx
  // Events and spring animations were added afterwards
  return (
    <group
      ref={group}
      {...props}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={(e) => setHovered(false)}
      dispose={null}
    >
      <three.group rotation-x={hinge} position={[0, -0.04, 0.41]}>
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            material={materials.aluminium}
            geometry={nodes["Cube008"].geometry}
          />
          <mesh
            material={materials["matte.001"]}
            geometry={nodes["Cube008_1"].geometry}
          />
          <mesh
            material={materials["screen.001"]}
            geometry={nodes["Cube008_2"].geometry}
          />
        </group>
      </three.group>
      <mesh
        material={materials.keys}
        geometry={nodes.keyboard.geometry}
        position={[1.79, 0, 3.45]}
      />
      <group position={[0, -0.1, 3.39]}>
        <mesh
          material={materials.aluminium}
          geometry={nodes["Cube002"].geometry}
        />
        <mesh
          material={materials.trackpad}
          geometry={nodes["Cube002_1"].geometry}
        />
      </group>
      <mesh
        material={materials.touchbar}
        geometry={nodes.touchbar.geometry}
        position={[0, -0.03, 1.2]}
      />
    </group>
  );
}

export function Shapes() {
  const [open, setOpen] = useState(false);
  const [isPotrait, setIsPotrait] = useState(false);
  // We turn this into a spring animation that interpolates between 0 and 1
  const props = useSpring({ open: Number(open) });
  useEffect(() => {
    if (window.innerHeight > window.innerWidth) {
      setIsPotrait(true);
    } else {
      setIsPotrait(false);
    }
  }, []);
  return (
    <web.main
      // style={{ background: props.open.to([0, 1], ["#f0f0f0", "#d25578"]) }}
      className="h-[75vh] w-full overflow-x-hidden"
    >
      <web.h1
        style={{
          opacity: props.open.to([0, 1], [1, 0]),
          transform: props.open.to(
            (o) => `translate3d(-50%,${o * 50 - 100}px,0)`,
          ),
        }}
        className="absolute left-1/2 top-1/3 m-0 -translate-x-1/2 -translate-y-1/2 transform p-0 text-4xl font-normal tracking-tighter text-white sm:top-1/2 sm:whitespace-nowrap md:top-1/2 md:text-6xl xl:top-1/3 xl:text-8xl"
      >
        hello!
        <br />i{"'"}m rudra
        <br />
        welcome to my portfolio ツ
      </web.h1>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, -30], fov: 35 }}>
        <three.pointLight
          position={[10, 10, 10]}
          intensity={1.5}
          color={props.open.to([0, 1], ["#f0f0f0", "#d25578"])}
        />
        <Suspense fallback={null}>
          <group
            rotation={[0, Math.PI, 0]}
            onClick={(e) => (e.stopPropagation(), setOpen(!open))}
            scale={isPotrait ? [0.85, 0.85, 0.85] : [1.25, 1.25, 1.25]}
          >
            <Model open={open} hinge={props.open.to([0, 1], [1.575, -0.425])} />
          </group>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </web.main>
  );
}
