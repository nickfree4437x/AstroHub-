// src/components/explorer/PlanetModal.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import {
  FaTimes,
  FaGlobe,
  FaRuler,
  FaWeightHanging,
  FaStar,
  FaCalendarAlt,
  FaRocket,
  FaTemperatureHigh,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaDownload,
  FaShare,
  FaBalanceScale,
  FaCompressArrowsAlt,
  FaCircle,
  FaDatabase,
  FaLightbulb,
  FaExchangeAlt,
  FaGamepad,
  FaExternalLinkAlt,
  FaSatellite,
  FaRoute,
  FaSun,
  FaTint,
  FaWind,
  FaCheck
} from "react-icons/fa";

// ----------------------
// Analytics Card Component
// ----------------------
function AnalyticsCard({ title, value, icon, color, unit, subtitle }) {
  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
      whileHover={{ y: -3, scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-${color}/20`}>
          {React.cloneElement(icon, { className: `text-${color} text-lg` })}
        </div>
        <span className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded-full">{unit}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-300 font-medium">{title}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </motion.div>
  );
}

// ----------------------
// Chart Type Selector
// ----------------------
function ChartSelector({ chartMode, setChartMode }) {
  const chartTypes = [
    { id: "line", label: "Line", icon: <FaChartLine />, color: "cyan" },
    { id: "bar", label: "Bar", icon: <FaChartBar />, color: "green" },
    { id: "radar", label: "Radar", icon: <FaSatellite />, color: "purple" },
    { id: "pie", label: "Pie", icon: <FaChartPie />, color: "pink" },
    { id: "area", label: "Area", icon: <FaChartLine />, color: "blue" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {chartTypes.map((chart) => (
        <motion.button
          key={chart.id}
          onClick={() => setChartMode(chart.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            chartMode === chart.id
              ? `bg-${chart.color}-600 text-white shadow-lg`
              : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
          }`}
        >
          {chart.icon}
          {chart.label}
        </motion.button>
      ))}
    </div>
  );
}

// ----------------------
// Export Data Function
// ----------------------
const exportPlanetData = (planet) => {
  // Format planet data for export
  const exportData = {
    "Planet Name": planet.name,
    "Host Star": planet.hostStar ?? "Unknown",
    "Discovery Method": planet.discoveryMethod ?? "Unknown",
    "Discovery Year": planet.discoveryYear ?? "Unknown",
    "Distance (ly)": planet.distance ? (planet.distance * 3.26).toFixed(2) : "Unknown",
    "Distance (pc)": planet.distance ? planet.distance.toFixed(2) : "Unknown",
    "Radius (Earth Radii)": planet.radius ? planet.radius.toFixed(2) : "Unknown",
    "Mass (Earth Masses)": planet.mass ? planet.mass.toFixed(2) : "Unknown",
    "Temperature (K)": planet.temperature ? planet.temperature.toFixed(2) : "Unknown",
    "Orbital Period (days)": planet.orbitalPeriod ? planet.orbitalPeriod.toFixed(2) : "Unknown",
    "Semi-Major Axis (AU)": planet.semiMajorAxis ? planet.semiMajorAxis.toFixed(4) : "Unknown",
    "Eccentricity": planet.eccentricity ? planet.eccentricity.toFixed(3) : "Unknown",
    "Star Type": planet.starType ?? "Unknown",
    "Star Temperature (K)": planet.starTemp ? planet.starTemp.toFixed(2) : "Unknown",
    "Star Mass (Solar Masses)": planet.starMass ? planet.starMass.toFixed(2) : "Unknown",
    "Water Presence": planet.waterPresence ?? "Unknown",
    "Atmosphere": planet.atmosphere ?? "Unknown",
    "Habitable Zone": planet.habitableZone ?? "Unknown",
    "Flare Activity": planet.flareActivity ?? "Unknown",
    "Discovery Facility": planet.discoveryFacility ?? "Unknown",
    "Export Date": new Date().toLocaleString(),
    "Data Source": "Planet Data Explorer"
  };

  // Create CSV content
  const csvContent = Object.entries(exportData)
    .map(([key, value]) => `"${key}","${value}"`)
    .join('\n');

  // Create JSON content
  const jsonContent = JSON.stringify(exportData, null, 2);

  // Create download link for CSV
  const csvBlob = new Blob([csvContent], { type: 'text/csv' });
  const csvUrl = URL.createObjectURL(csvBlob);
  const csvLink = document.createElement('a');
  csvLink.href = csvUrl;
  csvLink.download = `${planet.name.replace(/\s+/g, '_')}_data.csv`;
  document.body.appendChild(csvLink);
  csvLink.click();
  document.body.removeChild(csvLink);
  URL.revokeObjectURL(csvUrl);

  // Also download JSON
  const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
  const jsonUrl = URL.createObjectURL(jsonBlob);
  const jsonLink = document.createElement('a');
  jsonLink.href = jsonUrl;
  jsonLink.download = `${planet.name.replace(/\s+/g, '_')}_data.json`;
  document.body.appendChild(jsonLink);
  jsonLink.click();
  document.body.removeChild(jsonLink);
  URL.revokeObjectURL(jsonUrl);

  return true;
};

