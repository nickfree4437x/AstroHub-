// src/components/solar/Sun.jsx
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function Sun() {
  const ref = useRef();

  // Load Sun texture
  const texture = useLoader(THREE.TextureLoader, "/textures/2k_sun.jpg");

  // Self rotation
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002; // faster spin for Sun
    }
  });

  return (
    <mesh ref={ref}>
      {/* Sun Sphere with texture */}
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        emissive={"#FDB813"}       // glow effect
        emissiveIntensity={1.2}
      />

      {/* Sun Light */}
      <pointLight intensity={3} distance={150} color={"#fff7cc"} />

      {/* Outer Glow */}
      <mesh>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshBasicMaterial
          color={"#ffcc00"}
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>
    </mesh>
  );
}
