// src/components/HowItWorks.jsx
import { motion } from "framer-motion";
import { FaSearch, FaGlobeAmericas, FaFlask, FaRocket } from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { useState, useEffect } from "react";

export default function HowItWorks() {
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

  const steps = [
    {
      id: 1,
      icon: <FaSearch className="text-2xl sm:text-3xl" />,
      title: "Search & Explore",
      desc: "Browse thousands of exoplanets from NASA datasets with interactive 3D visualization.",
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-600 to-blue-600"
    },
    {
      id: 2,
      icon: <FaGlobeAmericas className="text-2xl sm:text-3xl" />,
      title: "Compare & Learn",
      desc: "See side-by-side comparisons between Earth and other planets to understand key differences.",
      color: "from-blue-500 to-cyan-500",
      gradient: "from-blue-600 to-cyan-500"
    },
    {
      id: 3,
      icon: <FaFlask className="text-2xl sm:text-3xl" />,
      title: "Simulate Survival",
      desc: "Test habitability with survival simulations considering gravity, atmosphere, and radiation.",
      color: "from-green-500 to-emerald-500",
      gradient: "from-cyan-500 to-green-500"
    },
    {
      id: 4,
      icon: <FaRocket className="text-2xl sm:text-3xl" />,
      title: "Contribute & Discover",
      desc: "Join citizen science, track missions, and make new discoveries with AstroHub.",
      color: "from-pink-500 to-purple-500",
      gradient: "from-green-500 to-purple-600"
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
      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-12 md:mb-16 text-center"
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 
            bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 
            text-transparent bg-clip-text drop-shadow-2xl"
          >
            How It Works
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 backdrop-blur-sm bg-black/40 rounded-2xl py-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            AstroHub makes space exploration simple. Just follow these steps and start your journey
            beyond the stars.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Vertical glowing line - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-500 shadow-[0_0_25px_rgba(168,85,247,0.6)] transform -translate-x-1/2" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className={`relative mb-16 flex flex-col md:flex-row items-center ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Spacer for desktop alignment */}
              <div className="w-full md:w-1/2 hidden md:block" />

              {/* Step Circle */}
              <div className="relative flex-shrink-0 z-10">
                <div
                  className={`relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r ${step.color} shadow-lg shadow-purple-500/50 group hover:scale-110 transition-transform duration-300`}
                >
                  <span className="absolute w-24 h-24 rounded-full bg-purple-500/20 blur-2xl animate-ping" />
                  <span className="absolute text-white text-lg sm:text-xl font-bold">
                    {step.id}
                  </span>
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white mt-12 text-xs font-medium">
                    Step {step.id}
                  </div>
                </div>
              </div>

              {/* Card */}
              <div className="w-full md:w-1/2 px-0 md:px-6 mt-6 md:mt-0">
                <motion.div
                  whileHover={{ 
                    scale: 1.03, 
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  className="relative group cursor-pointer"
                >
                  {/* Card background with gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`} />
                  
                  <div className="relative bg-white/5 backdrop-blur-xl border border-purple-500/20 
                    group-hover:border-purple-500/50 rounded-3xl p-6 md:p-8
                    shadow-[0_0_15px_rgba(128,0,255,0.1)] 
                    group-hover:shadow-[0_0_30px_rgba(128,0,255,0.3)] 
                    transition-all duration-500 overflow-hidden">
                    
                    {/* Animated highlight on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-r ${step.color} bg-opacity-20 transform group-hover:scale-110 transition-transform duration-300`}>
                        {step.icon}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                      {step.desc}
                    </p>
                    
                    {/* CTA Arrow - appears on hover */}
                    <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-4 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}