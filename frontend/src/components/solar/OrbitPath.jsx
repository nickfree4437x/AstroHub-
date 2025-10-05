import { useMemo } from "react";
import { Line } from "@react-three/drei";

export default function OrbitPath({ radius }) {
  const points = useMemo(() => {
    const pts = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * 2 * Math.PI;
      pts.push([radius * Math.cos(theta), 0, radius * Math.sin(theta)]);
    }
    return pts;
  }, [radius]);

  return <Line points={points} color="#888" lineWidth={0.5} />;
}
