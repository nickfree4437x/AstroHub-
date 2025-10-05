// src/pages/PlanetExplorer.jsx
import React, { useState, useMemo } from "react";
import { usePlanets } from "../hooks/usePlanets";
import PlanetCard from "../components/explorer/PlanetCard";
import PlanetModal from "../components/explorer/PlanetModal";
import PlanetFilters from "../components/explorer/PlanetFilters";
import PlanetCharts from "../components/explorer/PlanetCharts";
import PlanetCompareModal from "../components/explorer/PlanetCompareModal";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";

// Icons
import { FaSearch, FaChartBar, FaGlobeAmericas, FaRocket } from "react-icons/fa";

export default function PlanetExplorer() {
  const { planets = [], loading } = usePlanets();
  const [activeTab, setActiveTab] = useState("explore");
  const [viewMode, setViewMode] = useState("cards");
  const [selected, setSelected] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [maxDistance, setMaxDistance] = useState(5000);
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showCompare, setShowCompare] = useState(false);

  const itemsPerPage = 12;

  // ✅ Filter + Sort planets
  const filtered = useMemo(() => {
    return planets
      .filter((p) => {
        const name = (p.name ?? p.pl_name ?? "").toLowerCase();
        const method = (p.discoveryMethod ?? p.discoverymethod ?? "Unknown");
        const year = (p.discoveryYear ?? p.disc_year ?? "Unknown");
        const distance = Number(p.distance ?? p.sy_dist ?? p.distancePc ?? Infinity);

        if (search && !name.includes(search.toLowerCase())) return false;
        if (filterMethod !== "All" && method !== filterMethod) return false;
        if (filterYear !== "All" && year !== filterYear) return false;
        if (distance > maxDistance) return false;

        return true;
      })
      .sort((a, b) => {
        const valA = a[sortKey] ?? a[`pl_${sortKey}`] ?? a[`${sortKey}Re`] ?? 0;
        const valB = b[sortKey] ?? b[`pl_${sortKey}`] ?? b[`${sortKey}Re`] ?? 0;

        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }
        return sortOrder === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [planets, search, filterMethod, filterYear, maxDistance, sortKey, sortOrder]);

  // ✅ Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Add/remove planet for comparison
  const handleCompareSelect = (planet, checked) => {
    setCompareList((prev) => {
      if (!checked) {
        return prev.filter((p) => p._id !== planet._id && p.name !== planet.name);
      }
      if (prev.length >= 3) return prev; // limit to 3 planets
      return [...prev, planet];
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <FaRocket className="animate-bounce" />
            🚀 Discovering planets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
            Planet Data Explorer
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mt-4 max-w-3xl mx-auto backdrop-blur-sm bg-black/30 px-6 py-3 rounded-2xl border border-white/10">
            Explore thousands of discovered exoplanets with real-time data & visualizations
          </p>
        </motion.div>

        {/* Tabs - Inline */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex backdrop-blur-sm bg-black/40 rounded-2xl border border-white/10 p-1">
            <button
              onClick={() => setActiveTab("explore")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === "explore"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <FaGlobeAmericas className="text-lg" />
              Explore Planets
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <FaChartBar className="text-lg" />
              Analytics
            </button>
          </div>
        </motion.div>

        {/* Explore Tab Content */}
        {activeTab === "explore" && (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <PlanetFilters
                search={search}
                setSearch={setSearch}
                filterMethod={filterMethod}
                setFilterMethod={setFilterMethod}
                filterYear={filterYear}
                setFilterYear={setFilterYear}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
                sortKey={sortKey}
                setSortKey={setSortKey}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                planets={planets}
              />
            </motion.div>

            {/* Results Count */}
            <motion.div 
              className="mt-10 flex justify-between items-center flex-wrap gap-4 backdrop-blur-sm bg-black/40 p-4 rounded-2xl border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-lg">
                <span className="text-purple-400 font-semibold">{filtered.length}</span> planets found
                {search && (
                  <span className="text-gray-400 ml-2">
                    for "<span className="text-cyan-400">{search}</span>"
                  </span>
                )}
              </div>
              
              {compareList.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{compareList.length} selected for comparison</span>
                  <button
                    onClick={() => setCompareList([])}
                    className="px-3 py-1 text-sm bg-red-600/30 hover:bg-red-600/50 rounded-lg border border-red-500/30 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
            </motion.div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <motion.div 
                className="text-center mt-16 p-12 backdrop-blur-sm bg-black/40 rounded-3xl border border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="text-6xl mb-4">🌌</div>
                <h3 className="text-2xl text-gray-300 mb-2">No planets found</h3>
                <p className="text-gray-400">Try adjusting your filters to discover more exoplanets</p>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {paginated.map((p) => (
                  <PlanetCard
                    key={p._id ?? p.pl_name ?? p.name}
                    planet={p}
                    onOpen={setSelected}
                    onSelect={handleCompareSelect}
                    selectedForCompare={compareList.some(
                      (c) => c._id === p._id || c.name === p.name
                    )}
                  />
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                className="flex justify-center items-center gap-2 mt-12 flex-wrap backdrop-blur-sm bg-black/40 p-4 rounded-2xl border border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
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
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
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
          </>
        )}

        {/* Analytics Tab Content */}
        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <PlanetCharts planets={filtered} />
          </motion.div>
        )}

        {/* Compare Button */}
        {compareList.length >= 2 && activeTab === "explore" && (
          <motion.button
            onClick={() => setShowCompare(true)}
            className="fixed bottom-8 right-8 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-full shadow-2xl text-white font-semibold flex items-center gap-2 z-50 backdrop-blur-sm border border-pink-400/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <FaSearch className="text-lg" />
            Compare ({compareList.length})
          </motion.button>
        )}

        {/* Modals */}
        {selected && (
          <PlanetModal planet={selected} onClose={() => setSelected(null)} />
        )}
        {showCompare && (
          <PlanetCompareModal
            planets={compareList}
            onClose={() => setShowCompare(false)}
          />
        )}
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