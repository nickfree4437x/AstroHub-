// src/pages/AtmosphereVisualizer.jsx
import React, { useEffect, useState } from "react";
import { fetchPlanetDetail } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { 
  FaGlobeAmericas, 
  FaExchangeAlt, 
  FaChartBar, 
  FaInfoCircle,
  FaRocket,
  FaThermometerHalf,
  FaTachometerAlt,
  FaLayerGroup,
  FaTimes,
  FaGlobe 
} from "react-icons/fa";
import GasPieChart from "../components/atmosphere/GasPieChart";
import Atmosphere3DSlider from "../components/atmosphere/Atmosphere3DSlider";
import PlanetFactsModal from "../components/atmosphere/PlanetFactsModal";
import ComparativeCharts from "../components/atmosphere/ComparativeCharts";
import AtmosphereScenarioToggle from "../components/atmosphere/AtmosphereScenarioToggle";
import ExportButtons from "../components/atmosphere/ExportButtons";
import STATIC_ATMOS from "../data/staticAtmospheres";

// Planet Atmosphere Card Component
function PlanetAtmosphereCard({ planet, atm, unitSettings, onMoreFacts, onFullDetails, scenario, isComparison = false }) {
  const { pressureUnit, tempUnit } = unitSettings;

  const formatPressure = (p, atmUnit) => {
    if (p == null) return "—";
    if (pressureUnit === "Pa") return `${atmUnit === "bar" ? p * 1e5 : p} Pa`;
    if (pressureUnit === "bar") return `${atmUnit === "Pa" ? p / 1e5 : p} bar`;
    return p;
  };

  const formatTemp = (tempStr) => {
    if (!tempStr || tempUnit === "°C") return tempStr || "—";
    return tempStr.replace(/(-?\d+)(°C)/g, (_, n) => `${Number(n) + 273.15}K`);
  };

  const displayAtm = atm ? { ...atm, planet } : null;
  if (scenario === "historical" && displayAtm) {
    displayAtm.surfacePressure = displayAtm.surfacePressure * 0.9;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-2xl ${
        isComparison ? 'hover:border-blue-500/50' : 'hover:border-purple-500/50'
      } transition-all duration-300`}
    >
      {/* Planet Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${
          isComparison ? 'bg-blue-500/20' : 'bg-purple-500/20'
        }`}>
          <FaGlobeAmericas className={`text-2xl ${
            isComparison ? 'text-blue-400' : 'text-purple-400'
          }`} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{planet}</h2>
          <p className="text-gray-400 text-sm">Atmospheric Composition Analysis</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Gas Composition */}
        <div>
          {displayAtm?.composition ? (
              <GasPieChart data={displayAtm.composition} />
          ) : (
            <div className="text-gray-400 text-center py-8 bg-black/20 rounded-xl">
              No composition data available
            </div>
          )}
        </div>

        {/* 3D Atmosphere Visualization */}
        {displayAtm?.layers && (
            <Atmosphere3DSlider layers={displayAtm.layers} planetName={planet} />
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/30 rounded-lg p-3 text-center border border-gray-600/30">
            <FaTachometerAlt className="text-orange-400 text-lg mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Pressure</p>
            <p className="text-white font-bold text-lg">
              {formatPressure(displayAtm?.surfacePressure, displayAtm?.pressureUnit)}
            </p>
          </div>
          <div className="bg-black/30 rounded-lg p-3 text-center border border-gray-600/30">
            <FaThermometerHalf className="text-red-400 text-lg mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Scale Height</p>
            <p className="text-white font-bold text-lg">
              {displayAtm?.scaleHeight ?? "—"} km
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-700/50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMoreFacts(displayAtm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white font-medium flex-1 justify-center transition-colors"
          >
            <FaInfoCircle />
            Quick Facts
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFullDetails(displayAtm)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-medium flex-1 justify-center transition-colors"
          >
            <FaRocket />
            Full Analysis
          </motion.button>
        </div>

        {/* Export Options */}
        {displayAtm?.layers && (
          <div className="flex gap-2">
            <ExportButtons targetId={`atmosphere-3d-${planet}`} layerData={displayAtm.layers} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Planets List
const PLANETS = [
  "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"
];

// Main Component
export default function AtmosphereVisualizer() {
  const [comparisonMode, setComparisonMode] = useState(false);
  const [planetA, setPlanetA] = useState("Earth");
  const [planetB, setPlanetB] = useState("Mars");
  const [atmA, setAtmA] = useState(null);
  const [atmB, setAtmB] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [fullDetailsData, setFullDetailsData] = useState(null);
  const [unitSettings, setUnitSettings] = useState({ pressureUnit: "Pa", tempUnit: "°C" });
  const [scenario, setScenario] = useState("current");
  const [loading, setLoading] = useState(true);

  // Fetch atmosphere data
  const loadAtmosphere = async (planet, setter) => {
    try {
      const res = await fetchPlanetDetail(planet);
      if (res?.atmosphere) setter(res.atmosphere);
      else setter(STATIC_ATMOS[planet]);
    } catch {
      setter(STATIC_ATMOS[planet]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadAtmosphere(planetA, setAtmA);
      if (comparisonMode) {
        await loadAtmosphere(planetB, setAtmB);
      }
      setLoading(false);
    };
    loadData();
  }, [planetA, planetB, comparisonMode]);

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

      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
            🌫️ Atmosphere Visualizer
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto backdrop-blur-sm bg-black/30 px-6 py-4 rounded-2xl border border-white/10">
            Explore and compare planetary atmospheres with interactive 3D visualizations and detailed composition analysis
          </p>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 mb-8 shadow-2xl max-w-6xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Comparison Toggle */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setComparisonMode(!comparisonMode)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  comparisonMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
                }`}
              >
                <FaExchangeAlt />
                {comparisonMode ? "Single View" : "Compare Planets"}
              </motion.button>
            </div>

            {/* Unit Settings */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg border border-gray-600/30">
                <FaTachometerAlt className="text-orange-400" />
                <select
                value={unitSettings.pressureUnit}
                onChange={e => setUnitSettings(prev => ({ ...prev, pressureUnit: e.target.value }))}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-700 cursor-pointer"
              >
                <option value="Pa" className="bg-gray-800 text-white">Pascal (Pa)</option>
                <option value="bar" className="bg-gray-800 text-white">Bar</option>
              </select>
              </div>
              <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg border border-gray-600/30">
                <FaThermometerHalf className="text-red-400" />
                <select
                value={unitSettings.tempUnit}
                onChange={e => setUnitSettings(prev => ({ ...prev, tempUnit: e.target.value }))}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-700 cursor-pointer"
              >
                <option value="°C" className="bg-gray-800 text-white">Celsius (°C)</option>
                <option value="K" className="bg-gray-800 text-white">Kelvin (K)</option>
              </select>
              </div>
            </div>
          </div>

          {/* Scenario Toggle */}
          <div className="mt-4">
            <AtmosphereScenarioToggle scenario={scenario} setScenario={setScenario} />
          </div>
        </motion.div>

        {/* Planet Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8 max-w-6xl mx-auto"
        >
          {comparisonMode ? (
            <>
              <div className="flex-1">
                <label className="block text-gray-300 text-sm mb-2">First Planet</label>
                <select 
                  value={planetA} 
                  onChange={e => setPlanetA(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {PLANETS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-gray-300 text-sm mb-2">Second Planet</label>
                <select 
                  value={planetB} 
                  onChange={e => setPlanetB(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {PLANETS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </>
          ) : (
            <div className="w-full md:w-64">
              <label className="block text-gray-300 text-sm mb-2">Select Planet</label>
              <select 
                value={planetA} 
                onChange={e => setPlanetA(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                {PLANETS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Loading atmospheric data...</p>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            {comparisonMode ? (
              <>
                {/* Comparative Charts */}
                <ComparativeCharts atmA={atmA} atmB={atmB} planetA={planetA} planetB={planetB} />
                
                {/* Planet Cards */}
                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                  <PlanetAtmosphereCard
                    planet={planetA}
                    atm={atmA}
                    unitSettings={unitSettings}
                    onMoreFacts={setModalData}
                    onFullDetails={setFullDetailsData}
                    scenario={scenario}
                    isComparison={true}
                  />
                  <PlanetAtmosphereCard
                    planet={planetB}
                    atm={atmB}
                    unitSettings={unitSettings}
                    onMoreFacts={setModalData}
                    onFullDetails={setFullDetailsData}
                    scenario={scenario}
                    isComparison={true}
                  />
                </div>
              </>
            ) : (
              <div className="max-w-4xl mx-auto">
                <PlanetAtmosphereCard
                  planet={planetA}
                  atm={atmA}
                  unitSettings={unitSettings}
                  onMoreFacts={setModalData}
                  onFullDetails={setFullDetailsData}
                  scenario={scenario}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Modals */}
<AnimatePresence>
  {modalData && <PlanetFactsModal data={modalData} onClose={() => setModalData(null)} />}
  
  {fullDetailsData && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-purple-500/30 w-full max-w-6xl max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-purple-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl mt-16 font-bold text-white mb-2 flex items-center gap-3">
                <FaGlobe className="text-cyan-400" />
                Detailed Analysis: {fullDetailsData.planet}
              </h2>
              <p className="text-gray-300">
                Comprehensive planetary data and atmospheric insights
              </p>
            </div>
            <button
              onClick={() => setFullDetailsData(null)}
              className="p-3 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              <FaTimes className="text-gray-400 hover:text-white text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Basic Planet Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(fullDetailsData).map(([key, value]) => {
                if (key === 'planet' || typeof value === 'object') return null;
                
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
                  >
                    <div className="text-cyan-400 font-semibold text-sm mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-white font-medium text-lg">
                      {value || 'N/A'}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Atmospheric Data */}
            {fullDetailsData.atmosphere && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FaWind className="text-green-400" />
                  Atmospheric Composition
                </h3>
                
                {/* Composition Grid */}
                {fullDetailsData.atmosphere.composition && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Gas Composition</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Object.entries(fullDetailsData.atmosphere.composition).map(([gas, percentage]) => (
                        <motion.div
                          key={gas}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white/5 rounded-lg p-4 text-center border border-white/10 hover:border-green-500/30 transition-all duration-300"
                        >
                          <div className="text-white font-semibold text-sm mb-1">{gas}</div>
                          <div className="text-green-400 font-bold text-xl">{percentage}%</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Atmospheric Properties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(fullDetailsData.atmosphere).map(([key, value]) => {
                    if (key === 'composition' || typeof value === 'object') return null;
                    
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <div className="text-gray-300 text-sm mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-white font-semibold text-lg">
                          {value || 'N/A'}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Orbital Data */}
            {fullDetailsData.orbital && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FaChartLine className="text-yellow-400" />
                  Orbital Characteristics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(fullDetailsData.orbital).map(([key, value]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-yellow-500/30 transition-all duration-300"
                    >
                      <div className="text-yellow-400 font-semibold text-sm mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-white font-medium">
                        {value || 'N/A'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Physical Properties */}
            {fullDetailsData.physical && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FaRuler className="text-purple-400" />
                  Physical Properties
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(fullDetailsData.physical).map(([key, value]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                    >
                      <div className="text-purple-400 font-semibold text-sm mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-white font-medium">
                        {value || 'N/A'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Complex Objects Visualization */}
            {Object.entries(fullDetailsData).map(([key, value]) => {
              if (typeof value === 'object' && value !== null && 
                  !['atmosphere', 'orbital', 'physical'].includes(key)) {
                return (
                  <div key={key} className="space-y-4">
                    <h3 className="text-xl font-semibold text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <pre className="text-sm text-gray-300 overflow-auto">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    </div>
                  </div>
                );
              }
              return null;
            })}

            {/* Raw JSON Fallback for very complex data */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10">
              <details>
                <summary className="text-white font-semibold cursor-pointer hover:text-cyan-400 transition-colors">
                  View Raw Data
                </summary>
                <pre className="text-sm text-gray-300 mt-4 overflow-auto max-h-60 bg-black/30 p-4 rounded-lg">
                  {JSON.stringify(fullDetailsData, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
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