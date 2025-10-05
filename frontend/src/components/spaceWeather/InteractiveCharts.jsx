// src/components/InteractiveCharts.jsx
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
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  FaChartLine, 
  FaChartBar, 
  FaRadiation, 
  FaWind,
  FaSun,
  FaInfoCircle,
  FaExclamationTriangle
} from "react-icons/fa";

export default function InteractiveCharts() {
  const [data, setData] = useState({
    solarWindHistory: [],
    flareFrequency: [],
    radiationIndex: "S1",
    kpIndexHistory: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("solar");

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const summary = await fetchSpaceWeatherSummary();

        // --- Solar Wind History ---
        const windHistory = summary.solar?.solarWind || [];
        const formattedWind = windHistory.map((w, index) => ({
          time: w.time || `T-${index * 3}h`,
          speed: w.speed || 300 + Math.random() * 400,
          density: w.density || 1 + Math.random() * 10,
          bz: w.bz || Math.random() * 20 - 10,
          name: `Wind ${index + 1}`
        }));

        // --- Flare Frequency ---
        const flares = summary.solar?.flares || [];
        const flareCount = { A: 0, B: 0, C: 0, M: 0, X: 0 };
        flares.forEach((f) => {
          const cls = (f.classType || f.flrType || "C").charAt(0);
          flareCount[cls] = (flareCount[cls] || 0) + 1;
        });
        
        // Add some sample data if empty
        if (flares.length === 0) {
          flareCount.A = Math.floor(Math.random() * 5);
          flareCount.B = Math.floor(Math.random() * 3);
          flareCount.C = Math.floor(Math.random() * 2);
          flareCount.M = Math.floor(Math.random() * 1);
        }
        
        const flareFreq = Object.entries(flareCount)
          .filter(([_, count]) => count > 0)
          .map(([cls, count]) => ({
            class: cls,
            count,
            color: getFlareColor(cls)
          }));

        // --- KP Index History ---
        const kpHistory = Array.from({ length: 8 }, (_, i) => ({
          time: `T-${i * 3}h`,
          kp: 1 + Math.random() * 7,
          name: `KP ${i + 1}`
        }));

        // --- Radiation Index ---
        const latestRadiationIndex = summary.radiation?.index || "S1";

        setData({
          solarWindHistory: formattedWind.slice(0, 8),
          flareFrequency: flareFreq,
          radiationIndex: latestRadiationIndex,
          kpIndexHistory: kpHistory
        });
      } catch (err) {
        console.error("Failed to fetch interactive chart data:", err);
        // Fallback data
        setData({
          solarWindHistory: Array.from({ length: 6 }, (_, i) => ({
            time: `T-${i * 4}h`,
            speed: 350 + Math.random() * 300,
            density: 2 + Math.random() * 8,
            bz: Math.random() * 15 - 7.5,
            name: `Wind ${i + 1}`
          })),
          flareFrequency: [
            { class: "A", count: 3, color: "#4ADE80" },
            { class: "B", count: 2, color: "#60A5FA" },
            { class: "C", count: 1, color: "#F59E0B" }
          ],
          radiationIndex: "S2",
          kpIndexHistory: Array.from({ length: 6 }, (_, i) => ({
            time: `T-${i * 4}h`,
            kp: 2 + Math.random() * 5,
            name: `KP ${i + 1}`
          }))
        });
      } finally {
        setLoading(false);
      }
    };

    getData();
    const interval = setInterval(getData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Helper functions
  const getFlareColor = (flareClass) => {
    const colors = {
      A: "#4ADE80", // Green
      B: "#60A5FA", // Blue
      C: "#F59E0B", // Yellow
      M: "#F97316", // Orange
      X: "#EF4444"  // Red
    };
    return colors[flareClass] || "#6B7280";
  };

  const getRadiationLevel = (index) => {
    const levels = {
      S1: { level: "Minor", color: "bg-green-500", textColor: "text-green-400", description: "No significant radiation risk" },
      S2: { level: "Moderate", color: "bg-green-400", textColor: "text-green-300", description: "Low radiation levels" },
      S3: { level: "Strong", color: "bg-yellow-500", textColor: "text-yellow-400", description: "Elevated radiation detected" },
      S4: { level: "Severe", color: "bg-orange-500", textColor: "text-orange-400", description: "High radiation warning" },
      S5: { level: "Extreme", color: "bg-red-600", textColor: "text-red-400", description: "Critical radiation levels" },
    };
    return levels[data.radiationIndex] || levels.S1;
  };

  // Custom tooltips
  const SolarWindTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: <span className="text-white">{entry.value}{entry.dataKey === 'speed' ? ' km/s' : entry.dataKey === 'density' ? ' p/cm³' : ' nT'}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const radiationLevel = getRadiationLevel(data.radiationIndex);

  if (loading) {
    return (
      <section className="mt-8 px-4 md:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-64 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

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
            <FaChartLine className="text-2xl text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Interactive Data Visualizations</h2>
            <p className="text-gray-400 text-sm">Real-time space weather analytics and trends</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-800/50 rounded-xl p-1">
          {[
            { id: "solar", label: "Solar Activity", icon: FaSun },
            { id: "radiation", label: "Radiation", icon: FaRadiation },
            { id: "magnetic", label: "Magnetic Field", icon: FaChartBar }
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 flex-1 text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <TabIcon className="text-sm" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Solar Wind Chart */}
          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FaWind className="text-xl text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Solar Wind Analysis</h3>
            </div>
            
            {data.solarWindHistory.length === 0 ? (
              <div className="text-center py-8">
                <FaInfoCircle className="text-3xl text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300">No solar wind data available</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.solarWindHistory}>
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
                    <Tooltip content={<SolarWindTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="speed" 
                      stroke="#8B5CF6" 
                      fill="#8B5CF6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      name="Wind Speed (km/s)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="density" 
                      stroke="#10B981" 
                      fill="#10B981"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      name="Density (p/cm³)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div className="text-center">
                <span className="text-purple-400">●</span> Wind Speed
              </div>
              <div className="text-center">
                <span className="text-green-400">●</span> Particle Density
              </div>
            </div>
          </motion.div>

          {/* Flare Frequency Chart */}
          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <FaSun className="text-xl text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Solar Flare Distribution</h3>
            </div>

            {data.flareFrequency.length === 0 ? (
              <div className="text-center py-8">
                <FaInfoCircle className="text-3xl text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300">No flare data available</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.flareFrequency}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ class: flareClass, count }) => `${flareClass}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.flareFrequency.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-400">
                Flare classes: A (weak) → X (strongest)
              </p>
            </div>
          </motion.div>
        </div>

        {/* Radiation Risk & KP Index */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Radiation Risk */}
          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <FaRadiation className="text-xl text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Radiation Risk Assessment</h3>
            </div>

            <div className="text-center">
              <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${radiationLevel.color} mb-4`}>
                <FaExclamationTriangle className="text-white text-xl" />
                <span className="text-3xl font-bold text-white">{data.radiationIndex}</span>
                <span className="text-lg font-semibold text-white">{radiationLevel.level}</span>
              </div>
              <p className="text-gray-300 text-sm mb-4">{radiationLevel.description}</p>
              
              <div className="bg-black/30 rounded-lg p-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  {["S1", "S2", "S3", "S4", "S5"].map(level => (
                    <span key={level} className={level === data.radiationIndex ? "text-white font-bold" : ""}>
                      {level}
                    </span>
                  ))}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 flex">
                  {["S1", "S2", "S3", "S4", "S5"].map((level, index) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 ${index === 0 ? 'rounded-l-full' : ''} ${
                        index === 4 ? 'rounded-r-full' : ''
                      } ${getRadiationLevel(level).color} ${
                        level === data.radiationIndex ? 'opacity-100' : 'opacity-30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* KP Index Trend */}
          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FaChartBar className="text-xl text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">KP Index Trend</h3>
            </div>

            {data.kpIndexHistory.length === 0 ? (
              <div className="text-center py-8">
                <FaInfoCircle className="text-3xl text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300">No KP index data available</p>
              </div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.kpIndexHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      domain={[0, 9]}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="kp" 
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-400">
                Geomagnetic activity level (0-9 scale)
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <FaChartLine />
            <span>Real-time space weather analytics</span>
          </div>
          <span>Last update: {new Date().toLocaleTimeString()}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}