// ----------------------
// Export Success Notification
// ----------------------
function ExportSuccess({ show, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl border border-green-400/30 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <FaCheck className="text-lg" />
            <span>Data exported successfully!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ----------------------
// Main Modal
// ----------------------
export default function PlanetModal({ planet, onClose }) {
  const navigate = useNavigate();
  const [chartMode, setChartMode] = useState("radar");
  const [activeTab, setActiveTab] = useState("analytics");
  const [factIndex, setFactIndex] = useState(0);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!planet) return null;

  // Safe values with better formatting - Only use available data
  const dist = planet.distance ?? null;
  const radius = planet.radius ?? null;
  const mass = planet.mass ?? null;
  const temperature = planet.temperature ?? null;
  const star = planet.hostStar ?? "Unknown Star";
  const starType = planet.starType ?? "—";
  const starTemp = planet.starTemp ?? null;
  const starMass = planet.starMass ?? null;
  const discoveryYear = planet.discoveryYear ?? "—";
  const discoveryMethod = planet.discoveryMethod ?? "—";
  const discoveryFacility = planet.discoveryFacility ?? "—";
  const orbitalPeriod = planet.orbitalPeriod ?? null;
  const semiMajorAxis = planet.semiMajorAxis ?? null;
  const eccentricity = planet.eccentricity ?? null;
  const waterPresence = planet.waterPresence ?? null;
  const atmosphere = planet.atmosphere ?? null;
  const habitableZone = planet.habitableZone ?? null;
  const flareActivity = planet.flareActivity ?? null;

  // Format values
  const formatValue = (value, unit = "") => {
    if (value === null || value === undefined || value === "—") return "—";
    if (typeof value === "number") {
      if (value > 1000) return `${(value / 1000).toFixed(1)}k ${unit}`;
      return `${value.toFixed(2)} ${unit}`;
    }
    return value;
  };

  // Handle export data
  const handleExportData = () => {
    const success = exportPlanetData(planet);
    if (success) {
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }
  };

  // Get available stats for analytics
  const getAvailableStats = () => {
    const stats = [];
    
    if (dist !== null) stats.push({ 
      key: 'distance', 
      value: dist * 3.26, 
      label: 'Distance', 
      icon: <FaCompressArrowsAlt />, 
      color: 'cyan',
      unit: 'ly',
      formatter: (val) => formatValue(val, 'ly')
    });
    
    if (radius !== null) stats.push({ 
      key: 'radius', 
      value: radius, 
      label: 'Radius', 
      icon: <FaRuler />, 
      color: 'pink',
      unit: 'R⊕',
      formatter: (val) => formatValue(val, 'R⊕')
    });

    if (mass !== null) stats.push({ 
      key: 'mass', 
      value: mass, 
      label: 'Mass', 
      icon: <FaWeightHanging />, 
      color: 'green',
      unit: 'M⊕',
      formatter: (val) => formatValue(val, 'M⊕')
    });

    if (temperature !== null) stats.push({ 
      key: 'temperature', 
      value: temperature, 
      label: 'Temperature', 
      icon: <FaTemperatureHigh />, 
      color: 'red',
      unit: 'K',
      formatter: (val) => formatValue(val, 'K')
    });

    if (orbitalPeriod !== null) stats.push({ 
      key: 'orbitalPeriod', 
      value: orbitalPeriod, 
      label: 'Orbital Period', 
      icon: <FaCalendarAlt />, 
      color: 'yellow',
      unit: 'days',
      formatter: (val) => formatValue(val, 'days')
    });

    if (semiMajorAxis !== null) stats.push({ 
      key: 'semiMajorAxis', 
      value: semiMajorAxis, 
      label: 'Semi-Major Axis', 
      icon: <FaRoute />, 
      color: 'blue',
      unit: 'AU',
      formatter: (val) => formatValue(val, 'AU')
    });

    if (eccentricity !== null) stats.push({ 
      key: 'eccentricity', 
      value: eccentricity, 
      label: 'Eccentricity', 
      icon: <FaCircle />, 
      color: 'purple',
      unit: '',
      formatter: (val) => val.toFixed(3)
    });

    return stats;
  };

  const availableStats = getAvailableStats();

  // Chart data - Only use available data
  const chartData = availableStats.map(item => ({
    name: item.label,
    value: item.value,
    unit: item.unit,
    actual: item.value
  }));

  // Comparison data (normalized) - Only if we have data
  const normalizedData = availableStats.map(item => ({
    name: item.label,
    value: item.value / (Math.max(...availableStats.map(s => s.value)) || 1) * 100,
    actual: item.value,
    unit: item.unit
  }));

  // Color scheme
  const COLORS = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-2xl">
          <p className="text-white font-semibold">{payload[0].payload.name}</p>
          <p className="text-cyan-400">
            {payload[0].payload.actual} {payload[0].payload.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  // Habitability assessment - Only if we have required data
  const getHabitability = () => {
    if (!semiMajorAxis || !starTemp) return { status: "Unknown", color: "gray", description: "Insufficient data for assessment" };
    
    // Simple habitable zone calculation
    const habitableZoneMin = 0.95 * Math.sqrt(starTemp / 5780);
    const habitableZoneMax = 1.37 * Math.sqrt(starTemp / 5780);
    
    if (semiMajorAxis >= habitableZoneMin && semiMajorAxis <= habitableZoneMax) {
      return { 
        status: "Potentially Habitable", 
        color: "green", 
        description: "Within conservative habitable zone" 
      };
    } else if (semiMajorAxis < habitableZoneMin) {
      return { 
        status: "Too Hot", 
        color: "red", 
        description: "Inside inner habitable zone boundary" 
      };
    } else {
      return { 
        status: "Too Cold", 
        color: "blue", 
        description: "Outside outer habitable zone boundary" 
      };
    }
  };

  const habitability = getHabitability();

  // Fun facts - Only use available data
  const facts = [
    discoveryYear !== "—" ? `Discovered in ${discoveryYear} using ${discoveryMethod}` : `Discovery Method: ${discoveryMethod}`,
    radius !== null ? `Radius: ${formatValue(radius, "Earth radii")}` : null,
    mass !== null ? `Mass: ${formatValue(mass, "Earth masses")}` : null,
    orbitalPeriod !== null ? `Orbital Period: ${formatValue(orbitalPeriod, "days")} (${(orbitalPeriod / 365.25).toFixed(2)} Earth years)` : null,
    dist !== null ? `Distance: ${formatValue(dist * 3.26, "light years")} from Earth` : null,
    temperature !== null ? `Equilibrium Temperature: ${formatValue(temperature, "K")}` : null,
    semiMajorAxis !== null ? `Distance from Star: ${formatValue(semiMajorAxis, "AU")}` : null,
    eccentricity !== null ? `Orbital Eccentricity: ${eccentricity.toFixed(3)}` : null,
    waterPresence ? `Water Presence: ${waterPresence}` : null,
    atmosphere ? `Atmosphere: ${atmosphere}` : null,
    starTemp ? `Host Star Temperature: ${formatValue(starTemp, "K")}` : null,
    starMass ? `Host Star Mass: ${formatValue(starMass, "Solar masses")}` : null,
  ].filter(fact => fact !== null);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Export Success Notification */}
        <ExportSuccess show={exportSuccess} onClose={() => setExportSuccess(false)} />
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative mt-32 z-10 max-w-6xl w-full mx-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/10 overflow-y-auto max-h-[95vh]"
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-lg z-20"
          >
            <FaTimes className="text-xl" />
          </motion.button>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.h2 
              className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {planet.name}
            </motion.h2>
            <p className="text-gray-300 text-lg">
              {star} {starType !== "—" ? `• ${starType}` : ""} • {discoveryMethod}
            </p>
            {habitability.status !== "Unknown" && (
              <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-${habitability.color}-600/20 text-${habitability.color}-400 border border-${habitability.color}-500/30`}>
                <FaGlobe />
                <span>{habitability.status}</span>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {[
              { id: "analytics", label: "Analytics", icon: <FaChartLine /> },
              { id: "details", label: "Details", icon: <FaDatabase /> },
              { id: "insights", label: "Insights", icon: <FaLightbulb /> },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Key Metrics Grid - Only show available data */}
              {availableStats.length > 0 ? (
                <div className={`grid gap-4 mb-8 ${
                  availableStats.length === 1 ? 'grid-cols-1' :
                  availableStats.length === 2 ? 'grid-cols-2' :
                  availableStats.length === 3 ? 'grid-cols-3' :
                  availableStats.length === 4 ? 'grid-cols-2 md:grid-cols-4' :
                  'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
                }`}>
                  {availableStats.map((stat, index) => (
                    <AnalyticsCard
                      key={stat.key}
                      title={stat.label}
                      value={stat.formatter(stat.value)}
                      icon={stat.icon}
                      color={stat.color}
                      unit={stat.unit}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FaDatabase className="text-4xl mx-auto mb-4 opacity-50" />
                  <p>No analytical data available for this planet</p>
                </div>
              )}

              {/* Chart Display - Only if we have data */}
              {availableStats.length > 1 && (
                <>
                  <ChartSelector chartMode={chartMode} setChartMode={setChartMode} />

                  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 mb-8">
                    <div className="h-96">
                      {chartMode === "radar" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={normalizedData}>
                            <PolarGrid stroke="#4B5563" />
                            <PolarAngleAxis dataKey="name" stroke="#D1D5DB" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9CA3AF" />
                            <Radar
                              name="Planet"
                              dataKey="value"
                              stroke="#6366f1"
                              fill="#6366f1"
                              fillOpacity={0.6}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      )}

                      {chartMode === "bar" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                            <XAxis dataKey="name" stroke="#D1D5DB" />
                            <YAxis stroke="#D1D5DB" />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" fill="#4ade80" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}

                      {chartMode === "line" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                            <XAxis dataKey="name" stroke="#D1D5DB" />
                            <YAxis stroke="#D1D5DB" />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      )}

                      {chartMode === "pie" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      )}

                      {chartMode === "area" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                            <XAxis dataKey="name" stroke="#D1D5DB" />
                            <YAxis stroke="#D1D5DB" />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Planetary Characteristics - Only show available data */}
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaGlobe className="text-cyan-400" />
                  Planetary Characteristics
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Radius", value: formatValue(radius, "R⊕"), icon: <FaRuler className="text-pink-400" />, available: radius !== null },
                    { label: "Mass", value: formatValue(mass, "M⊕"), icon: <FaWeightHanging className="text-green-400" />, available: mass !== null },
                    { label: "Temperature", value: formatValue(temperature, "K"), icon: <FaTemperatureHigh className="text-red-400" />, available: temperature !== null },
                    { label: "Water Presence", value: waterPresence, icon: <FaTint className="text-blue-400" />, available: waterPresence !== null },
                    { label: "Atmosphere", value: atmosphere, icon: <FaWind className="text-orange-400" />, available: atmosphere !== null },
                  ].filter(item => item.available).map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="text-gray-300">{item.label}</span>
                      </div>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                  {![radius, mass, temperature, waterPresence, atmosphere].some(val => val !== null) && (
                    <div className="text-center py-4 text-gray-400">
                      No planetary characteristics data available
                    </div>
                  )}
                </div>
              </div>

              {/* Orbital Characteristics - Only show available data */}
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaChartLine className="text-purple-400" />
                  Orbital Characteristics
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Orbital Period", value: formatValue(orbitalPeriod, "days"), icon: <FaCalendarAlt className="text-yellow-400" />, available: orbitalPeriod !== null },
                    { label: "Semi-Major Axis", value: formatValue(semiMajorAxis, "AU"), icon: <FaCompressArrowsAlt className="text-cyan-400" />, available: semiMajorAxis !== null },
                    { label: "Eccentricity", value: eccentricity ? eccentricity.toFixed(3) : "—", icon: <FaCircle className="text-pink-400" />, available: eccentricity !== null },
                    { label: "Habitable Zone", value: habitableZone ? "Yes" : "No", icon: <FaSun className="text-green-400" />, available: habitableZone !== null },
                    { label: "Flare Activity", value: flareActivity, icon: <FaWind className="text-orange-400" />, available: flareActivity !== null },
                  ].filter(item => item.available).map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="text-gray-300">{item.label}</span>
                      </div>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                  {![orbitalPeriod, semiMajorAxis, eccentricity, habitableZone, flareActivity].some(val => val !== null) && (
                    <div className="text-center py-4 text-gray-400">
                      No orbital characteristics data available
                    </div>
                  )}
                </div>
              </div>

              {/* Host Star Information - Only show available data */}
              {(star !== "Unknown Star" || starType !== "—" || starTemp !== null || starMass !== null) && (
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 md:col-span-2">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    Host Star Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Name", value: star, icon: <FaStar className="text-yellow-400" />, available: star !== "Unknown Star" },
                      { label: "Spectral Type", value: starType, icon: <FaStar className="text-blue-400" />, available: starType !== "—" },
                      { label: "Temperature", value: formatValue(starTemp, "K"), icon: <FaTemperatureHigh className="text-red-400" />, available: starTemp !== null },
                      { label: "Mass", value: formatValue(starMass, "M☉"), icon: <FaWeightHanging className="text-green-400" />, available: starMass !== null },
                    ].filter(item => item.available).map((item, index) => (
                      <div key={index} className="bg-black/20 p-3 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                          {item.icon}
                          <span className="text-gray-400 text-sm">{item.label}</span>
                        </div>
                        <div className="text-white font-medium">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Insights Tab */}
          {activeTab === "insights" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Habitability Assessment */}
              {habitability.status !== "Unknown" && (
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <FaGlobe className="text-green-400" />
                    Habitability Assessment
                  </h3>
                  <div className={`p-4 rounded-xl bg-${habitability.color}-600/20 border border-${habitability.color}-500/30 mb-4`}>
                    <div className="text-center">
                      <div className={`text-2xl font-bold text-${habitability.color}-400 mb-2`}>
                        {habitability.status}
                      </div>
                      <p className="text-gray-300 text-sm">{habitability.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Habitable Zone:</span>
                      <span className="text-white">Calculated based on star temperature</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Planet Position:</span>
                      <span className="text-white">{semiMajorAxis ? `${semiMajorAxis} AU` : "Unknown"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Discovery Insights */}
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaRocket className="text-purple-400" />
                  Discovery Insights
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Discovery Method</h4>
                    <p className="text-white">{discoveryMethod}</p>
                  </div>
                  {discoveryYear !== "—" && (
                    <div>
                      <h4 className="text-gray-400 text-sm mb-1">Year Discovered</h4>
                      <p className="text-white">{discoveryYear}</p>
                    </div>
                  )}
                  {discoveryFacility !== "—" && (
                    <div>
                      <h4 className="text-gray-400 text-sm mb-1">Discovery Facility</h4>
                      <p className="text-white">{discoveryFacility}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Significance</h4>
                    <p className="text-gray-300 text-sm">
                      This exoplanet contributes to our understanding of planetary system formation
                      and the diversity of worlds beyond our solar system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Fun Facts Carousel - Only if we have facts */}
              {facts.length > 0 && (
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 md:col-span-2">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <FaLightbulb className="text-yellow-400" />
                    Interesting Facts
                  </h3>
                  <motion.div
                    key={factIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center p-6 bg-black/20 rounded-xl border border-white/10 mb-4"
                  >
                    <p className="text-gray-300 text-lg">{facts[factIndex]}</p>
                  </motion.div>
                  <div className="flex justify-center gap-4">
                    <motion.button
                      onClick={() => setFactIndex((factIndex - 1 + facts.length) % facts.length)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white/5 rounded-lg text-gray-300 hover:text-white border border-white/10"
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      onClick={() => setFactIndex((factIndex + 1) % facts.length)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white/5 rounded-lg text-gray-300 hover:text-white border border-white/10"
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-wrap gap-4 mt-8 mb-16 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={() => {
                onClose();
                navigate(`/compare/${planet._id || planet.name}`);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium"
            >
              <FaExchangeAlt />
              Compare Planet
            </motion.button>

            <motion.button
              onClick={handleExportData}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-medium border border-white/10 hover:bg-white/10"
            >
              <FaDownload />
              Export Data
            </motion.button>

            <motion.a
              href={`https://exoplanetarchive.ipac.caltech.edu/overview/${encodeURIComponent(planet.name)}`}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-medium border border-white/10 hover:bg-white/10"
            >
              <FaExternalLinkAlt />
              NASA Archive
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}