// components/FeaturesSection.jsx
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import {
  Globe,
  BarChart,
  Cpu,
  Users,
  Gamepad2,
  Satellite,
  Rocket 
} from "lucide-react";

const features = [
  {
    id: "explorer",
    icon: <Globe size={40} />,
    title: "Planet Data Explorer",
    desc: "Search, filter & visualize thousands of exoplanets with real-time NASA datasets.",
    gradient: "from-purple-600 to-blue-600"
  },
  {
    id: "habitability",
    icon: <BarChart size={40} />,
    title: "Habitability Score",
    desc: "AI-powered habitability index (0–100) based on scientific parameters.",
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    id: "map",
    icon: <Cpu size={40} />,
    title: "3D Solar System",
    desc: "Zoom into star systems, view orbit simulations, and explore in 3D.",
    gradient: "from-cyan-500 to-green-500"
  },
  {
    id: "compare",
    icon: <Users size={40} />,
    title: "Earth vs Planet",
    desc: "Side-by-side comparisons of gravity, temperature, orbit, and atmosphere.",
    gradient: "from-green-500 to-yellow-500"
  },
  {
  id: "missions",
  icon: <Rocket size={40} />,
  title: "Space Missions Explorer",
  desc: "Discover and explore detailed insights about past, ongoing, and upcoming space missions from NASA and other agencies.",
  gradient: "from-blue-500 to-purple-500"
},
  {
    id: "missions",
    icon: <Satellite size={40} />,
    title: "Space Missions",
    desc: "Explore past, present, and upcoming missions from NASA, ESA, ISRO, and more — track humanity’s journey across the solar system.",
    gradient: "from-orange-500 to-purple-600"
  }
];

export default function FeaturesSection() {
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
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
    <section
      id="features-section"
      className="relative w-full min-h-screen py-16 md:py-24 px-4 sm:px-6 overflow-hidden"
    >
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
            Core Features
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 backdrop-blur-sm bg-black/20 rounded-2xl py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Explore the universe with <span className="text-purple-400 font-medium">AI-driven tools</span>, 
            <span className="text-blue-400 font-medium"> immersive maps</span>, and 
            <span className="text-cyan-400 font-medium"> interactive simulations</span>.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((f, idx) => (
            <motion.div
              key={f.id}
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
              <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`} />
              
              <div className="relative bg-white/5 backdrop-blur-xl border border-purple-500/20 
                group-hover:border-purple-500/50 rounded-3xl p-6 md:p-8 h-full
                shadow-[0_0_15px_rgba(128,0,255,0.1)] 
                group-hover:shadow-[0_0_30px_rgba(128,0,255,0.3)] 
                transition-all duration-500 overflow-hidden">
                
                {/* Animated highlight on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Icon with glow */}
                <div className="mb-5 relative flex justify-center">
                  <div className="absolute w-16 h-16 bg-purple-500/20 blur-2xl rounded-full"></div>
                  <div className="text-cyan-400 z-10 transform group-hover:scale-110 transition-transform duration-300">
                    {f.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent text-center">
                  {f.title}
                </h3>
                <p className="text-gray-200 text-sm md:text-base leading-relaxed text-center">
                  {f.desc}
                </p>
                
                {/* Learn more link - appears on hover */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 transition-all duration-300 flex justify-center">
                  <span className="text-cyan-400 text-sm font-medium flex items-center">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
