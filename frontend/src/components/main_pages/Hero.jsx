// src/components/HeroSection.jsx
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import Planet from "./Planet";

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    
    // Parallax effect based on mouse movement
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -(clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 3D Background - Earth remains exactly as before */}
      <Canvas className="absolute inset-0 w-full h-full">
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          color="#7e22ce"
        />
        <directionalLight
          position={[-10, -10, -5]}
          intensity={0.6}
          color="#3b82f6"
        />

        {/* Stars */}
        <Stars radius={120} depth={50} count={5000} factor={4} fade speed={1} />

        {/* Planet - Keeping the original Earth */}
        <Suspense fallback={null}>
          <Planet position={[0, 0, 0]} />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>

      {/* Enhanced Gradient Overlays with parallax effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-black z-0"
        style={{
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`
        }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black z-0"
        style={{
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
        }}
      />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/70 to-black z-0" />
      
      {/* Animated particles for cosmic effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(isMobile ? 20 : 40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Enhanced Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4 sm:px-6 overflow-x-hidden">
        <motion.div
          className="relative mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold 
            bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 
            bg-clip-text text-transparent drop-shadow-2xl px-2 
            max-w-5xl mx-auto tracking-tight"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            AstroHub
          </motion.h1>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-xl rounded-full -z-10"></div>
          <motion.span 
            className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 font-medium text-gray-300 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-2xl border border-purple-500/20"
          >
            Your Portal to the Cosmos
          </motion.span>
        </motion.div>

        <motion.p
          className="mt-8 text-base sm:text-lg md:text-xl text-gray-300 
          max-w-2xl mx-auto leading-relaxed font-light px-4
          backdrop-blur-md bg-black/40 rounded-3xl py-5 border border-white/10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: 'easeOut' }}
        >
          Dive into interstellar missions, explore distant worlds, simulate
          deep-space survival, and experience the universe like never before.
        </motion.p>

        {/* Enhanced CTA Buttons */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row gap-5 sm:gap-6 
          justify-center w-full max-w-md sm:max-w-lg px-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
        >
          <Link
            to="/explore"
            className="relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 
            to-purple-700 rounded-2xl 
            text-lg font-semibold shadow-2xl
            shadow-purple-500/30 transition-all transform hover:scale-105 
            flex items-center justify-center gap-3 group overflow-hidden
            border border-purple-500/30 hover:border-purple-500/60"
          >
            <span className="relative z-10">Explore Planets</span>
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link
            to="/simulator"
            className="relative px-8 py-4 bg-transparent border-2 
            border-gray-500/60 hover:border-white/80
            rounded-2xl 
            text-lg font-semibold shadow-lg 
            shadow-gray-500/10 transition-all transform hover:scale-105 
            flex items-center justify-center gap-3 group overflow-hidden
            backdrop-blur-sm bg-white/5 hover:bg-white/10"
          >
            <span className="relative z-10">Try Simulator</span>
            <motion.span 
              className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>

        {/* Partners Section */}
        <motion.div
          className="mt-10 sm:mt-12 text-sm text-gray-400 
          px-4 max-w-2xl mx-auto flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
        >
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text font-medium mb-3">
            In collaboration with
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 backdrop-blur-sm bg-black/30 px-6 py-3 rounded-2xl border border-white/10">
            <span className="text-white font-medium">NASA</span>
            <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
            <span className="text-white font-medium">ESA</span>
            <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
            <span className="text-white font-medium">SpaceX</span>
            <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
            <span className="text-white font-medium">Global Research</span>
          </div>
        </motion.div>
        
        {/* Enhanced Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-8 h-12 rounded-full border-2 border-purple-500/40 flex justify-center p-1 backdrop-blur-sm bg-black/20"
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.2 }}
              className="w-1 h-3 bg-purple-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating elements for depth */}
      <div className="absolute top-1/4 left-10 opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border border-purple-400/30 rounded-full"
        />
      </div>
      <div className="absolute bottom-1/3 right-12 opacity-15">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border border-blue-400/30 rounded-full"
        />
      </div>
    </section>
  );
}