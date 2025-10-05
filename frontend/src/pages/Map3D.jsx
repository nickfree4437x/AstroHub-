import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Sky, Sparkles, Cloud, useTexture, Line, Text } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Vector3 } from "three";

// Local textures paths (public/textures folder)
const textures = {
  sun: "/textures/2k_sun.jpg",
  mercury: "/textures/2k_mercury.jpg",
  venus: "/textures/2k_venus.jpg",
  earth: "/textures/2k_earth.jpg",
  earthClouds: "/textures/2k_earth_clouds.jpg",
  moon: "/textures/2k_moon.jpg",
  mars: "/textures/2k_mars.jpg",
  jupiter: "/textures/2k_jupiter.jpg",
  saturn: "/textures/2k_saturn.jpg",
  saturnRing: "/textures/saturn_ring.png",
  uranus: "/textures/2k_uranus.jpg",
  neptune: "/textures/2k_neptune.jpg",
  stars: "/textures/galaxy_starfield.jpg",
  nebula: "/textures/nebula_2.jpg",
};

// Planets data - expanded with more details and proper spacing
const planetsData = [
  { name: "Mercury", size: 0.4, distance: 7, texture: textures.mercury, speed: 0.05, fact: "Mercury is the smallest planet.", color: "#A9A9A9", mass: 0.055, density: 5.4, dayLength: "58.6 Earth days", orbitColor: "#FF6B00" },
  { name: "Venus", size: 0.9, distance: 10, texture: textures.venus, speed: 0.035, fact: "Venus is the hottest planet with a runaway greenhouse effect.", color: "#E6E6FA", hasAtmosphere: true, mass: 0.815, density: 5.2, dayLength: "243 Earth days", orbitColor: "#FFA500" },
  { name: "Earth", size: 1, distance: 13, texture: textures.earth, speed: 0.025, fact: "Earth is the only planet known to support life.", color: "#6B93D6", hasMoon: true, hasClouds: true, hasAtmosphere: true, mass: 1, density: 5.5, dayLength: "24 hours", orbitColor: "#1E90FF" },
  { name: "Mars", size: 0.6, distance: 16, texture: textures.mars, speed: 0.02, fact: "Mars is called the Red Planet due to iron oxide on its surface.", color: "#FF6B6B", mass: 0.107, density: 3.9, dayLength: "24.6 hours", orbitColor: "#FF4500" },
  { name: "Jupiter", size: 2.2, distance: 22, texture: textures.jupiter, speed: 0.01, fact: "Jupiter is the largest planet in our solar system.", color: "#FFD700", hasRings: false, isGasGiant: true, mass: 317.8, density: 1.3, dayLength: "9.9 hours", orbitColor: "#FFD700" },
  { name: "Saturn", size: 1.8, distance: 28, texture: textures.saturn, speed: 0.008, fact: "Saturn has the most extensive ring system of any planet.", color: "#F4A460", hasRings: true, isGasGiant: true, mass: 95.2, density: 0.7, dayLength: "10.7 hours", orbitColor: "#FFA500" },
  { name: "Uranus", size: 1.5, distance: 34, texture: textures.uranus, speed: 0.006, fact: "Uranus is tilted on its side, rotating at nearly a 90-degree angle.", color: "#87CEEB", isGasGiant: true, mass: 14.5, density: 1.3, dayLength: "17.2 hours", orbitColor: "#00BFFF" },
  { name: "Neptune", size: 1.5, distance: 40, texture: textures.neptune, speed: 0.005, fact: "Neptune has the strongest winds in the solar system.", color: "#1E90FF", isGasGiant: true, mass: 17.1, density: 1.6, dayLength: "16.1 hours", orbitColor: "#0000FF" },
];

