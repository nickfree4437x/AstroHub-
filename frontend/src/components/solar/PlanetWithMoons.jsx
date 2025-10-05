// src/components/solar/PlanetWithMoons.jsx
import Planet from "./Planet";
import Moon from "./Moon";
import PlanetLabel from "./PlanetLabel";

export default function PlanetWithMoons({ planet }) {
  return (
    <group>
      <Planet size={planet.size} distance={planet.distance} speed={planet.speed} textureUrl={planet.texture} />
      <PlanetLabel position={[planet.distance, 0, 0]} name={planet.name} />

      {planet.moons?.map((moon) => (
        <Moon
          key={moon.name}
          size={moon.size}
          distance={moon.distance}
          speed={moon.speed}
          textureUrl={moon.texture}
        />
      ))}
    </group>
  );
}
