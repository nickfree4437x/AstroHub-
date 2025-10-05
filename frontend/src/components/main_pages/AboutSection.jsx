// src/components/AboutSection.jsx
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";

// SVG Icons to replace emojis
const ProblemIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const SolutionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const UniqueIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ExploreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const cards = [
  {
    id: "problem",
    title: "The Problem",
    desc: "Exoplanet's data is vast but difficult for students & general people to understand in an engaging way.",
    target: "#problem-section",
    gradient: "from-purple-600 to-blue-600",
    icon: <ProblemIcon />
  },
  {
    id: "solution",
    title: "Our Solution",
    desc: "AstroHub transforms raw NASA and space agency data into an immersive, AI-driven exploration experience.",
    target: "#solution-section",
    gradient: "from-blue-600 to-cyan-500",
    icon: <SolutionIcon />
  },
  {
    id: "unique",
    title: "Why Unique?",
    desc: "Planet Data Explorer, habitability scoring, AI reasearch assistant  & survival simulations—all in one platform.",
    target: "#unique-section",
    gradient: "from-cyan-500 to-green-500",
    icon: <UniqueIcon />
  },
  {
  id: "explore",
  title: "Start Exploring",
  desc: "Embark on a cosmic journey through real NASA data — explore planets, missions, and stars in an interactive, AI-powered universe.",
  target: "#features-section",
  gradient: "from-green-500 to-purple-600",
  icon: <ExploreIcon />
}
];

export default function AboutSection() {
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

  const handleScroll = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Same 3D Background as HeroSection - covers entire component */}
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

          {/* Stars only - no planet */}
          <Stars radius={120} depth={50} count={isMobile ? 3000 : 5000} factor={4} fade speed={1} />

          <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Same Gradient Overlays as HeroSection with parallax effect */}
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

      {/* Content with higher z-index to appear above background */}
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-12 md:mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 
            bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 
            text-transparent bg-clip-text drop-shadow-2xl"
          >
            About AstroHub
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 backdrop-blur-sm bg-black/20 rounded-2xl py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Connecting humanity with the cosmos through{" "}
            <span className="text-purple-400 font-medium">AI</span>,{" "}
            <span className="text-blue-400 font-medium">immersive 3D maps</span>, and{" "}
            <span className="text-cyan-400 font-medium">interactive simulations</span>.
          </motion.p>
        </motion.div>
      </div>

      {/* Cards */}
      <motion.div 
        className="max-w-7xl mx-auto relative z-10 mt-12 md:mt-16 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
              className="relative group cursor-pointer"
              onClick={() => handleScroll(card.target)}
            >
              {/* Card background with gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`} />
              
              <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-purple-500/30 
                group-hover:border-purple-500/70 rounded-3xl p-6 md:p-8 h-full flex flex-col
                shadow-[0_0_25px_rgba(128,0,255,0.15)] 
                group-hover:shadow-[0_0_40px_rgba(128,0,255,0.4)] 
                transition-all duration-500 overflow-hidden">
                
                {/* Animated highlight on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Icon Container */}
                <div className="flex justify-center mb-5">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm border border-white/10">
                    <div className="text-cyan-400 transform group-hover:scale-110 transition-transform duration-300">
                      {card.icon}
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent text-center">
                  {card.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-200 text-base leading-relaxed text-center mb-5 flex-grow">
                  {card.desc}
                </p>
                
                {/* CTA Button - appears on hover */}
                <div className="flex justify-center mt-auto">
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center text-cyan-400 font-medium">
                    <span className="mr-2 text-sm">Explore</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}