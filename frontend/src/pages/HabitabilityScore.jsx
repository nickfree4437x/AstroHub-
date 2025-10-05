// src/pages/HabitabilityScore.jsx
import { useState, useEffect } from "react";
import { usePlanets } from "../hooks/usePlanets";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";

// Components
import HabitabilityFilters from "../components/Habitability/HabitabilityFilters";
import PlanetGrid from "../components/Habitability/PlanetGrid";
import PlanetCompare from "../components/Habitability/PlanetCompare";
import PlanetDetailModal from "../components/Habitability/PlanetDetailModal";
import PlanetDataTable from "../components/Habitability/PlanetDataTable";
import HabitabilityCTA from "../components/Habitability/HabitabilityCTA";
import HabitabilityAnalytics from "../components/Habitability/HabitabilityAnalytics";

// Icons
import { FaChartLine, FaGlobeAmericas } from "react-icons/fa";

export default function HabitabilityScore() {
  const { planets: fetchedPlanets, loading } = usePlanets();
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [comparisonPlanets, setComparisonPlanets] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [activeTab, setActiveTab] = useState("habitability"); // Default tab
  const [filters, setFilters] = useState({
    q: "",
    minScore: 0,
    starType: "",
    maxDistance: 5000,
    sortBy: "score",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const planetsPerPage = 12;

  // Apply filters, search, and sorting
  useEffect(() => {
    if (!fetchedPlanets) return;

    let filtered = [...fetchedPlanets];

    // Search by name or host star
    if (filters.q) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(filters.q.toLowerCase()) ||
          p.hostStar?.toLowerCase().includes(filters.q.toLowerCase())
      );
    }

    // Filters
    if (filters.minScore) filtered = filtered.filter(p => (p.habitability?.score ?? 0) >= filters.minScore);
    if (filters.starType) filtered = filtered.filter(p => p.starType?.toLowerCase() === filters.starType.toLowerCase());
    if (filters.maxDistance) filtered = filtered.filter(p => (p.distance ?? Infinity) <= filters.maxDistance);

    // Sorting
    if (filters.sortBy === "score") filtered.sort((a, b) => (b.habitability?.score ?? 0) - (a.habitability?.score ?? 0));
    if (filters.sortBy === "distance") filtered.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    if (filters.sortBy === "earthLike") filtered.sort((a, b) =>
      Math.abs(100 - (b.habitability?.score ?? 0)) - Math.abs(100 - (a.habitability?.score ?? 0))
    );

    setPlanets(filtered);
    setCurrentPage(1); // reset to first page after filtering
  }, [fetchedPlanets, filters]);

  // Pagination calculation
  const indexOfLast = currentPage * planetsPerPage;
  const indexOfFirst = indexOfLast - planetsPerPage;
  const currentPlanets = planets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(planets.length / planetsPerPage);

  // Handlers
  const handlePlanetClick = (planet) => setSelectedPlanet(planet);

  const handleCompare = (planet) => {
    if (comparisonPlanets.find(p => p.name === planet.name)) return;
    if (comparisonPlanets.length >= 3) {
      alert("You can compare up to 3 planets only");
      return;
    }
    setComparisonPlanets([...comparisonPlanets, planet]);
  };

  const removeFromComparison = (planetName) => {
    setComparisonPlanets(comparisonPlanets.filter(p => p.name !== planetName));
  };

  const handleSearch = (query) => setFilters({ ...filters, q: query });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            🚀 Discovering habitable planets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="habitability-page min-h-screen text-white overflow-hidden relative">
      {/* 3D Space Background */}
      <div className="fixed inset-0 -z-30">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} color="#7e22ce" />
          <Stars radius={150} depth={60} count={4000} factor={4} fade speed={0.5} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.3} />
        </Canvas>
      </div>

      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-purple-900/40 via-blue-900/20 to-black -z-20" />
      <div className="fixed inset-0 bg-gradient-to-t from-black via-purple-900/10 to-black -z-20" />
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

        {/* Header */}
        <motion.div 
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl">
            Planet Habitability Score
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mt-4 max-w-3xl mx-auto backdrop-blur-sm bg-black/30 px-6 py-3 rounded-2xl border border-white/10">
            iscover and compare exoplanets based on their potential to support life
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex backdrop-blur-sm bg-black/40 rounded-2xl border border-white/10 p-1">
            <button
              onClick={() => setActiveTab("habitability")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === "habitability"
                  ? "bg-gradient-to-r from-green-600 to-cyan-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <FaGlobeAmericas className="text-lg" />
              Habitability Score
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-green-600 to-cyan-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <FaChartLine className="text-lg" />
              Analytics
            </button>
          </div>
        </motion.div>

        {/* Habitability Score Tab */}
        {activeTab === "habitability" && (
          <>
            {/* Filters + Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <HabitabilityFilters
                filters={filters}
                setFilters={setFilters}
                onSearch={handleSearch}
              />
            </motion.div>

            {/* Results Count */}
            <motion.div 
              className="flex justify-between items-center flex-wrap gap-4 backdrop-blur-sm bg-black/40 p-4 rounded-2xl border border-white/10 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-lg">
                <span className="text-green-400 font-semibold">{planets.length}</span> habitable planets found
                {filters.q && (
                  <span className="text-gray-400 ml-2">
                    for "<span className="text-cyan-400">{filters.q}</span>"
                  </span>
                )}
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-4">
                {comparisonPlanets.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{comparisonPlanets.length} selected for comparison</span>
                    <button
                      onClick={() => setComparisonPlanets([])}
                      className="px-3 py-1 text-sm bg-red-600/30 hover:bg-red-600/50 rounded-lg border border-red-500/30 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => setShowTable(!showTable)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                >
                  {showTable ? (
                    <>
                      <span>Card View</span>
                    </>
                  ) : (
                    <>
                      <span>Table View</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Cards or Table */}
            <AnimatePresence mode="wait">
              {showTable ? (
                <motion.div
                  key="table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <PlanetDataTable planets={planets} onPlanetClick={handlePlanetClick} />
                </motion.div>
              ) : (
                <motion.div
                  key="cards"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <PlanetGrid
                    planets={currentPlanets}
                    onCardClick={handlePlanetClick}
                    onCompare={handleCompare}
                    comparisonList={comparisonPlanets}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div 
                      className="flex justify-center items-center gap-2 mt-12 flex-wrap backdrop-blur-sm bg-black/40 p-4 rounded-2xl border border-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 transition-all border border-white/10 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = currentPage <= 3 
                          ? i + 1 
                          : currentPage >= totalPages - 2 
                          ? totalPages - 4 + i 
                          : currentPage - 2 + i;
                        
                        if (pageNum < 1 || pageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-lg transition-all ${
                              currentPage === pageNum
                                ? "bg-gradient-to-r from-green-600 to-cyan-600 text-white shadow-lg"
                                : "bg-white/5 hover:bg-white/10 border border-white/10"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 transition-all border border-white/10 flex items-center gap-2"
                      >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Compare Button */}
            {comparisonPlanets.length >= 2 && (
              <motion.button
                onClick={() => setShowCompareModal(true)}
                className="fixed bottom-8 right-8 px-6 py-3 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 rounded-full shadow-2xl text-white font-semibold flex items-center gap-2 z-50 backdrop-blur-sm border border-green-400/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <span>🔍</span>
                Compare ({comparisonPlanets.length})
              </motion.button>
            )}

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-16"
            >
              <HabitabilityCTA />
            </motion.div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HabitabilityAnalytics
              planets={planets}
              onFilterByStarType={(type) => setFilters({...filters, starType: type})}
            />
          </motion.div>
        )}
      </div>

      {/* Planet Comparison Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <PlanetCompare
            planets={comparisonPlanets}
            onClose={() => setShowCompareModal(false)}
            onRemove={removeFromComparison}
          />
        )}
      </AnimatePresence>

      {/* Planet Detail Modal */}
      <AnimatePresence>
        {selectedPlanet && (
          <PlanetDetailModal
            planet={selectedPlanet}
            onClose={() => setSelectedPlanet(null)}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-15px) rotate(5deg); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}