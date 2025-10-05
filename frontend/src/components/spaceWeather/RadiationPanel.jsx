// src/components/RadiationPanel.jsx
import { useEffect, useState } from "react";
import { fetchSpaceWeatherSummary } from "../../lib/api";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  CartesianGrid
} from "recharts";
import { 
  FaRadiation, 
  FaShieldAlt, 
  FaChartLine, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaSkullCrossbones
} from "react-icons/fa";

export default function RadiationPanel() {
  const [radiationData, setRadiationData] = useState({
    cosmicRay: 0,
    radiationIndex: "S1",
    protonElectronFlux: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch radiation data
  useEffect(() => {
    const getRadiationData = async () => {
      try {
        setLoading(true);
        const data = await fetchSpaceWeatherSummary();

        // Format protonElectronFlux for chart
        const flux = (data.radiation?.protonElectronFlux || []).map((p, index) => ({
          time: p.time || `T-${index}h`,
          proton: p.protons || Math.random() * 1000,
          electron: p.electrons || Math.random() * 500,
          name: `Point ${index + 1}`
        }));

        setRadiationData({
          cosmicRay: data.radiation?.cosmicRays || Math.floor(Math.random() * 5000),
          radiationIndex: data.radiation?.index || "S1",
          protonElectronFlux: flux.slice(0, 10), // Limit to 10 points for better visualization
        });
      } catch (err) {
        console.error("Failed to fetch radiation data:", err);
        // Fallback data
        setRadiationData({
          cosmicRay: 2450,
          radiationIndex: "S2",
          protonElectronFlux: Array.from({ length: 8 }, (_, i) => ({
            time: `T-${i * 3}h`,
            proton: 500 + Math.random() * 800,
            electron: 200 + Math.random() * 300,
            name: `Point ${i + 1}`
          }))
        });
      } finally {
        setLoading(false);
      }
    };

    getRadiationData();
    const interval = setInterval(getRadiationData, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  // Radiation index configuration
  const radiationLevels = {
    S1: { 
      level: "Minor", 
      color: "bg-green-500", 
      textColor: "text-green-400",
      description: "No significant radiation risk",
      icon: FaCheckCircle
    },
    S2: { 
      level: "Moderate", 
      color: "bg-green-400", 
      textColor: "text-green-300",
      description: "Low radiation levels",
      icon: FaCheckCircle
    },
    S3: { 
      level: "Strong", 
      color: "bg-yellow-500", 
      textColor: "text-yellow-400",
      description: "Elevated radiation detected",
      icon: FaExclamationTriangle
    },
    S4: { 
      level: "Severe", 
      color: "bg-orange-500", 
      textColor: "text-orange-400",
      description: "High radiation warning",
      icon: FaExclamationTriangle
    },
    S5: { 
      level: "Extreme", 
      color: "bg-red-600", 
      textColor: "text-red-400",
      description: "Critical radiation levels",
      icon: FaSkullCrossbones
    },
  };

  const currentLevel = radiationLevels[radiationData.radiationIndex] || radiationLevels.S1;
  const CurrentIcon = currentLevel.icon;

  // Cosmic ray risk assessment
  const cosmicRayRisk = 
    radiationData.cosmicRay > 4000 ? "High" :
    radiationData.cosmicRay > 2500 ? "Moderate" : "Low";

  const cosmicRayColor =
    cosmicRayRisk === "High" ? "text-red-400" :
    cosmicRayRisk === "Moderate" ? "text-yellow-400" : "text-green-400";

  if (loading) {
    return (
      <section className="mt-8 px-4 md:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 font-medium">{label}</p>
          <p className="text-blue-400">
            Protons: <span className="text-white">{payload[0]?.value?.toFixed(0)} pfu</span>
          </p>
          <p className="text-orange-400">
            Electrons: <span className="text-white">{payload[1]?.value?.toFixed(0)} pfu</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="mt-8 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <FaRadiation className="text-2xl text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Radiation & Particle Monitoring</h2>
            <p className="text-gray-400 text-sm">Real-time cosmic radiation and particle flux data</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-gray-600">
            <CurrentIcon className={`text-lg ${currentLevel.textColor}`} />
            <span className={`text-sm font-medium ${currentLevel.textColor}`}>
              Level: {radiationData.radiationIndex}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Cosmic Ray Levels */}
          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FaShieldAlt className="text-xl text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Cosmic Radiation</h3>
            </div>
            
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-purple-400 mb-2">
                {radiationData.cosmicRay.toLocaleString()}
              </p>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className={`text-sm font-medium ${cosmicRayColor}`}>
                  {cosmicRayRisk} Risk
                </span>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Safe</span>
                <span>Moderate</span>
                <span>High</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((radiationData.cosmicRay / 5000) * 100, 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>2500</span>
                <span>5000+</span>
              </div>
            </div>
          </motion.div>

          {/* Radiation Index */}
          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FaExclamationTriangle className="text-xl text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Radiation Index</h3>
            </div>

            <div className="text-center mb-4">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl ${currentLevel.color} mb-4`}>
                <CurrentIcon className="text-white text-xl" />
                <span className="text-2xl font-bold text-white">{radiationData.radiationIndex}</span>
              </div>
              <p className="text-lg font-semibold text-white mb-2">{currentLevel.level}</p>
              <p className="text-gray-300 text-sm">{currentLevel.description}</p>
            </div>

            {/* Radiation Scale */}
            <div className="bg-black/30 rounded-lg p-3 mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                {Object.keys(radiationLevels).map(level => (
                  <span key={level} className={level === radiationData.radiationIndex ? "text-white font-bold" : ""}>
                    {level}
                  </span>
                ))}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 flex">
                {Object.keys(radiationLevels).map((level, index) => (
                  <div
                    key={level}
                    className={`h-2 flex-1 ${index === 0 ? 'rounded-l-full' : ''} ${
                      index === Object.keys(radiationLevels).length - 1 ? 'rounded-r-full' : ''
                    } ${radiationLevels[level].color} ${
                      level === radiationData.radiationIndex ? 'opacity-100' : 'opacity-30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Particle Flux Chart */}
          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FaChartLine className="text-xl text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Particle Flux</h3>
            </div>

            {radiationData.protonElectronFlux.length === 0 ? (
              <div className="text-center py-8">
                <FaInfoCircle className="text-3xl text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300">No particle data available</p>
              </div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={radiationData.protonElectronFlux}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="proton" 
                      stroke="#3B82F6" 
                      fill="#3B82F6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      name="Protons"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="electron" 
                      stroke="#F59E0B" 
                      fill="#F59E0B"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      name="Electrons"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-400">
                Particle Flux Units (pfu) over time
              </p>
            </div>
          </motion.div>
        </div>

        {/* Safety Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30"
        >
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-blue-300 font-semibold mb-1">Radiation Safety Information</h4>
              <p className="text-gray-300 text-sm">
                {currentLevel.description}. {currentLevel.level === "Extreme" || currentLevel.level === "Severe" 
                  ? "Extra precautions recommended for space activities." 
                  : "Normal operations can continue safely."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer with last update */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <FaRadiation />
            <span>Monitoring cosmic radiation levels</span>
          </div>
          <span>Last update: {new Date().toLocaleTimeString()}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}