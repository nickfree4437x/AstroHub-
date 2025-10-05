import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";

export default function Moon({ moon, planetDistance }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x =
        planetDistance + moon.distance * Math.cos(clock.getElapsedTime() * moon.speed);
      ref.current.position.z =
        moon.distance * Math.sin(clock.getElapsedTime() * moon.speed);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[moon.size, 16, 16]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}
