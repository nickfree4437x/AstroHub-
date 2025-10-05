// src/pages/MissionControlDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls, Sparkles } from "@react-three/drei";
import HeroSection from "../components/mission/HeroSection";
import MissionTimeline from "../components/mission/MissionTimeline";
import MissionCardsGrid from "../components/mission/MissionCardsGrid";
import MissionDetailModal from "../components/mission/MissionDetailModal";
import MissionAnalytics from "../components/mission/MissionAnalytics";
import { fetchMissions } from "../lib/api";
import { 
  FaRocket, 
  FaChartBar, 
  FaFilter, 
  FaChevronLeft, 
  FaChevronRight,
  FaGlobeAmericas,
  FaCalendarAlt,
  FaSortAmountDown,
  FaSpinner
} from "react-icons/fa";

// Enhanced 3D Space Background Component
const SpaceBackground = () => (
  <Canvas className="absolute inset-0">
    <ambientLight intensity={0.6} />
    <directionalLight position={[10, 10, 5]} intensity={1} color="#4f46e5" />
    <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#06b6d4" />
    
    {/* Multiple star layers for depth */}
    <Stars radius={100} depth={50} count={2000} factor={4} fade speed={0.5} />
    <Stars radius={150} depth={30} count={1000} factor={6} fade speed={1} />
    
    {/* Nebula effects */}
    <Sparkles
      count={50}
      scale={[20, 15, 20]}
      size={4}
      speed={0.4}
      opacity={0.3}
      color="#8b5cf6"
    />
    
    <OrbitControls 
      enableZoom={false} 
      enablePan={false} 
      autoRotate={true}
      autoRotateSpeed={0.3}
    />
  </Canvas>
);

