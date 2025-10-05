// components/PlanetLogo.jsx
import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Planet() {
  const planetTexture = useLoader(THREE.TextureLoader, "/textures/planet.jpg");
  const ringTexture = useLoader(THREE.TextureLoader, "/textures/ring.png");

  return (
    <group rotation={[0.4, 0.2, 0]} scale={0.8}>
      {/* Planet */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={planetTexture} />
      </mesh>

      {/* Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.8, 128]} />
        <meshBasicMaterial
          map={ringTexture}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

export default function PlanetLogo() {
  return (
    <div className="w-20 h-20 flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
          <Planet />
        </Suspense>
      </Canvas>
    </div>
  );
}
