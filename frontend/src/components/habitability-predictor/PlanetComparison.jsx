import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Scatter,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  FaGlobeAmericas, 
  FaChartLine, 
  FaChartBar, 
  FaChartPie,
  FaTable,
  FaRocket,
  FaBalanceScale,
  FaSearch,
  FaSatellite,
  FaTemperatureHigh,
  FaRuler,
  FaWeightHanging,
  FaStar
} from "react-icons/fa";

export default function PlanetComparison({ planets }) {
  const [selectedPlanets, setSelectedPlanets] = useState([]);
  const [planetPredictions, setPlanetPredictions] = useState({});
  const [activeTab, setActiveTab] = useState("radar");
  const [loading, setLoading] = useState(false);

  // 🌍 Dropdown options
  const options = planets.map((p) => ({
    value: p.name,
    label: p.name,
  }));

  // 🌟 Handle planet selection
  const handleSelectChange = async (selected) => {
    if (selected.length > 4) {
      alert("⚠️ You can compare up to 4 planets only.");
      return;
    }

    const chosen = selected.map((s) => planets.find((p) => p.name === s.value));
    setSelectedPlanets(chosen);

    // Load prediction
    setLoading(true);
    const predictions = {};
    for (let planet of chosen) {
      try {
        const res = await axios.post(
          "http://localhost:4000/api/habitability/predict",
          { name: planet.name }
        );
        predictions[planet.name] = res.data.habitability_score;
      } catch (err) {
        console.error(`Error predicting ${planet.name}:`, err.message);
        predictions[planet.name] = 0;
      }
    }
    setPlanetPredictions(predictions);
    setLoading(false);
  };

  // 🌈 Planet Colors
  const colors = ["#60a5fa", "#f472b6", "#34d399", "#facc15"];
  const colorNames = ["blue", "pink", "green", "yellow"];

  // 📊 Radar Data
  const radarData = [
    {
      metric: "Mass",
      ...Object.fromEntries(selectedPlanets.map((p) => [p.name, p.mass_earth])),
    },
    {
      metric: "Radius",
      ...Object.fromEntries(selectedPlanets.map((p) => [p.name, p.radius_earth])),
    },
    {
      metric: "Temperature",
      ...Object.fromEntries(selectedPlanets.map((p) => [p.name, p.temp_k])),
    },
    {
      metric: "Distance",
      ...Object.fromEntries(selectedPlanets.map((p) => [p.name, p.distance_ly])),
    },
    {
      metric: "Star Mass",
      ...Object.fromEntries(selectedPlanets.map((p) => [p.name, p.star_mass_solar])),
    },
    {
      metric: "Habitability",
      ...Object.fromEntries(selectedPlanets.map((p) => [p.name, planetPredictions[p.name] || 0])),
    },
  ];

  // 📈 Bar & Scatter Data
  const barData = selectedPlanets.map((p, i) => ({
    name: p.name,
    score: planetPredictions[p.name] || 0,
    color: colors[i],
    radius: p.radius_earth || 0,
    temperature: p.temp_k || 0
  }));

  const scatterData = selectedPlanets.map((p, i) => ({
    name: p.name,
    temp: p.temp_k,
    score: planetPredictions[p.name] || 0,
    radius: p.radius_earth || 1,
    color: colors[i]
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl min-w-48">
          <p className="text-white font-semibold border-b border-white/20 pb-2 mb-2">
            {label || payload[0]?.payload?.name}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-cyan-400 text-sm">
              {entry.name}: {entry.value}
              {entry.dataKey === 'score' || entry.dataKey === 'habitability' ? '%' : 
               entry.dataKey === 'radius' ? ' R⊕' :
               entry.dataKey === 'mass' ? ' M⊕' :
               entry.dataKey === 'distance' ? ' ly' :
               entry.dataKey === 'temperature' ? 'K' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const tabs = [
    { id: "radar", label: "Radar Analysis", icon: <FaChartPie /> },
    { id: "bar", label: "Score Comparison", icon: <FaChartBar /> },
    { id: "scatter", label: "Temperature Analysis", icon: <FaTemperatureHigh /> },
    { id: "table", label: "Detailed Table", icon: <FaTable /> },
    { id: "metrics", label: "Key Metrics", icon: <FaChartLine /> }
  ];

  return (
    <motion.div 
      className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <FaBalanceScale className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Multi-Planetary Comparison</h3>
            <p className="text-gray-300">Compare up to 4 planets across multiple dimensions</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Planet Selection */}
        <motion.div 
          className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <FaSearch className="text-cyan-400 text-xl" />
            <h4 className="text-xl font-bold text-white">Select Planets for Comparison</h4>
          </div>
          <Select
            isMulti
            name="planets"
            options={options}
            className="react-select-container"
            classNamePrefix="select"
            onChange={handleSelectChange}
            placeholder="Search and select up to 4 planets..."
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                color: "white",
                minHeight: '50px'
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#111827",
                color: "white",
              }),
              option: (styles, { isFocused }) => ({
                ...styles,
                backgroundColor: isFocused ? "#2563eb" : "#111827",
                color: "white",
              }),
              multiValue: (styles) => ({
                ...styles,
                backgroundColor: "#374151",
              }),
              multiValueLabel: (styles) => ({
                ...styles,
                color: "white",
              }),
              multiValueRemove: (styles) => ({
                ...styles,
                color: "white",
                ':hover': {
                  backgroundColor: '#ef4444',
                  color: 'white',
                },
              }),
            }}
          />
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
            <FaRocket className="text-blue-400" />
            <span>Select 2-4 planets for optimal comparison</span>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        {selectedPlanets.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-300 text-lg">Analyzing planetary data...</span>
            </div>
          </motion.div>
        )}

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {!loading && selectedPlanets.length > 0 && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
            >
              {/* Radar Chart */}
              {activeTab === "radar" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FaChartPie className="text-purple-400 text-xl" />
                    <h4 className="text-xl font-bold text-white">Multi-Dimensional Analysis</h4>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
                      <PolarRadiusAxis stroke="#6b7280" />
                      {selectedPlanets.map((planet, i) => (
                        <Radar
                          key={planet.name}
                          name={planet.name}
                          dataKey={planet.name}
                          stroke={colors[i]}
                          fill={colors[i]}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      ))}
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Bar Chart */}
              {activeTab === "bar" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FaChartBar className="text-green-400 text-xl" />
                    <h4 className="text-xl font-bold text-white">Habitability Score Comparison</h4>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" unit="%" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="score" 
                        radius={[6, 6, 0, 0]}
                      >
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Scatter Chart */}
              {activeTab === "scatter" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FaTemperatureHigh className="text-orange-400 text-xl" />
                    <h4 className="text-xl font-bold text-white">Temperature vs Habitability</h4>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        type="number" 
                        dataKey="temp" 
                        name="Temperature" 
                        unit="K"
                        stroke="#9ca3af" 
                      />
                      <YAxis 
                        type="number" 
                        dataKey="score" 
                        name="Habitability" 
                        unit="%"
                        stroke="#9ca3af" 
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      {scatterData.map((planet, i) => (
                        <Scatter
                          key={planet.name}
                          name={planet.name}
                          data={[planet]}
                          fill={colors[i]}
                          stroke={colors[i]}
                          strokeWidth={2}
                        />
                      ))}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Detailed Table */}
              {activeTab === "table" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FaTable className="text-blue-400 text-xl" />
                    <h4 className="text-xl font-bold text-white">Detailed Comparison Table</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-4 text-gray-300 font-semibold">Metric</th>
                          {selectedPlanets.map((planet, i) => (
                            <th key={planet.name} className="text-center p-4 font-semibold" style={{ color: colors[i] }}>
                              {planet.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { key: "Mass", value: "mass_earth", unit: "M⊕", icon: <FaWeightHanging /> },
                          { key: "Radius", value: "radius_earth", unit: "R⊕", icon: <FaRuler /> },
                          { key: "Temperature", value: "temp_k", unit: "K", icon: <FaTemperatureHigh /> },
                          { key: "Distance", value: "distance_ly", unit: "ly", icon: <FaSatellite /> },
                          { key: "Star Mass", value: "star_mass_solar", unit: "M☉", icon: <FaStar /> },
                        ].map((row) => (
                          <tr key={row.key} className="border-b border-white/5 hover:bg-white/5">
                            <td className="p-4 text-gray-300 font-medium flex items-center gap-2">
                              {row.icon}
                              {row.key}
                            </td>
                            {selectedPlanets.map((planet, i) => (
                              <td key={planet.name} className="p-4 text-center text-white">
                                {planet[row.value] ? `${planet[row.value]} ${row.unit}` : "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                        <tr className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 font-semibold">
                          <td className="p-4 text-green-400 font-medium flex items-center gap-2">
                            <FaChartLine />
                            Habitability Score
                          </td>
                          {selectedPlanets.map((planet, i) => (
                            <td key={planet.name} className="p-4 text-center text-green-400 font-bold">
                              {planetPredictions[planet.name] ? `${planetPredictions[planet.name]}%` : "—"}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Key Metrics */}
              {activeTab === "metrics" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FaChartLine className="text-cyan-400 text-xl" />
                    <h4 className="text-xl font-bold text-white">Key Performance Metrics</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedPlanets.map((planet, i) => (
                      <motion.div
                        key={planet.name}
                        className="bg-white/5 rounded-2xl p-6 border border-white/10"
                        whileHover={{ y: -5, scale: 1.02 }}
                        style={{ borderLeft: `4px solid ${colors[i]}` }}
                      >
                        <div className="text-lg font-bold text-white mb-2" style={{ color: colors[i] }}>
                          {planet.name}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Habitability</span>
                            <span className="text-green-400 font-semibold">
                              {planetPredictions[planet.name] || 0}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Temperature</span>
                            <span className="text-orange-400">{planet.temp_k || 0}K</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Radius</span>
                            <span className="text-blue-400">{planet.radius_earth || 0}R⊕</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Distance</span>
                            <span className="text-purple-400">{planet.distance_ly || 0}ly</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && selectedPlanets.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🌌</div>
            <h3 className="text-2xl text-gray-300 mb-2">No Planets Selected</h3>
            <p className="text-gray-400">Choose planets from the dropdown to start comparison</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}