export default function MissionControlDashboard() {
  const [missions, setMissions] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAgency, setFilterAgency] = useState("All");
  const [filterDestination, setFilterDestination] = useState("All");
  const [sortOption, setSortOption] = useState("Year (Newest)");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMission, setSelectedMission] = useState(null);
  const [activeTab, setActiveTab] = useState("missions");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const missionsPerPage = 12;

  // Fetch missions from backend
  useEffect(() => {
    const loadMissions = async () => {
      setLoading(true);
      try {
        const data = await fetchMissions();
        const mappedMissions = (data || []).map((m) => ({
          id: m.missionId,
          name: m.name,
          agency: m.agency || "Unknown",
          destination: m.destination || "Unknown",
          launchDate: m.launchDate,
          status: m.status || "TBD",
          crew: m.crew || [],
          duration: m.duration || "N/A",
          cost: m.cost || "N/A",
          image: m.image || null,
          details: m.details || "",
          overview: m.overview || "",
          launchVehicle: m.launchVehicle || "",
          events: m.events || [],
          multimedia: m.multimedia || [],
          stats: m.stats || {},
        }));
        setMissions(mappedMissions);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load missions.");
      } finally {
        setLoading(false);
      }
    };
    loadMissions();
  }, []);

  // Unique filters
  const agencies = ["All", ...new Set(missions.map((m) => m.agency))];
  const destinations = ["All", ...new Set(missions.map((m) => m.destination))];

  // Filtering + Sorting
  const filteredMissions = missions
    .filter((m) => {
      const statusMatch =
        !filterStatus ||
        (filterStatus === "Past" && m.status.toLowerCase().includes("success")) ||
        (filterStatus === "Ongoing" && m.status.toLowerCase().includes("go")) ||
        (filterStatus === "Upcoming" && m.status.toLowerCase().includes("tbd"));

      const agencyMatch = filterAgency === "All" || m.agency === filterAgency;
      const destinationMatch =
        filterDestination === "All" || m.destination === filterDestination;

      const query = searchQuery.toLowerCase();
      const searchMatch =
        m.name.toLowerCase().includes(query) ||
        m.agency.toLowerCase().includes(query) ||
        (m.launchDate
          ? new Date(m.launchDate).getFullYear().toString().includes(query)
          : false);

      return statusMatch && agencyMatch && destinationMatch && searchMatch;
    })
    .sort((a, b) => {
      const yearA = a.launchDate ? new Date(a.launchDate).getFullYear() : 0;
      const yearB = b.launchDate ? new Date(b.launchDate).getFullYear() : 0;
      switch (sortOption) {
        case "Year (Newest)":
          return yearB - yearA;
        case "Year (Oldest)":
          return yearA - yearB;
        case "Name (A-Z)":
          return a.name.localeCompare(b.name);
        case "Name (Z-A)":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  // Pagination Logic
  const indexOfLastMission = currentPage * missionsPerPage;
  const indexOfFirstMission = indexOfLastMission - missionsPerPage;
  const currentMissions = filteredMissions.slice(
    indexOfFirstMission,
    indexOfLastMission
  );
  const totalPages = Math.ceil(filteredMissions.length / missionsPerPage);

  const handleExplore = (mission) => setSelectedMission(mission);

  // Callback from analytics
  const handleAnalyticsFilter = (filter) => {
    if (filter.agency) setFilterAgency(filter.agency);
    if (filter.destination) setFilterDestination(filter.destination);
    setCurrentPage(1);
  };

  const statusFilters = [
    { value: "", label: "All Missions", color: "gray" },
    { value: "Past", label: "Past Missions", color: "green" },
    { value: "Ongoing", label: "Ongoing", color: "blue" },
    { value: "Upcoming", label: "Upcoming", color: "purple" },
  ];

  const sortOptions = [
    "Year (Newest)",
    "Year (Oldest)", 
    "Name (A-Z)",
    "Name (Z-A)"
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative">
      {/* 3D Space Background */}
      <div className="fixed inset-0 -z-10">
        <SpaceBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-purple-900/40 to-gray-900/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection onSearch={setSearchQuery} />

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Tab Navigation */}
<motion.div 
  className="flex justify-center mb-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-1 border border-gray-700">
    <div className="flex gap-1">
      {[
        { id: "missions", label: "Missions", icon: FaRocket },
        { id: "analytics", label: "Analytics", icon: FaChartBar }
      ].map((tab) => {
        const IconComponent = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 min-w-[140px] justify-center ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                : "text-gray-300 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            <IconComponent className={`text-lg ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  </div>
</motion.div>

          {/* Loading and Error States */}
          {loading && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="inline-flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm px-6 py-4 rounded-2xl border border-gray-700">
                <FaSpinner className="animate-spin text-blue-500" />
                <span className="text-gray-300">Loading missions...</span>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl px-6 py-4 max-w-md mx-auto">
                <span className="text-red-400">{error}</span>
              </div>
            </motion.div>
          )}

          {/* Filters & Controls */}
          {!loading && !error && activeTab === "missions" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 mb-8"
            >
              {/* Status Filters */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaFilter className="text-blue-400" />
                  Mission Status
                </h3>
                <div className="flex flex-wrap gap-3">
                  {statusFilters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => {
                        setFilterStatus(filter.value);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filterStatus === filter.value
                          ? `bg-${filter.color}-500 text-white shadow-lg`
                          : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Agency Filter */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                  <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <FaGlobeAmericas className="text-green-400" />
                    Agency
                  </label>
                  <select
                    value={filterAgency}
                    onChange={(e) => {
                      setFilterAgency(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {agencies.map((agency) => (
                      <option key={agency} value={agency}>
                        {agency}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination Filter */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                  <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <FaRocket className="text-purple-400" />
                    Destination
                  </label>
                  <select
                    value={filterDestination}
                    onChange={(e) => {
                      setFilterDestination(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {destinations.map((dest) => (
                      <option key={dest} value={dest}>
                        {dest}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                  <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <FaSortAmountDown className="text-yellow-400" />
                    Sort By
                  </label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sortOptions.map((sort) => (
                      <option key={sort} value={sort}>
                        {sort}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Missions Tab Content */}
          <AnimatePresence mode="wait">
            {!loading && !error && activeTab === "missions" && (
              <motion.div
                key="missions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Mission Timeline */}
                <div className="mb-12">
                  <MissionTimeline
                    missions={filteredMissions}
                    filterStatus={filterStatus}
                    onDotClick={handleExplore}
                    showTooltip={true}
                    coloredDots={true}
                  />
                </div>

                {/* Mission Cards Grid */}
                <div className="mb-8">
                  <MissionCardsGrid 
                    missions={currentMissions} 
                    onExplore={handleExplore} 
                  />
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div 
                    className="flex justify-center items-center gap-3 mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-30 rounded-lg transition-all border border-gray-600"
                    >
                      <FaChevronLeft />
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                        const pageNum = currentPage <= 3 
                          ? idx + 1 
                          : currentPage >= totalPages - 2 
                          ? totalPages - 4 + idx 
                          : currentPage - 2 + idx;
                        
                        if (pageNum < 1 || pageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                              currentPage === pageNum
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-30 rounded-lg transition-all border border-gray-600"
                    >
                      Next
                      <FaChevronRight />
                    </button>
                  </motion.div>
                )}

                {/* Results Count */}
                <motion.div 
                  className="text-center mt-6 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Showing {currentMissions.length} of {filteredMissions.length} missions
                </motion.div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {!loading && !error && activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <MissionAnalytics
                  missions={filteredMissions}
                  onFilterClick={handleAnalyticsFilter}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mission Detail Modal */}
      <MissionDetailModal
        mission={selectedMission}
        onClose={() => setSelectedMission(null)}
      />
    </div>
  );
}