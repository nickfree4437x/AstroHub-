import { useState, useEffect } from "react";
import { fetchPlanets } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import {
  FaSearch,
  FaStar,
  FaRuler,
  FaGlobe,
  FaChartLine,
  FaHistory,
  FaInfoCircle
} from "react-icons/fa";

export default function HabitabilityHero({ onSearch, filters, setFilters }) {
  const [planetNames, setPlanetNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Load planet names once
  useEffect(() => {
    async function loadNames() {
      try {
        const data = await fetchPlanets({ limit: 500 });
        setPlanetNames(data.items);
      } catch (err) {
        console.error("Failed to load planet names:", err);
      }
    }
    loadNames();
  }, []);

  // Filter planet names as user types
  useEffect(() => {
    if (!searchTerm) return setFilteredNames([]);
    const f = planetNames
      .filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);
    setFilteredNames(f);
  }, [searchTerm, planetNames]);

  // Update parent filters/search
  useEffect(() => {
    if (onSearch) onSearch(searchTerm);
  }, [searchTerm]);

  // Handle planet select from suggestions
  const handleSelect = (planet) => {
    setSearchTerm(planet.name);
    setFilteredNames([]);
    setIsInputFocused(false);
    setRecentSearches((prev) => [planet, ...prev.filter(p => p.name !== planet.name)].slice(0, 5));
    if (onSearch) onSearch(planet.name);
  };

  const showSuggestions = isInputFocused && (filteredNames.length > 0 || (searchTerm === "" && recentSearches.length > 0));

  return (
    <section className="relative h-[70vh] min-h-[600px] flex flex-col items-center justify-center text-center text-white overflow-hidden">
      
      {/* 3D Space Background */}
      <div className="absolute inset-0 -z-30">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} color="#7e22ce" />
          <Stars radius={150} depth={60} count={4000} factor={4} fade speed={0.5} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.3} />
        </Canvas>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-blue-900/20 to-black -z-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-purple-900/10 to-black -z-20" />
      <div className="absolute inset-0 bg-radial-gradient(from-circle at center, transparent 0%, black 90%) -z-20" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 w-full max-w-6xl mx-auto">

        {/* Search Bar */}
        <motion.div 
          className="relative max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for planets by name or host star..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
            />
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute w-full mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {filteredNames.map(planet => (
                  <motion.div
                    key={planet.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="px-4 py-3 cursor-pointer hover:bg-cyan-600/20 transition-colors border-b border-white/5 last:border-b-0"
                    onClick={() => handleSelect(planet)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaGlobe className="text-cyan-400" />
                        <span className="text-white font-medium">{planet.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {planet.habitability?.score && (
                          <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full">
                            Score: {planet.habitability.score}
                          </span>
                        )}
                        {planet.distance && (
                          <span>{planet.distance} ly</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Recent Searches */}
                {searchTerm === "" && recentSearches.length > 0 && (
                  <>
                    <div className="px-4 py-2 bg-black/30 border-b border-white/5">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <FaHistory className="text-xs" />
                        Recent Searches
                      </div>
                    </div>
                    {recentSearches.map(planet => (
                      <motion.div
                        key={planet.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="px-4 py-3 cursor-pointer hover:bg-purple-600/20 transition-colors border-b border-white/5 last:border-b-0"
                        onClick={() => handleSelect(planet)}
                      >
                        <div className="flex items-center gap-3">
                          <FaGlobe className="text-purple-400" />
                          <span className="text-white">{planet.name}</span>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filters & Sort */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Score Filter */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <FaChartLine className="text-green-400" />
              <label className="text-gray-300 text-sm font-medium">Min Score</label>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={filters.minScore}
              onChange={e => setFilters({ ...filters, minScore: Number(e.target.value) })}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">0</span>
              <span className="text-green-400 font-semibold">{filters.minScore}+</span>
              <span className="text-xs text-gray-400">100</span>
            </div>
          </div>

          {/* Star Type Filter */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <FaStar className="text-yellow-400" />
              <label className="text-gray-300 text-sm font-medium">Star Type</label>
            </div>
            <select
              className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-xl text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              value={filters.starType}
              onChange={e => setFilters({ ...filters, starType: e.target.value })}
            >
              <option value="">All Star Types</option>
              <option value="G">G-Type (Sun-like)</option>
              <option value="K">K-Type (Orange Dwarf)</option>
              <option value="M">M-Type (Red Dwarf)</option>
              <option value="F">F-Type</option>
              <option value="A">A-Type</option>
              <option value="B">B-Type</option>
              <option value="O">O-Type</option>
            </select>
          </div>

          {/* ✅ Distance Filter (Now 10,000 ly) */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <FaRuler className="text-cyan-400" />
              <label className="text-gray-300 text-sm font-medium">Max Distance</label>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={100}
              value={filters.maxDistance}
              onChange={e => setFilters({ ...filters, maxDistance: Number(e.target.value) })}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">0 ly</span>
              <span className="text-cyan-400 font-semibold">{filters.maxDistance} ly</span>
              <span className="text-xs text-gray-400">10,000 ly</span>
            </div>
          </div>

          {/* Sort Filter */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <FaChartLine className="text-purple-400" />
              <label className="text-gray-300 text-sm font-medium">Sort By</label>
            </div>
            <select
              className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-xl text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filters.sortBy}
              onChange={e => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="score">Highest Score</option>
              <option value="distance">Closest to Earth</option>
              <option value="earthLike">Most Earth-like</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </motion.div>

        {/* Info Text */}
        <motion.div 
          className="mt-8 text-gray-400 text-sm max-w-2xl mx-auto backdrop-blur-sm bg-black/30 p-4 rounded-2xl border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="flex items-center gap-2 justify-center">
            <FaInfoCircle className="text-cyan-400" />
            <span>
              Habitability scores are calculated based on Earth Similarity Index (ESI),
              distance from host star, and other factors.
            </span>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </section>
  );
}
