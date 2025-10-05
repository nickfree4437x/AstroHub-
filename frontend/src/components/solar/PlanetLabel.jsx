import { Html } from "@react-three/drei";

export default function PlanetLabel({ position, name }) {
  return (
    <Html position={position} center>
      <div className="text-white text-xs font-bold bg-black bg-opacity-50 px-1 rounded">
        {name}
      </div>
    </Html>
  );
}
