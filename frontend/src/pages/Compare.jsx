// src/pages/PlanetCompare.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { EARTH, computeGravityG, kToC } from "../utils/earth";
import PlanetSelector from "../components/compare/PlanetSelector";
import ParameterToggles from "../components/compare/ParameterToggles";
import DataCards from "../components/compare/DataCards";
import Charts from "../components/compare/Charts";
import AiNarrative from "../components/compare/AiNarrative";
import FunFactTooltip from "../components/compare/FunFactTooltip";
import { 
  FaGlobe, 
  FaChartLine, 
  FaRocket, 
  FaBalanceScale, 
  FaTemperatureHigh,
  FaCalendarAlt,
  FaRuler,
  FaWeightHanging,
  FaStar,
  FaCloud,
  FaSolarPanel,
  FaSave,
  FaShare,
  FaDownload,
  FaExchangeAlt
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const allMetrics = [
  "Gravity", "Temp", "Orbit", "Radius", "Mass",
  "Star Type", "Atmosphere", "Stellar Activity"
];

// Enhanced fun facts with icons
const funFacts = {
  Gravity: {
    fact: "Earth's gravity is 9.8 m/s². Some exoplanets may have stronger or weaker gravity affecting human adaptation.",
    icon: <FaBalanceScale />
  },
  Temp: {
    fact: "Earth's average temperature is ~15°C. Habitable zone planets maintain liquid water temperatures.",
    icon: <FaTemperatureHigh />
  },
  Orbit: {
    fact: "Earth takes 365.25 days to orbit the Sun. Orbital period affects seasonal variations.",
    icon: <FaCalendarAlt />
  },
  Radius: {
    fact: "Earth's radius is ~6371 km. Planet size influences atmospheric retention and geological activity.",
    icon: <FaRuler />
  },
  Mass: {
    fact: "Earth's mass is ~5.97 × 10^24 kg. Mass determines gravitational pull and internal pressure.",
    icon: <FaWeightHanging />
  },
  "Star Type": {
    fact: "Earth orbits a G-type main-sequence star. Different star types affect planetary evolution.",
    icon: <FaStar />
  },
  Atmosphere: {
    fact: "Earth's atmosphere is 78% nitrogen, 21% oxygen. Atmospheric composition is crucial for life.",
    icon: <FaCloud />
  },
  "Stellar Activity": {
    fact: "Sun's activity affects space weather and climate. Stellar flares can impact planetary habitability.",
    icon: <FaSolarPanel />
  }
};

export default function PlanetCompare() {
  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState([...allMetrics]);
  const [aiNarrative, setAiNarrative] = useState("");
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [savedComparisons, setSavedComparisons] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [comparisonHistory, setComparisonHistory] = useState([]);

  // Load planet names
  useEffect(() => {
    fetch(`${API}/api/v1/planets/names`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.items)) {
          const planetNames = data.items.map(p => p.name);
          setNames(planetNames);
          if (planetNames.length > 0 && !selectedName) setSelectedName(planetNames[0]);
        }
      }).catch(() => setNames([]));
  }, []);

  // Fetch selected planet details
  useEffect(() => {
    if (!selectedName) return;
    setLoading(true);
    fetch(`${API}/api/v1/planets/names/${encodeURIComponent(selectedName)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { 
        setPlanet(data); 
        setLoading(false);
        
        // Add to comparison history
        if (data) {
          setComparisonHistory(prev => {
            const filtered = prev.filter(p => p.name !== data.name);
            return [data, ...filtered.slice(0, 4)]; // Keep last 5 comparisons
          });
        }
      })
      .catch(() => { setPlanet(null); setLoading(false); });
  }, [selectedName]);

  // Fetch AI narrative
  useEffect(() => {
    if (!planet) return;

    async function fetchNarrative() {
      setNarrativeLoading(true);
      try {
        const metrics = {
          Gravity: computeGravityG(planet.mass, planet.radius),
          Temp: planet.teqK ? kToC(planet.teqK) : null,
          Orbit: planet.orbitalPeriod,
          Radius: planet.radius,
          Mass: planet.mass,
          "Star Type": planet.starType,
          Atmosphere: planet.atmosphere,
          "Stellar Activity": planet.stellarActivity
        };

        const res = await fetch(`${API}/api/openai/compare-narrative`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planetName: planet.name, metrics })
        });

        const data = await res.json();
        setAiNarrative(data.narrative || "No narrative available.");
      } catch (err) {
        console.error(err);
        setAiNarrative("Failed to fetch narrative.");
      }
      setNarrativeLoading(false);
    }

    fetchNarrative();
  }, [planet]);

  // Enhanced Radar & Bar chart data with more metrics - FIXED Earth values repetition
  const radarData = useMemo(() => {
    if (!planet) return [];
    const pRadius = planet.radius ?? 0;
    const pMass = planet.mass ?? 0;
    const pTempC = planet.teqK ? kToC(planet.teqK) : 0;
    const pOrbit = planet.orbitalPeriod ?? 0;
    const pG = computeGravityG(pMass, pRadius);

    // Fixed: Earth values should not repeat, use proper constants
    const fullData = [
      { 
        metric: "Gravity", 
        Earth: EARTH.gravityG, 
        Planet: pG ?? 0, 
        unit: "m/s²", 
        earthValue: EARTH.gravityG 
      },
      { 
        metric: "Radius",  
        Earth: EARTH.radiusRe, 
        Planet: pRadius, 
        unit: "R⊕", 
        earthValue: EARTH.radiusRe 
      },
      { 
        metric: "Mass",    
        Earth: EARTH.massMe,   
        Planet: pMass, 
        unit: "M⊕", 
        earthValue: EARTH.massMe 
      },
      { 
        metric: "Temp",    
        Earth: 15,             
        Planet: pTempC, 
        unit: "°C", 
        earthValue: 15 
      },
      { 
        metric: "Orbit",   
        Earth: EARTH.orbitDays, 
        Planet: pOrbit, 
        unit: "days", 
        earthValue: EARTH.orbitDays 
      },
      { 
        metric: "Star Type",   
        Earth: "G-type", 
        Planet: planet.starType || "Unknown", 
        unit: "", 
        earthValue: "G-type" 
      },
      { 
        metric: "Atmosphere",   
        Earth: "Nitrogen-Oxygen", 
        Planet: planet.atmosphere || "Unknown", 
        unit: "", 
        earthValue: "Nitrogen-Oxygen" 
      },
    ];

    return fullData.filter(d => selectedMetrics.includes(d.metric));
  }, [planet, selectedMetrics]);

  const barData = radarData;

  // Calculate habitability score
  const habitabilityScore = useMemo(() => {
    if (!planet) return 0;
    
    let score = 0;
    const factors = {
      temperature: planet.teqK ? Math.max(0, 100 - Math.abs(kToC(planet.teqK) - 15) * 2) : 0,
      radius: planet.radius ? Math.max(0, 100 - Math.abs(planet.radius - 1) * 30) : 0,
      gravity: computeGravityG(planet.mass, planet.radius) ? 
               Math.max(0, 100 - Math.abs(computeGravityG(planet.mass, planet.radius) - 9.8) * 5) : 0,
    };
    
    score = (factors.temperature + factors.radius + factors.gravity) / 3;
    return Math.round(score);
  }, [planet]);

  // Save comparison
  const handleSaveComparison = () => {
    if (planet) {
      const newSaved = [...savedComparisons, { ...planet, timestamp: new Date().toISOString() }];
      setSavedComparisons(newSaved);
      localStorage.setItem("savedComparisons", JSON.stringify(newSaved));
    }
  };

  // Export comparison data
  const exportComparisonData = () => {
    if (!planet) return;
    
    const comparisonData = {
      earth: EARTH,
      planet: planet,
      comparison: radarData,
      habitabilityScore,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(comparisonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earth-vs-${planet.name}-comparison.json`;
    a.click();
  };

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
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
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Planetary Comparison
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto backdrop-blur-sm bg-black/30 px-6 py-3 rounded-2xl border border-white/10">
            Compare exoplanets with Earth across multiple metrics and gain AI-driven insights
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar - Controls and History */}
          <div className="xl:col-span-1 space-y-6">
            {/* Planet Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <PlanetSelector
                names={names}
                selectedName={selectedName}
                setSelectedName={setSelectedName}
                loading={loading}
              />
            </motion.div>

            {/* Habitability Score */}
            {planet && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10"
              >
                <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <FaGlobe />
                  Habitability Score
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">{habitabilityScore}%</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-cyan-400 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${habitabilityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {habitabilityScore >= 80 ? "Highly Habitable" : 
                     habitabilityScore >= 60 ? "Moderately Habitable" : 
                     habitabilityScore >= 40 ? "Marginally Habitable" : 
                     "Low Habitability"}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Comparison History */}
            {comparisonHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10"
              >
                <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                  <FaExchangeAlt />
                  Recent Comparisons
                </h3>
                <div className="space-y-2">
                  {comparisonHistory.map((planet, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedName(planet.name)}
                      className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="font-medium text-white">{planet.name}</div>
                      <div className="text-sm text-gray-400">{planet.starType}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-8">
            {/* Tab Navigation and Action Buttons Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-between items-center gap-4"
            >
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "overview", label: "Overview", icon: <FaGlobe /> },
                  { id: "analytics", label: "Analytics", icon: <FaChartLine /> },
                  { id: "metrics", label: "Metrics", icon: <FaRuler /> },
                  { id: "narrative", label: "AI Analysis", icon: <FaRocket /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons - Moved to right side */}
              {planet && (
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    onClick={handleSaveComparison}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-600/30 transition-all"
                  >
                    <FaSave />
                    Save Comparison
                  </motion.button>
                  <motion.button
                    onClick={exportComparisonData}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition-all"
                  >
                    <FaDownload />
                    Export Data
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* Metric Toggles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <ParameterToggles
                allMetrics={allMetrics}
                selectedMetrics={selectedMetrics}
                setSelectedMetrics={setSelectedMetrics}
                funFacts={funFacts}
              />
            </motion.div>

            {/* Content based on active tab */}
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* FIXED: DataCards with equal height */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Earth Card - Fixed height */}
                    <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 flex flex-col h-full">
                      <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                        <FaGlobe className="text-blue-400" />
                        Earth Reference
                      </h3>
                      <div className="space-y-4 flex-grow">
                        {radarData.map((metric, index) => (
                          <div key={metric.metric} className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="font-medium text-gray-300">{metric.metric}</span>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-400">
                                {metric.Earth} {metric.unit}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Planet Card - Same height as Earth card */}
                    <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 flex flex-col h-full">
                      <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                        <FaRocket className="text-green-400" />
                        {planet?.name || "Select Planet"}
                      </h3>
                      <div className="space-y-4 flex-grow">
                        {radarData.map((metric, index) => (
                          <div key={metric.metric} className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="font-medium text-gray-300">{metric.metric}</span>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-400">
                                {metric.Planet} {metric.unit}
                              </div>
                              <div className={`text-xs ${
                                metric.Planet > metric.Earth ? 'text-green-400' : 
                                metric.Planet < metric.Earth ? 'text-red-400' : 'text-yellow-400'
                              }`}>
                                {metric.Planet > metric.Earth ? '↑ Higher' : 
                                 metric.Planet < metric.Earth ? '↓ Lower' : '═ Equal'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Charts 
                    radarData={radarData} 
                    barData={barData} 
                    planet={planet} 
                    highlightMetric={selectedMetrics}
                    habitabilityScore={habitabilityScore}
                  />
                </motion.div>
              )}

              {activeTab === "metrics" && (
                <motion.div
                  key="metrics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Enhanced metrics display with equal height cards */}
                  {radarData.map((metric, index) => (
                    <motion.div
                      key={metric.metric}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="backdrop-blur-xl bg-black/40 rounded-2xl p-4 border border-white/10 flex flex-col h-full"
                    >
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        {funFacts[metric.metric]?.icon}
                        {metric.metric}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 flex-grow">
                        <div className="text-center flex flex-col justify-center">
                          <div className="text-2xl font-bold text-blue-400">{metric.Earth}</div>
                          <div className="text-sm text-gray-400">Earth</div>
                          <div className="text-xs text-gray-500 mt-1">{metric.unit}</div>
                        </div>
                        <div className="text-center flex flex-col justify-center">
                          <div className="text-2xl font-bold text-green-400">{metric.Planet}</div>
                          <div className="text-sm text-gray-400">{planet?.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{metric.unit}</div>
                        </div>
                      </div>
                      <div className="mt-3 text-center pt-3 border-t border-white/10">
                        <div className={`text-sm font-medium ${
                          metric.Planet > metric.Earth ? 'text-green-400' : 
                          metric.Planet < metric.Earth ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {metric.Planet > metric.Earth ? '↑ Higher' : 
                           metric.Planet < metric.Earth ? '↓ Lower' : '═ Equal'} than Earth
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "narrative" && (
                <motion.div
                  key="narrative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AiNarrative 
                    planet={planet} 
                    aiNarrative={aiNarrative} 
                    narrativeLoading={narrativeLoading}
                    habitabilityScore={habitabilityScore}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
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