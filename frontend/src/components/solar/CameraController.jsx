// src/components/solar/CameraController.jsx
import { useThree, useFrame } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";
import { useEffect } from "react";

export default function CameraController({ target }) {
  const { camera } = useThree();

  // Smooth transition with react-spring
  const { camPos } = useSpring({
    camPos: target
      ? [target.x + 5, target.y + 3, target.z + 5] // focus near planet
      : [0, 20, 40], // default solar view
    config: { mass: 1, tension: 170, friction: 26 },
  });

  // Keep camera looking at target or center
  useFrame(() => {
    if (target) {
      camera.lookAt(target.x, target.y, target.z);
    } else {
      camera.lookAt(0, 0, 0);
    }
  });

  return <a.perspectiveCamera position={camPos} />;
}