// Custom shader for Sun's corona effect
const SunCoronaShader = {
  uniforms: {
    time: { value: 0 },
    intensity: { value: 1.5 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform float intensity;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      float distance = length(vPosition);
      float pulse = sin(time * 2.0) * 0.5 + 0.5;
      float corona = (1.0 - distance) * intensity * (1.0 + pulse * 0.3);
      
      vec3 color = mix(vec3(1.0, 0.7, 0.2), vec3(1.0, 0.4, 0.1), distance);
      gl_FragColor = vec4(color * corona, corona * 0.7);
    }
  `
};

// Custom shader for planetary atmospheres
const AtmosphereShader = {
  uniforms: {
    color: { value: new THREE.Color(0.2, 0.5, 1.0) },
    intensity: { value: 1.0 }
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float intensity;
    varying vec3 vNormal;
    
    void main() {
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      gl_FragColor = vec4(color, fresnel * intensity);
    }
  `
};

// Custom shader for selection glow
const SelectionGlowShader = {
  uniforms: {
    color: { value: new THREE.Color(1.0, 1.0, 1.0) },
    intensity: { value: 1.0 },
    time: { value: 0 }
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float intensity;
    uniform float time;
    varying vec3 vNormal;
    
    void main() {
      float pulse = (sin(time * 5.0) + 1.0) * 0.5;
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      gl_FragColor = vec4(color, fresnel * intensity * (0.7 + pulse * 0.3));
    }
  `
};

// Orbit ring component with improved visibility
function OrbitRing({ distance, color = "white" }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[distance - 0.05, distance + 0.05, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Camera controller for smooth zoom with improved positioning
function CameraZoom({ targetPlanet }) {
  const { camera } = useThree();
  const targetRef = useRef(new Vector3());
  const lookAtRef = useRef(new Vector3());

  useFrame(() => {
    if (targetPlanet) {
      const { x, y, z } = targetPlanet.position;
      // Calculate a better camera position based on planet size
      const zoomDistance = targetPlanet.size * 4 + 3;
      targetRef.current.set(x, y + zoomDistance * 0.5, z + zoomDistance);
      lookAtRef.current.set(x, y, z);
      
      camera.position.lerp(targetRef.current, 0.05);
      camera.lookAt(lookAtRef.current);
    }
  });

  return null;
}

// Asteroid Belt component
function AsteroidBelt({ innerRadius = 17, outerRadius = 19, count = 2000 }) {
  const particlesRef = useRef();
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 0.5;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, [count, innerRadius, outerRadius]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#888888" transparent opacity={0.7} />
    </points>
  );
}

// Selection glow component for planets
function SelectionGlow({ planet, selected }) {
  const materialRef = useRef();
  
  useFrame(({ clock }) => {
    if (materialRef.current && selected) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  if (!selected) return null;

  return (
    <mesh scale={[1.15, 1.15, 1.15]}>
      <sphereGeometry args={[planet.size, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        args={[SelectionGlowShader]}
        uniforms-color-value={new THREE.Color("#ffffff")}
        uniforms-intensity-value={0.8}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// Connection line between compared planets
function ComparisonLine({ planet1, planet2, visible }) {
  if (!visible || !planet1 || !planet2) return null;
  
  const points = [
    new Vector3(planet1.position.x, planet1.position.y, planet1.position.z),
    new Vector3(planet2.position.x, planet2.position.y, planet2.position.z)
  ];
  
  return (
    <Line
      points={points}
      color="#00ff00"
      lineWidth={2}
      dashed={true}
      dashSize={0.5}
      gapSize={0.2}
    />
  );
}

// Distance measurement component
function DistanceIndicator({ planet1, planet2, visible }) {
  if (!visible || !planet1 || !planet2) return null;
  
  const pos1 = new Vector3(planet1.position.x, planet1.position.y, planet1.position.z);
  const pos2 = new Vector3(planet2.position.x, planet2.position.y, planet2.position.z);
  const distance = pos1.distanceTo(pos2);
  const midPoint = new Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);
  
  return (
    <Text
      position={[midPoint.x, midPoint.y + 2, midPoint.z]}
      color="white"
      fontSize={0.8}
      anchorX="center"
      anchorY="middle"
    >
      {`Distance: ${distance.toFixed(1)} AU`}
    </Text>
  );
}

// Information panel for compared planets
function ComparisonPanel({ planet1, planet2, onClose }) {
  if (!planet1 || !planet2) return null;
  
  const comparisonData = [
    { label: "Size", value1: `${planet1.size}x Earth`, value2: `${planet2.size}x Earth` },
    { label: "Distance", value1: `${planet1.distance} AU`, value2: `${planet2.distance} AU` },
    { label: "Orbit Speed", value1: planet1.speed, value2: planet2.speed },
    { label: "Mass", value1: `${planet1.mass}x Earth`, value2: `${planet2.mass}x Earth` },
    { label: "Density", value1: `${planet1.density} g/cm³`, value2: `${planet2.density} g/cm³` },
    { label: "Day Length", value1: planet1.dayLength, value2: planet2.dayLength },
  ];
  
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 w-4/5 max-w-4xl bg-gray-900 bg-opacity-90 text-white p-4 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Planet Comparison</h2>
        <button onClick={onClose} className="bg-red-600 hover:bg-red-700 py-1 px-3 rounded">
          Close
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <h3 className="font-semibold text-lg" style={{color: planet1.color}}>{planet1.name}</h3>
          <div className="w-16 h-16 rounded-full mx-auto mt-2 mb-4" style={{backgroundColor: planet1.color}}></div>
        </div>
        
        <div className="text-center">
          <h3 className="font-semibold text-lg text-gray-400">Property</h3>
        </div>
        
        <div className="text-center">
          <h3 className="font-semibold text-lg" style={{color: planet2.color}}>{planet2.name}</h3>
          <div className="w-16 h-16 rounded-full mx-auto mt-2 mb-4" style={{backgroundColor: planet2.color}}></div>
        </div>
      </div>
      
      {comparisonData.map((item, index) => (
        <div key={index} className="grid grid-cols-3 gap-4 py-2 border-b border-gray-700">
          <div className="text-right font-semibold" style={{color: planet1.color}}>
            {item.value1}
          </div>
          <div className="text-center text-gray-300">
            {item.label}
          </div>
          <div className="text-left font-semibold" style={{color: planet2.color}}>
            {item.value2}
          </div>
        </div>
      ))}
    </div>
  );
}

// Tour guide component with improved tour functionality
function TourGuide({ onTourStart }) {
  const tours = [
    { name: "Inner Planets", planets: ["Mercury", "Venus", "Earth", "Mars"] },
    { name: "Gas Giants", planets: ["Jupiter", "Saturn", "Uranus", "Neptune"] },
    { name: "Rocky Planets", planets: ["Mercury", "Venus", "Earth", "Mars"] },
    { name: "Complete Tour", planets: planetsData.map(p => p.name) }
  ];
  
  return (
    <div className="absolute top-5 right-5 bg-gray-900 bg-opacity-70 text-white p-4 rounded-xl shadow-lg w-64">
      <h2 className="text-xl font-bold mb-3">Guided Tours</h2>
      
      <div className="flex flex-col gap-2">
        {tours.map((tour, index) => (
          <button
            key={index}
            onClick={() => onTourStart(tour.planets)}
            className="bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-sm"
          >
            {tour.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// 🌙 Moon component (around Earth)
function Moon({ planetRef, size = 0.27, distance = 1.5, speed = 0.8 }) {
  const moonRef = useRef();
  const moonTexture = useLoader(THREE.TextureLoader, textures.moon);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (planetRef.current) {
      const orbitX = planetRef.current.position.x + distance * Math.sin(t * speed);
      const orbitZ = planetRef.current.position.z + distance * Math.cos(t * speed);
      moonRef.current.position.set(orbitX, 0, orbitZ);
      moonRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial map={moonTexture} />
    </mesh>
  );
}

// Atmospheric glow component
function AtmosphericGlow({ size, color = "#87CEEB", intensity = 0.5 }) {
  const materialRef = useRef();
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.intensity.value = intensity + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <mesh scale={[1.1, 1.1, 1.1]}>
      <sphereGeometry args={[size, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        args={[AtmosphereShader]}
        uniforms-color-value={new THREE.Color(color)}
        uniforms-intensity-value={intensity}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// Planet component with all enhancements
function PlanetComponent({ planet, onSelect, onCompare, selected, comparing }) {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, planet.texture);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const orbitX = planet.distance * Math.sin(t * planet.speed);
    const orbitZ = planet.distance * Math.cos(t * planet.speed);
    ref.current.position.set(orbitX, 0, orbitZ);
    ref.current.rotation.y += 0.01;
  });

  const handleClick = () => {
    if (comparing) {
      onCompare({ ...planet, position: ref.current.position.clone() });
    } else {
      onSelect({ ...planet, position: ref.current.position.clone() });
    }
  };

  return (
    <group ref={ref}>
      <SelectionGlow planet={planet} selected={selected} />
      
      <mesh onClick={handleClick}>
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Atmosphere for Venus and Earth */}
      {planet.hasAtmosphere && <AtmosphericGlow size={planet.size} color={planet.color} intensity={0.7} />}

      {/* Label */}
      <Html
        position={[0, planet.size + 0.7, 0]}
        style={{
          color: "white",
          fontSize: "14px",
          background: "rgba(0,0,0,0.5)",
          padding: "2px 6px",
          borderRadius: "6px",
          cursor: "pointer",
          pointerEvents: "none",
        }}
        center
        distanceFactor={10}
      >
        {planet.name}
      </Html>
    </group>
  );
}

// 🌍 Earth with Clouds
function EarthWithClouds({ planet, onSelect, onCompare, selected, comparing }) {
  const ref = useRef();
  const earthTexture = useLoader(THREE.TextureLoader, planet.texture);
  const cloudsTexture = useLoader(THREE.TextureLoader, textures.earthClouds);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const orbitX = planet.distance * Math.sin(t * planet.speed);
    const orbitZ = planet.distance * Math.cos(t * planet.speed);
    ref.current.position.set(orbitX, 0, orbitZ);
    ref.current.rotation.y += 0.01;
  });

  const handleClick = () => {
    if (comparing) {
      onCompare({ ...planet, position: ref.current.position.clone() });
    } else {
      onSelect({ ...planet, position: ref.current.position.clone() });
    }
  };

  return (
    <group ref={ref}>
      <SelectionGlow planet={planet} selected={selected} />
      
      {/* Earth */}
      <mesh onClick={handleClick}>
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshStandardMaterial map={earthTexture} />
      </mesh>

      {/* Atmosphere */}
      {planet.hasAtmosphere && <AtmosphericGlow size={planet.size} color={planet.color} />}

      {/* Clouds layer */}
      {planet.hasClouds && (
        <mesh>
          <sphereGeometry args={[planet.size * 1.01, 64, 64]} />
          <meshStandardMaterial
            map={cloudsTexture}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Label */}
      <Html
        position={[0, planet.size + 0.7, 0]}
        style={{
          color: "white",
          fontSize: "14px",
          background: "rgba(0,0,0,0.5)",
          padding: "2px 6px",
          borderRadius: "6px",
          cursor: "pointer",
          pointerEvents: "none",
        }}
        center
        distanceFactor={10}
      >
        {planet.name}
      </Html>

      {/* Moon */}
      {planet.hasMoon && <Moon planetRef={ref} />}
    </group>
  );
}

// 🪐 Saturn with Rings
function SaturnWithRings({ planet, onSelect, onCompare, selected, comparing }) {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, planet.texture);
  const ringTexture = useLoader(THREE.TextureLoader, textures.saturnRing);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const orbitX = planet.distance * Math.sin(t * planet.speed);
    const orbitZ = planet.distance * Math.cos(t * planet.speed);
    ref.current.position.set(orbitX, 0, orbitZ);
    ref.current.rotation.y += 0.01;
  });

  const handleClick = () => {
    if (comparing) {
      onCompare({ ...planet, position: ref.current.position.clone() });
    } else {
      onSelect({ ...planet, position: ref.current.position.clone() });
    }
  };

  return (
    <group ref={ref}>
      <SelectionGlow planet={planet} selected={selected} />
      
      {/* Saturn body */}
      <mesh onClick={handleClick}>
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Atmosphere */}
      {planet.hasAtmosphere && <AtmosphericGlow size={planet.size} color={planet.color} intensity={0.3} />}

      {/* Saturn rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.size * 1.3, planet.size * 2.5, 128]} />
        <meshBasicMaterial
          map={ringTexture}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Label */}
      <Html
        position={[0, planet.size + 1.2, 0]}
        style={{
          color: "white",
          fontSize: "14px",
          background: "rgba(0,0,0,0.5)",
          padding: "2px 6px",
          borderRadius: "6px",
          pointerEvents: "none",
        }}
        center
        distanceFactor={12}
      >
        {planet.name}
      </Html>
    </group>
  );
}

// Gas Giant with atmospheric effects
function GasGiant({ planet, onSelect, onCompare, selected, comparing }) {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, planet.texture);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const orbitX = planet.distance * Math.sin(t * planet.speed);
    const orbitZ = planet.distance * Math.cos(t * planet.speed);
    ref.current.position.set(orbitX, 0, orbitZ);
    ref.current.rotation.y += 0.01;
  });

  const handleClick = () => {
    if (comparing) {
      onCompare({ ...planet, position: ref.current.position.clone() });
    } else {
      onSelect({ ...planet, position: ref.current.position.clone() });
    }
  };

  return (
    <group ref={ref}>
      <SelectionGlow planet={planet} selected={selected} />
      
      <mesh onClick={handleClick}>
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Atmospheric effect for gas giants */}
      <AtmosphericGlow size={planet.size} color={planet.color} intensity={0.4} />

      {/* Label */}
      <Html
        position={[0, planet.size + 1.2, 0]}
        style={{
          color: "white",
          fontSize: "14px",
          background: "rgba(0,0,0,0.5)",
          padding: "2px 6px",
          borderRadius: "6px",
          cursor: "pointer",
          pointerEvents: "none",
        }}
        center
        distanceFactor={12}
      >
        {planet.name}
      </Html>
    </group>
  );
}

// 🌞 Sun component with enhanced effects
function Sun() {
  const sunRef = useRef();
  const sunTexture = useLoader(THREE.TextureLoader, textures.sun);
  const coronaMaterialRef = useRef();

  useFrame(({ clock }) => {
    sunRef.current.rotation.y += 0.002;
    if (coronaMaterialRef.current) {
      coronaMaterialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <group>
      {/* Sun core */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={sunTexture} emissive={"#FDB813"} emissiveIntensity={1.5} />
      </mesh>
      
      {/* Sun corona effect */}
      <mesh scale={[3, 3, 3]}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          ref={coronaMaterialRef}
          args={[SunCoronaShader]}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Sun glow particles */}
      <Sparkles
        count={100}
        scale={5}
        size={2}
        speed={0.4}
        color="#FDB813"
        opacity={0.6}
      />
    </group>
  );
}

// Background nebula and stars
function SpaceBackground() {
  const nebulaTexture = useLoader(THREE.TextureLoader, textures.nebula);
  
  return (
    <>
      <Stars 
        radius={300} 
        depth={60} 
        count={10000} 
        factor={7} 
        saturation={0.1} 
        fade 
        speed={0.2}
      />
      
      <mesh rotation={[0, 0, 0]} position={[0, 0, -100]}>
        <sphereGeometry args={[200, 32, 32]} />
        <meshBasicMaterial map={nebulaTexture} side={THREE.BackSide} transparent opacity={0.3} />
      </mesh>
    </>
  );
}

// Main Solar System Component
export default function SolarSystem3D() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [comparingPlanets, setComparingPlanets] = useState([]);
  const [timeScale, setTimeScale] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [cameraMode, setCameraMode] = useState("free");
  const [compareMode, setCompareMode] = useState(false);
  const [tourPlanets, setTourPlanets] = useState([]);
  const [tourIndex, setTourIndex] = useState(0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '1' && e.key <= '8') {
        const index = parseInt(e.key) - 1;
        if (index < planetsData.length) {
          const planet = planetsData[index];
          // Calculate planet position based on current time
          const t = performance.now() * 0.001 * planet.speed;
          const orbitX = planet.distance * Math.sin(t);
          const orbitZ = planet.distance * Math.cos(t);
          
          setSelectedPlanet({ 
            ...planet, 
            position: new Vector3(orbitX, 0, orbitZ)
          });
          setCameraMode("focused");
        }
      } else if (e.key === 'Escape' || e.key === '0') {
        setSelectedPlanet(null);
        setCameraMode("free");
        setComparingPlanets([]);
        setCompareMode(false);
      } else if (e.key === 'c' || e.key === 'C') {
        setCompareMode(!compareMode);
        setComparingPlanets([]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [compareMode]);

  // Handle tour progression
  useEffect(() => {
    if (tourPlanets.length > 0 && tourIndex < tourPlanets.length) {
      const planetName = tourPlanets[tourIndex];
      const planet = planetsData.find(p => p.name === planetName);
      
      if (planet) {
        // Calculate planet position based on current time
        const t = performance.now() * 0.001 * planet.speed;
        const orbitX = planet.distance * Math.sin(t);
        const orbitZ = planet.distance * Math.cos(t);
        
        setSelectedPlanet({ 
          ...planet, 
          position: new Vector3(orbitX, 0, orbitZ)
        });
        setCameraMode("focused");
        
        const timer = setTimeout(() => {
          if (tourIndex < tourPlanets.length - 1) {
            setTourIndex(tourIndex + 1);
          } else {
            // End of tour
            setTourPlanets([]);
            setTourIndex(0);
            setSelectedPlanet(null);
            setCameraMode("free");
          }
        }, 3000); // 3 seconds per planet
      
        return () => clearTimeout(timer);
      }
    }
  }, [tourPlanets, tourIndex]);

  const handlePlanetSelect = (planet) => {
    if (compareMode) {
      if (comparingPlanets.length < 2) {
        setComparingPlanets([...comparingPlanets, planet]);
      }
      
      if (comparingPlanets.length === 1) {
        // We have two planets to compare
        setCompareMode(false);
      }
    } else {
      setSelectedPlanet(planet);
      setCameraMode("focused");
    }
  };

  const handleTourStart = (planetNames) => {
    setTourPlanets(planetNames);
    setTourIndex(0);
  };

  const closeComparison = () => {
    setComparingPlanets([]);
  };

  return (
    <div className="relative w-full h-[1000px] md:h-[900px] lg:h-[1100px] bg-black rounded-xl shadow-lg overflow-hidden">
      <Canvas camera={{ position: [0, 20, 40], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={3} color="#FDB813" />
        
        {/* Enhanced space background */}
        <SpaceBackground />
        
        {/* Sun with enhanced effects */}
        <Sun />

        {/* Asteroid belt between Mars and Jupiter */}
        <AsteroidBelt />

        {/* Planets with orbit rings */}
        {planetsData.map((p) => (
          <group key={p.name}>
            {showOrbits && <OrbitRing distance={p.distance} color={p.orbitColor} />}
            
            {p.name === "Earth" ? (
              <EarthWithClouds 
                planet={p} 
                onSelect={handlePlanetSelect}
                onCompare={handlePlanetSelect}
                selected={selectedPlanet?.name === p.name}
                comparing={compareMode}
              />
            ) : p.hasRings ? (
              <SaturnWithRings 
                planet={p} 
                onSelect={handlePlanetSelect}
                onCompare={handlePlanetSelect}
                selected={selectedPlanet?.name === p.name}
                comparing={compareMode}
              />
            ) : p.isGasGiant ? (
              <GasGiant 
                planet={p} 
                onSelect={handlePlanetSelect}
                onCompare={handlePlanetSelect}
                selected={selectedPlanet?.name === p.name}
                comparing={compareMode}
              />
            ) : (
              <PlanetComponent 
                planet={p} 
                onSelect={handlePlanetSelect}
                onCompare={handlePlanetSelect}
                selected={selectedPlanet?.name === p.name}
                comparing={compareMode}
              />
            )}
          </group>
        ))}

        {/* Comparison visualization */}
        <ComparisonLine 
          planet1={comparingPlanets[0]} 
          planet2={comparingPlanets[1]} 
          visible={comparingPlanets.length === 2} 
        />
        
        <DistanceIndicator 
          planet1={comparingPlanets[0]} 
          planet2={comparingPlanets[1]} 
          visible={comparingPlanets.length === 2} 
        />

        {/* Camera Control */}
        <CameraZoom targetPlanet={selectedPlanet} />

        {/* Controls */}
        <OrbitControls 
          enabled={cameraMode === "free"}
          enableZoom={true} 
          enablePan={true} 
          target={[0, 0, 0]} 
          maxDistance={80} 
          minDistance={5} 
        />
      </Canvas>

      {/* Enhanced UI Controls */}
      <div className="absolute top-5 left-5 bg-gray-900 bg-opacity-70 text-white p-4 rounded-xl shadow-lg w-64">
        <h2 className="text-xl font-bold mb-3">Solar System Controls</h2>
        
        <div className="mb-3">
          <label className="block mb-1">Time Scale: {timeScale}x</label>
          <input 
            type="range" 
            min="0.1" 
            max="10" 
            step="0.1"
            value={timeScale}
            onChange={(e) => setTimeScale(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-col gap-2 mb-3">
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={showOrbits}
              onChange={() => setShowOrbits(!showOrbits)}
            />
            Show Orbits
          </label>
          
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={showLabels}
              onChange={() => setShowLabels(!showLabels)}
            />
            Show Labels
          </label>
          
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={compareMode}
              onChange={() => {
                setCompareMode(!compareMode);
                setComparingPlanets([]);
              }}
            />
            Compare Mode
          </label>
        </div>
        
        <div className="mb-3">
          <h3 className="font-semibold mb-1">Quick Navigation:</h3>
          <div className="grid grid-cols-2 gap-2">
            {planetsData.slice(0, 4).map((planet, i) => (
              <button
                key={planet.name}
                onClick={() => {
                  // Calculate planet position based on current time
                  const t = performance.now() * 0.001 * planet.speed;
                  const orbitX = planet.distance * Math.sin(t);
                  const orbitZ = planet.distance * Math.cos(t);
                  
                  setSelectedPlanet({ 
                    ...planet, 
                    position: new Vector3(orbitX, 0, orbitZ)
                  });
                  setCameraMode("focused");
                }}
                className="bg-blue-600 hover:bg-blue-700 py-1 px-2 rounded text-sm"
              >
                {i + 1}. {planet.name}
              </button>
            ))}
            {planetsData.slice(4, 8).map((planet, i) => (
              <button
                key={planet.name}
                onClick={() => {
                  // Calculate planet position based on current time
                  const t = performance.now() * 0.001 * planet.speed;
                  const orbitX = planet.distance * Math.sin(t);
                  const orbitZ = planet.distance * Math.cos(t);
                  
                  setSelectedPlanet({ 
                    ...planet, 
                    position: new Vector3(orbitX, 0, orbitZ)
                  });
                  setCameraMode("focused");
                }}
                className="bg-purple-600 hover:bg-purple-700 py-1 px-2 rounded text-sm"
              >
                {i + 5}. {planet.name}
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => {
            setSelectedPlanet(null);
            setCameraMode("free");
            setComparingPlanets([]);
            setCompareMode(false);
          }}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold"
        >
          Reset View
        </button>
      </div>

      {/* Tour Guide */}
      <TourGuide onTourStart={handleTourStart} />

      {/* Enhanced Info Panel */}
      {selectedPlanet && comparingPlanets.length < 2 && (
        <div className="absolute top-5 right-5 w-72 bg-gray-900 bg-opacity-80 text-white p-4 rounded-xl shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{backgroundColor: selectedPlanet.color}}></div>
            {selectedPlanet.name}
          </h2>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-xs text-gray-400">Size</div>
              <div>{selectedPlanet.size} Earth units</div>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-xs text-gray-400">Distance</div>
              <div>{selectedPlanet.distance} AU</div>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-xs text-gray-400">Orbit Speed</div>
              <div>{selectedPlanet.speed}</div>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-xs text-gray-400">Type</div>
              <div>{selectedPlanet.isGasGiant ? 'Gas Giant' : 'Terrestrial'}</div>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-xs text-gray-400">Mass</div>
              <div>{selectedPlanet.mass}x Earth</div>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-xs text-gray-400">Density</div>
              <div>{selectedPlanet.density} g/cm³</div>
            </div>
          </div>
          
          <p className="mb-3 p-2 bg-gray-800 rounded italic">{selectedPlanet.fact}</p>
          
          <button
            onClick={() => {
              setSelectedPlanet(null);
              setCameraMode("free");
            }}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold"
          >
            Back to Overview
          </button>
        </div>
      )}

      {/* Comparison Panel */}
      {comparingPlanets.length === 2 && (
        <ComparisonPanel 
          planet1={comparingPlanets[0]} 
          planet2={comparingPlanets[1]} 
          onClose={closeComparison}
        />
      )}

      {/* Help Tooltip */}
      <div className="absolute bottom-5 left-5 bg-gray-900 bg-opacity-70 text-white p-3 rounded-xl text-sm">
        <div className="font-semibold mb-1">Keyboard Shortcuts:</div>
        <div>Press 1-8 to focus on planets</div>
        <div>Press 0 or Esc to reset view</div>
        <div>Press C to toggle compare mode</div>
      </div>

      {/* Mode Indicator */}
      {compareMode && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-4 py-2 rounded-lg">
          Compare Mode: Click two planets to compare
        </div>
      )}

      {/* Tour Progress Indicator */}
      {tourPlanets.length > 0 && (
        <div className="absolute bottom-5 right-5 bg-purple-700 text-white px-4 py-2 rounded-lg">
          Tour Progress: {tourIndex + 1} of {tourPlanets.length}
        </div>
      )}
    </div>
  );
}