import React, { useState, useEffect } from "react";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

// Components
import PlanetDetailsCard from "../components/habitability-predictor/PlanetDetailsCard";
import HabitabilityGauge from "../components/habitability-predictor/HabitabilityGauge";
import PlanetSizeHabitabilityChart from "../components/habitability-predictor/PlanetSizeHabitabilityChart";
import PlanetTempHabitabilityChart from "../components/habitability-predictor/PlanetTempHabitabilityChart";
import PlanetDistanceHabitabilityChart from "../components/habitability-predictor/PlanetDistanceHabitabilityChart";
import PlanetComparison from "../components/habitability-predictor/PlanetComparison";
import LeaderboardAndFilters from "../components/habitability-predictor/LeaderboardAndFilters";

// Icons
import { 
  FaSearch, 
  FaGlobeAmericas, 
  FaChartBar, 
  FaBalanceScale, 
  FaTrophy,
  FaFilter,
  FaThermometerHalf,
  FaSpaceShuttle,
  FaStar,
  FaMicroscope,
  FaSatellite,
  FaRobot,
  FaCompass
} from "react-icons/fa";

const PredictHabitability = () => {
  const [activeTab, setActiveTab] = useState("predictor");
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState("");
  const [planetDetails, setPlanetDetails] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [allPredictions, setAllPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [showHabitableOnly, setShowHabitableOnly] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState([0, 5000]); // ly
  const [tempFilter, setTempFilter] = useState([0, 10000]); // K

  // Fetch planets from backend
  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/habitability/planets");
        setPlanets(res.data);
      } catch (err) {
        console.error("Error fetching planets:", err.message);
      }
    };
    fetchPlanets();
  }, []);

  // Filter planets for dropdown
  const filteredPlanets = planets
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (showHabitableOnly ? p.habitability_label === 1 : true))
    .filter((p) => p.distance_ly >= distanceFilter[0] && p.distance_ly <= distanceFilter[1])
    .filter((p) => p.temp_k >= tempFilter[0] && p.temp_k <= tempFilter[1]);

  // Handle planet selection
  const handleSelectPlanet = (planetName) => {
    setSelectedPlanet(planetName);
    const details = planets.find((p) => p.name === planetName);
    setPlanetDetails(details || null);
    setPrediction(null); // Reset prediction when planet changes
  };

  // Handle Predict
  const handlePredict = async () => {
    if (!selectedPlanet) return alert("Please select a planet!");

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/habitability/predict",
        { name: selectedPlanet }
      );

      setPrediction(response.data);
      setAllPredictions((prev) => [...prev, { ...response.data, ...planetDetails }]);
    } catch (err) {
      console.error("Prediction failed", err);
      alert("Prediction failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* 3D Space Background - Behind ALL content */}
      <div className="fixed inset-0 -z-50">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} color="#7e22ce" />
          <Stars radius={150} depth={60} count={4000} factor={4} fade speed={0.5} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.3} />
        </Canvas>
      </div>

      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-purple-900/40 via-blue-900/20 to-black -z-40" />
      <div className="fixed inset-0 bg-gradient-to-t from-black via-purple-900/10 to-black -z-40" />
      <div className="fixed inset-0 bg-radial-gradient(from-circle at center, transparent 0%, black 90%) -z-40" />
      
      {/* Animated particles */}
      <div className="fixed inset-0 -z-30 overflow-hidden">
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

      {/* Main Content - Full Width */}
      <div className="relative z-10 min-h-screen">
        
        {/* ==================== */}
        {/* 1. HEADER SECTION */}
        {/* ==================== */}
        <motion.div 
          className="pt-16 pb-8 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.div 
                className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-2xl border border-white/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaRobot className="text-4xl text-white" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
                AI Habitability Analyzer
              </h1>
            </div>
            <p className="text-gray-300 text-lg md:text-xl max-w-4xl mx-auto backdrop-blur-sm bg-black/30 px-8 py-4 rounded-2xl border border-white/10">
              Advanced machine learning analysis of planetary habitability across thousands of discovered exoplanets
            </p>
          </div>
        </motion.div>

        {/* ==================== */}
        {/* 2. TABS NAVIGATION */}
        {/* ==================== */}
        <motion.div
          className="flex justify-center mb-8 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="inline-flex backdrop-blur-sm bg-black/40 rounded-2xl border border-white/10 p-1 shadow-2xl">
            {[
              { id: "predictor", label: "AI Predictor", icon: <FaMicroscope />, color: "from-cyan-500 to-blue-500" },
              { id: "analytics", label: "Analytics", icon: <FaChartBar />, color: "from-green-500 to-emerald-500" },
              { id: "comparison", label: "Comparison", icon: <FaBalanceScale />, color: "from-purple-500 to-pink-500" },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ==================== */}
        {/* MAIN CONTENT - FULL WIDTH */}
        {/* ==================== */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-16">
          
          {/* PREDICTOR TAB CONTENT */}
          {activeTab === "predictor" && (
            <motion.div
              className="space-y-8 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              
              {/* ==================== */}
              {/* 3. DISCOVERY PARAMETERS - FULL WIDTH */}
              {/* ==================== */}
              <motion.div 
                className="w-full bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
                  {/* Search Input */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaSearch className="text-cyan-400" />
                      Search Planet
                    </label>
                    <input
                      type="text"
                      placeholder="Enter planet name..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-sm"
                    />
                  </div>

                  {/* Habitable Only Toggle */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaGlobeAmericas className="text-green-400" />
                      Filter Type
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl border border-white/10 backdrop-blur-sm w-full">
                      <input
                        type="checkbox"
                        id="habitableOnly"
                        checked={showHabitableOnly}
                        onChange={() => setShowHabitableOnly(!showHabitableOnly)}
                        className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
                      />
                      <label htmlFor="habitableOnly" className="text-white cursor-pointer text-sm">
                        Show Habitable Only
                      </label>
                    </div>
                  </div>

                  {/* Distance Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaSpaceShuttle className="text-blue-400" />
                      Max Distance: {distanceFilter[1]} ly
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={distanceFilter[1]}
                      onChange={(e) => setDistanceFilter([0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0 ly</span>
                      <span>5000 ly</span>
                    </div>
                  </div>

                  {/* Temperature Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaThermometerHalf className="text-red-400" />
                      Max Temperature: {tempFilter[1]}K
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={tempFilter[1]}
                      onChange={(e) => setTempFilter([0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0K</span>
                      <span>10000K</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ==================== */}
              {/* 4. PLANET SELECTION DROPDOWN - FULL WIDTH */}
              {/* ==================== */}
              <motion.div 
                className="w-full bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                    <FaStar className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Select Planetary System</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
                  {/* Planet Dropdown - Full Width */}
                  <div className="lg:col-span-3">
                    <select
                      value={selectedPlanet}
                      onChange={(e) => handleSelectPlanet(e.target.value)}
                      className="w-full p-4 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-sm text-lg"
                    >
                      <option value="">-- Choose a Planetary System --</option>
                      {filteredPlanets.map((planet, index) => (
                        <option key={index} value={planet.name}>
                          {planet.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Predict Button */}
                  <div className="lg:col-span-1">
                    <motion.button
                      onClick={handlePredict}
                      disabled={loading || !selectedPlanet}
                      whileHover={{ scale: loading || !selectedPlanet ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full h-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 text-lg ${
                        loading || !selectedPlanet
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <FaSatellite className="text-xl" />
                          Predict Habitability
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Available Planets Count */}
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-gray-400 text-sm">
                    {search && (
                      <>Search results for "<span className="text-cyan-300">{search}</span>"</>
                    )}
                  </span>
                  <span className="text-cyan-400 font-semibold">
                    {filteredPlanets.length} planets available
                  </span>
                </div>
              </motion.div>

              {/* ==================== */}
              {/* 5. PLANET DETAILS - FULL WIDTH */}
              {/* ==================== */}
              {planetDetails && (
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  <PlanetDetailsCard planet={planetDetails} />
                </motion.div>
              )}

              {/* ==================== */}
              {/* 6. PREDICTION RESULTS - FULL WIDTH */}
              {/* ==================== */}
              <AnimatePresence>
                {prediction && (
                  <motion.div 
                    className="w-full bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        <FaChartBar className="text-white text-xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        AI Analysis Results for <span className="text-cyan-400">{prediction.planet}</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                      {/* Prediction Results */}
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10">
                            <div className="text-sm text-gray-300 mb-3">Prediction</div>
                            <div className={`text-3xl font-bold ${
                              prediction.habitability_label === 1
                                ? "text-green-400"
                                : "text-red-400"
                            }`}>
                              {prediction.prediction}
                            </div>
                          </div>
                          <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10">
                            <div className="text-sm text-gray-300 mb-3">Confidence Level</div>
                            <div className={`text-2xl font-semibold ${
                              prediction.habitability_label === 1
                                ? "text-green-400"
                                : "text-red-400"
                            }`}>
                              {prediction.habitability_label === 1 ? "High" : "Low"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10">
                          <div className="text-sm text-gray-300 mb-3">AI Analysis Summary</div>
                          <div className="text-cyan-400 text-lg leading-relaxed">
                            {prediction.habitability_label === 1 
                              ? "This exoplanet demonstrates strong potential for habitability with favorable environmental conditions and stable orbital parameters."
                              : "Current analysis indicates limited habitability potential due to challenging environmental factors and orbital characteristics."
                            }
                          </div>
                        </div>
                      </div>

                      {/* Gauge Visualization */}
                      <div className="flex flex-col items-center justify-center">
                        <HabitabilityGauge score={prediction.habitability_score} />
                        <div className="text-center mt-6">
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ANALYTICS TAB CONTENT - FULL WIDTH */}
          {activeTab === "analytics" && (
            <motion.div
              className="w-full space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <PlanetSizeHabitabilityChart predictions={allPredictions} />
              <PlanetTempHabitabilityChart predictions={allPredictions} />
              <PlanetDistanceHabitabilityChart predictions={allPredictions} />
            </motion.div>
          )}

          {/* COMPARISON TAB CONTENT - FULL WIDTH */}
          {activeTab === "comparison" && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <PlanetComparison planets={planets} />
            </motion.div>
          )}

          {/* LEADERBOARD TAB CONTENT - FULL WIDTH */}
          {activeTab === "leaderboard" && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <FaTrophy className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">Habitability Leaderboard</h2>
              </div>
              <LeaderboardAndFilters />
            </motion.div>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 2px solid #1f2937;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 2px solid #1f2937;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-15px) rotate(5deg); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default PredictHabitability;