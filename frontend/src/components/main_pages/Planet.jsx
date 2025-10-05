// src/components/Planet.jsx
import { useRef, useState, useEffect } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Stars } from "@react-three/drei";

export default function Planet(props) {
  const planetRef = useRef();
  const cloudsRef = useRef();
  const { size } = useThree();
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for responsive adjustments
  useEffect(() => {
    setIsMobile(size.width < 768);
  }, [size]);

  // Load Textures
  const [colorMap, bumpMap, specMap, cloudsMap, nightMap] = useLoader(
    THREE.TextureLoader,
    [
      "/textures/earth_daymap.jpg", // Base color
      "/textures/earth_bump.jpg", // Bump/relief
      "/textures/earth_specular.jpg", // Specular for oceans
      "/textures/earth_clouds.png", // Clouds
      "/textures/earth_nightlights.jpg", // Night city lights
    ]
  );

  // Improve texture filtering
  [colorMap, bumpMap, specMap, cloudsMap, nightMap].forEach((texture) => {
    texture.anisotropy = 16;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });

  // Rotate planet + clouds
  useFrame(() => {
    const rotationSpeed = isMobile ? 0.0005 : 0.0008;
    const cloudSpeed = isMobile ? 0.0007 : 0.001;

    planetRef.current.rotation.y += rotationSpeed;
    cloudsRef.current.rotation.y += cloudSpeed;
  });

  return (
    <>
      {/* Stars behind planet */}
      <Stars
        radius={120}
        depth={60}
        count={6000}
        factor={4}
        saturation={0}
        fade
        speed={0.2}
      />

      <group {...props}>
        {/* Planet Core */}
        <mesh ref={planetRef} rotation={[0.1, 0, 0]}>
          <sphereGeometry args={[2.5, 128, 128]} />
          <meshPhongMaterial
            map={colorMap}
            bumpMap={bumpMap}
            bumpScale={isMobile ? 0.03 : 0.05}
            specularMap={specMap}
            specular={new THREE.Color("grey")}
            shininess={15}
            emissiveMap={nightMap}
            emissive={new THREE.Color(0x222222)}
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Clouds Layer */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[2.53, 128, 128]} />
          <meshPhongMaterial
            map={cloudsMap}
            transparent
            opacity={isMobile ? 0.25 : 0.35}
            depthWrite={false}
            shininess={10}
          />
        </mesh>
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={0xffffff} />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color={0xffffff} />

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
        maxDistance={12}
        minDistance={3.5}
        autoRotate={false}
      />
    </>
  );
}
