// src/components/DataInsights.jsx
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { FaGlobe, FaStar, FaSatellite, FaRocket } from "react-icons/fa";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";

function ParallaxStars() {
  const groupRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += (mousePosition.y * 0.1 - groupRef.current.rotation.x) * 0.02;
      groupRef.current.rotation.y += (mousePosition.x * 0.1 - groupRef.current.rotation.y) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={150} depth={60} count={5000} factor={4} fade speed={1} />
    </group>
  );
}

export default function DataInsights() {
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

  const stats = [
    { 
      id: 1, 
      icon: <FaGlobe className="text-4xl md:text-5xl" />, 
      label: "Exoplanets Analyzed", 
      value: 500,
      description: "From gas giants to Earth-like worlds, each with detailed atmospheric and orbital data",
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      id: 2, 
      icon: <FaStar className="text-4xl md:text-5xl" />, 
      label: "Stars Surveyed", 
      value: 1200,
      description: "Multiple star types including G, K, M classes with complete spectral analysis",
      gradient: "from-yellow-400 to-orange-500"
    },
    { 
      id: 3, 
      icon: <FaSatellite className="text-4xl md:text-5xl" />, 
      label: "NASA Missions Used", 
      value: 2,
      description: "Kepler & TESS mission data combined for comprehensive planetary discovery",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      id: 4, 
      icon: <FaRocket className="text-4xl md:text-5xl" />, 
      label: "Simulations Run", 
      value: 300,
      description: "Advanced climate, orbital, and habitability simulations for each exoplanet",
      gradient: "from-green-500 to-teal-500"
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen py-16 md:py-24 px-4 sm:px-6 overflow-hidden flex items-center">
      {/* Same 3D Background as other sections */}
      <div className="absolute inset-0 -z-30">
        <Canvas>
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

          {/* Stars only */}
          <Stars radius={120} depth={50} count={isMobile ? 3000 : 5000} factor={4} fade speed={1} />

          <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Same Gradient Overlays with parallax effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-black -z-20"
        style={{
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`
        }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black -z-20"
        style={{
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
        }}
      />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/70 to-black -z-20" />
      
      {/* Animated particles for cosmic effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(isMobile ? 15 : 30)].map((_, i) => (
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

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-12 md:mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 
            bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 
            text-transparent bg-clip-text drop-shadow-2xl"
          >
            Data & Insights
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 backdrop-blur-sm bg-black/20 rounded-2xl py-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Explore the depth of NASA's discoveries with real-time data, habitability scores, and mission
            insights that power <span className="text-purple-400 font-medium">AstroHub</span>.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
              className="relative group cursor-pointer"
            >
              {/* Card background with gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`} />
              
              <div className="relative bg-white/5 backdrop-blur-xl border border-purple-500/20 
                group-hover:border-purple-500/50 rounded-3xl p-6 h-full flex flex-col
                shadow-[0_0_15px_rgba(128,0,255,0.1)] 
                group-hover:shadow-[0_0_30px_rgba(128,0,255,0.3)] 
                transition-all duration-500 overflow-hidden">
                
                {/* Animated highlight on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Icon */}
                <div className="mb-5 flex justify-center">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} bg-opacity-20 transform group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                </div>

                {/* Counter */}
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <CountUp 
                    end={stat.value} 
                    duration={3} 
                    separator="," 
                    className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
                  />
                  {stat.id !== 3 && "+"}
                </h3>
                
                {/* Label */}
                <p className="text-gray-200 text-sm md:text-base font-medium mb-3">
                  {stat.label}
                </p>
                
                {/* Description - appears on hover */}
                <motion.div 
                  className="mt-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                >
                  <p className="text-gray-100 text-xs md:text-sm leading-relaxed">
                    {stats.description}
                  </p>
                </motion.div>
                
                {/* Decorative element */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 backdrop-blur-md bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-black rounded-3xl p-8 border border-white/10 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Real-time NASA Data Integration
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Our platform continuously syncs with NASA's Exoplanet Archive, ensuring you have access to the latest discoveries and updates from space missions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-cyan-400 font-bold text-lg">24/7</div>
              <div className="text-gray-300 text-sm">Data Updates</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-green-400 font-bold text-lg">100%</div>
              <div className="text-gray-300 text-sm">NASA Verified</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-purple-400 font-bold text-lg">Live</div>
              <div className="text-gray-300 text-sm">Mission Feeds</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}