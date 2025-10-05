// src/components/atmosphere/Atmosphere3D.jsx
import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";

// Planet textures
const PLANET_TEXTURES = {
  Mercury: "/textures/2k_mercury.jpg",
  Venus: "/textures/2k_venus.jpg",
  Earth: "/textures/2k_earth.jpg",
  Mars: "/textures/2k_mars.jpg",
  Jupiter: "/textures/2k_jupiter.jpg",
  Saturn: "/textures/2k_saturn.jpg",
  Uranus: "/textures/2k_uranus.jpg",
  Neptune: "/textures/2k_neptune.jpg",
};

// Atmospheric layer colors
const LAYER_COLORS = {
  Troposphere: "#4ADE80",
  Stratosphere: "#60A5FA",
  Mesosphere: "#F59E0B",
  Thermosphere: "#EF4444",
  Exosphere: "#8B5CF6",
  Ionosphere: "#06B6D4",
};

function LayerShell({ 
  radius = 1, 
  color = "#3B82F6", 
  opacity = 0.08, 
  speed = 0.01
}) {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state, dt) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed * dt;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 128, 128]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function PlanetCore({ radius = 1, texture, planetName }) {
  const meshRef = useRef();
  
  useFrame((state, dt) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.1 * dt;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 128, 128]} />
      <meshStandardMaterial 
        map={texture} 
        metalness={0.2} 
        roughness={0.7}
      />
    </mesh>
  );
}

function AtmosphericGlow({ radius = 1.2 }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshBasicMaterial
        color="#3B82F6"
        transparent
        opacity={0.03}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Scene({ layers = [], planetName = "Earth" }) {
  const baseRadius = 1.0;
  const textureUrl = PLANET_TEXTURES[planetName] || PLANET_TEXTURES["Earth"];
  const texture = useLoader(TextureLoader, textureUrl);
  
  const starsRef = useRef();

  useFrame((state, dt) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.01 * dt;
    }
  });

  const shells = useMemo(() => {
    if (!layers || !layers.length) {
      return [
        { 
          r: baseRadius + 0.1, 
          color: "#60A5FA", 
          opacity: 0.15, 
          speed: 0.015
        }
      ];
    }
    
    return layers.map((layer, idx) => {
      const thickness = layer.thicknessKm || 50;
      const normalizedThickness = Math.min(thickness / 200, 0.3);
      const r = baseRadius + 0.05 + idx * 0.08 + normalizedThickness;
      
      const color = LAYER_COLORS[layer.name] || 
                   ["#60A5FA", "#34D399", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"][idx % 6];
      
      const opacity = Math.min(0.08 + (idx * 0.03), 0.25);
      const speed = 0.01 + idx * 0.008;
      
      return { 
        r, 
        color, 
        opacity, 
        speed
      };
    });
  }, [layers]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#3B82F6" />
      <pointLight position={[0, 0, 8]} intensity={0.5} color="#ffffff" />

      {/* Stars Background */}
      <Stars 
        ref={starsRef}
        radius={100} 
        depth={50} 
        count={2000} 
        factor={4} 
        fade 
        speed={0.5}
      />

      {/* Sparkles for space effect */}
      <Sparkles
        count={100}
        scale={[20, 20, 20]}
        size={1}
        speed={0.1}
        color="#ffffff"
        opacity={0.3}
      />

      {/* Planet Core */}
      <PlanetCore 
        radius={baseRadius} 
        texture={texture} 
        planetName={planetName} 
      />

      {/* Atmospheric Glow */}
      <AtmosphericGlow radius={baseRadius + 0.15} />

      {/* Atmosphere Layers */}
      {shells.map((shell, i) => (
        <LayerShell
          key={`${planetName}-layer-${i}`}
          radius={shell.r}
          color={shell.color}
          opacity={shell.opacity}
          speed={shell.speed}
        />
      ))}
    </>
  );
}

export default function Atmosphere3D({ 
  layers = [], 
  planetName = "Earth",
  interactive = true 
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading 3D Visualization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ 
          position: [0, 1.8, 3.5], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true 
        }}
        className="rounded-xl"
      >
        <color attach="background" args={['#030014']} />
        
        <OrbitControls 
          enablePan={interactive}
          enableZoom={interactive}
          enableRotate={interactive}
          minDistance={2}
          maxDistance={8}
          autoRotate={!interactive}
          autoRotateSpeed={0.5}
        />
        
        <Scene 
          layers={layers} 
          planetName={planetName}
        />
      </Canvas>

      {/* Controls Guide */}
      {interactive && (
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs p-2 rounded-lg border border-white/20">
          🖱️ Drag to rotate • Scroll to zoom
        </div>
      )}
    </div>
  );
}