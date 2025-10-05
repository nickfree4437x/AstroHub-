import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserAstronaut, FaRocket } from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";

// Components
import AstronautDirectory from "../components/astronaut-explore/AstronautDirectory";
import AstronautProfile from "../components/astronaut-explore/AstronautProfile";
import AstronautStatsPanel from "../components/astronaut-explore/AstronautStatsPanel";
import RandomAstronautSpotlight from "../components/astronaut-explore/RandomAstronautSpotlight";

// API
import { fetchAstronauts } from "../lib/astronautApi";

export default function AstronautExplorer() {
  const [astronauts, setAstronauts] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedAstronaut, setSelectedAstronaut] = useState(null);
  const [comparisonList, setComparisonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Safe data access functions
  const getAstronautCount = () => {
    if (!Array.isArray(astronauts)) return 0;
    return astronauts.length;
  };

  // Load astronauts when filters change
  useEffect(() => {
    const loadAstronauts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAstronauts(filters);
        // Ensure data is always an array
        setAstronauts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading astronauts:", error);
        setError("Failed to load astronaut data. Please try again later.");
        setAstronauts([]);
      } finally {
        setLoading(false);
      }
    };
    loadAstronauts();
  }, [filters]);

  // Loading state
  if (loading) {
    return (
      <div className="relative min-h-screen text-white overflow-hidden">
        {/* 3D Background */}
        <div className="fixed inset-0 -z-30">
          <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} color="#0ea5e9" />
            <Stars radius={150} depth={60} count={4000} factor={4} fade speed={0.5} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.3} />
          </Canvas>
        </div>
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center backdrop-blur-sm bg-black/40 p-8 rounded-2xl border border-white/10">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <FaRocket className="animate-bounce" />
              Loading Astronaut Data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* 🌌 3D Space Background */}
      <div className="fixed inset-0 -z-30">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} color="#0ea5e9" />
          <Stars radius={150} depth={60} count={4000} factor={4} fade speed={0.5} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.3} />
        </Canvas>
      </div>

      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-900/40 via-purple-900/20 to-black -z-20" />
      <div className="fixed inset-0 bg-gradient-to-t from-black via-blue-900/10 to-black -z-20" />
      <div className="fixed inset-0 bg-radial-gradient(from-circle at center, transparent 0%, black 90%) -z-20" />
      
      {/* Animated particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 5}s infinite ease-in-out ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 backdrop-blur-sm bg-red-500/20 border border-red-500/30 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <FaUserAstronaut className="text-red-400 text-xl" />
              <div>
                <h3 className="text-red-300 font-semibold">Error Loading Data</h3>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Astronaut Explorer
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto backdrop-blur-sm bg-black/30 px-6 py-3 rounded-2xl border border-white/10">
            Discover the pioneers of space exploration and their incredible journeys beyond Earth
          </p>
          
          {/* Results Count */}
          <motion.div 
            className="mt-6 backdrop-blur-sm bg-black/40 p-4 rounded-2xl border border-white/10 inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8 max-w-7xl mx-auto"
        >
          {/* 1️⃣ Random Spotlight */}
          <RandomAstronautSpotlight 
            onSelect={setSelectedAstronaut}
            astronauts={astronauts}
          />

          {/* 2️⃣ Directory / Cards */}
          <AstronautDirectory
            astronauts={astronauts}
            onSelect={setSelectedAstronaut}
            comparisonList={comparisonList}
            setComparisonList={setComparisonList}
          />

          {/* 3️⃣ Selected Astronaut Profile Modal */}
          {selectedAstronaut && (
            <AstronautProfile
              astronaut={selectedAstronaut}
              onClose={() => setSelectedAstronaut(null)}
            />
          )}

          {/* 4️⃣ Stats Summary Panel */}
          {getAstronautCount() > 0 && (
            <AstronautStatsPanel astronauts={astronauts} />
          )}

          {/* Empty State */}
          {/* {getAstronautCount() === 0 && !error && !loading && (
            <motion.div 
              className="text-center py-16 backdrop-blur-sm bg-black/40 rounded-3xl border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-6xl mb-4">👨‍🚀</div>
              <h3 className="text-2xl text-gray-300 mb-2">No astronauts found</h3>
              <p className="text-gray-400">Try adjusting your filters to discover more space explorers</p>
            </motion.div>
          )} */}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-15px) rotate(5deg); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}