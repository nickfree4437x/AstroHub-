import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function Planet({ size, distance, speed, textureUrl, onClick }) {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  useFrame(({ clock }) => {
    if (ref.current) {
      const angle = clock.getElapsedTime() * speed;
      ref.current.position.x = distance * Math.cos(angle);
      ref.current.position.z = distance * Math.sin(angle);
      ref.current.rotation.y += 0.01; // Self-rotation
    }
  });

  return (
    <mesh ref={ref} onClick={onClick}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
