// src/components/explorer/PlanetCharts.jsx
import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  ComposedChart,
  RadialBarChart,
  RadialBar
} from "recharts";
import { motion } from "framer-motion";
import { 
  FaGlobe, 
  FaChartLine, 
  FaRocket, 
  FaBalanceScale, 
  FaRuler,
  FaCalendarAlt,
  FaSearch,
  FaTemperatureHigh,
  FaStar,
  FaChartBar,
  FaChartPie,
  FaMapMarkerAlt,
  FaDatabase,
  FaSatellite,
  FaRadiation,
  FaWater,
  FaWind,
  FaSun,
  FaRoute
} from "react-icons/fa";

export default function PlanetCharts({ planets }) {
  const [activeTab, setActiveTab] = useState("overview");

  // ✅ Available planets with valid data
  const availablePlanets = useMemo(() => {
    return planets.filter(p => 
      p.name && 
      (p.distance || p.radius || p.mass || p.orbitalPeriod || p.discoveryYear)
    );
  }, [planets]);

  // ✅ Discovery Methods chart
  const methodsData = useMemo(() => {
    const counts = {};
    availablePlanets.forEach((p) => {
      const method = p.discoveryMethod ?? p.discoverymethod ?? "Unknown";
      counts[method] = (counts[method] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([method, count]) => ({ method, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [availablePlanets]);

  // ✅ Distance Distribution
  const distanceData = useMemo(() => {
    const bins = [
      { range: "0-100 ly", min: 0, max: 100, count: 0 },
      { range: "100-500 ly", min: 100, max: 500, count: 0 },
      { range: "500-1000 ly", min: 500, max: 1000, count: 0 },
      { range: "1000-2000 ly", min: 1000, max: 2000, count: 0 },
      { range: "2000+ ly", min: 2000, max: Infinity, count: 0 },
    ];

    availablePlanets.forEach((p) => {
      const distance = p.distance ? p.distance * 3.26 : null; // Convert to light years
      if (!distance) return;

      for (const bin of bins) {
        if (distance >= bin.min && distance < bin.max) {
          bin.count++;
          break;
        }
      }
    });

    return bins.filter(bin => bin.count > 0);
  }, [availablePlanets]);

  // ✅ Radius Distribution
  const radiusData = useMemo(() => {
    const planetsWithRadius = availablePlanets.filter(p => p.radius);
    if (planetsWithRadius.length === 0) return [];

    const bins = [
      { range: "0-1 R⊕", min: 0, max: 1, count: 0 },
      { range: "1-2 R⊕", min: 1, max: 2, count: 0 },
      { range: "2-4 R⊕", min: 2, max: 4, count: 0 },
      { range: "4-8 R⊕", min: 4, max: 8, count: 0 },
      { range: "8+ R⊕", min: 8, max: Infinity, count: 0 },
    ];

    planetsWithRadius.forEach((p) => {
      const radius = p.radius;
      for (const bin of bins) {
        if (radius >= bin.min && radius < bin.max) {
          bin.count++;
          break;
        }
      }
    });

    return bins.filter(bin => bin.count > 0);
  }, [availablePlanets]);

  // ✅ Mass Distribution
  const massData = useMemo(() => {
    const planetsWithMass = availablePlanets.filter(p => p.mass);
    if (planetsWithMass.length === 0) return [];

    const bins = [
      { range: "0-1 M⊕", min: 0, max: 1, count: 0 },
      { range: "1-5 M⊕", min: 1, max: 5, count: 0 },
      { range: "5-10 M⊕", min: 5, max: 10, count: 0 },
      { range: "10-20 M⊕", min: 10, max: 20, count: 0 },
      { range: "20+ M⊕", min: 20, max: Infinity, count: 0 },
    ];

    planetsWithMass.forEach((p) => {
      const mass = p.mass;
      for (const bin of bins) {
        if (mass >= bin.min && mass < bin.max) {
          bin.count++;
          break;
        }
      }
    });

    return bins.filter(bin => bin.count > 0);
  }, [availablePlanets]);

  // ✅ Discovery Year Timeline
  const yearData = useMemo(() => {
    const yearCounts = {};
    availablePlanets.forEach((p) => {
      const year = p.discoveryYear ?? p.disc_year;
      if (!year) return;
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    return Object.entries(yearCounts)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);
  }, [availablePlanets]);

  // ✅ Cumulative Discoveries
  const cumulativeData = useMemo(() => {
    if (yearData.length === 0) return [];
    
    let cumulative = 0;
    return yearData.map(item => {
      cumulative += item.count;
      return {
        year: item.year,
        yearly: item.count,
        cumulative: cumulative
      };
    });
  }, [yearData]);

  // ✅ Orbital Period Distribution
  const orbitalPeriodData = useMemo(() => {
    const planetsWithPeriod = availablePlanets.filter(p => p.orbitalPeriod);
    if (planetsWithPeriod.length === 0) return [];

    const bins = [
      { range: "0-10 days", min: 0, max: 10, count: 0 },
      { range: "10-50 days", min: 10, max: 50, count: 0 },
      { range: "50-100 days", min: 50, max: 100, count: 0 },
      { range: "100-365 days", min: 100, max: 365, count: 0 },
      { range: "1+ years", min: 365, max: Infinity, count: 0 },
    ];

    planetsWithPeriod.forEach((p) => {
      const period = p.orbitalPeriod;
      for (const bin of bins) {
        if (period >= bin.min && period < bin.max) {
          bin.count++;
          break;
        }
      }
    });

    return bins.filter(bin => bin.count > 0);
  }, [availablePlanets]);

  // ✅ Planetary System Analysis
  const systemData = useMemo(() => {
    const systemCounts = {};
    availablePlanets.forEach((p) => {
      const system = p.hostStar ?? p.hostname ?? "Unknown System";
      systemCounts[system] = (systemCounts[system] || 0) + 1;
    });

    const multiPlanetSystems = Object.values(systemCounts).filter(count => count > 1).length;
    const singlePlanetSystems = Object.values(systemCounts).filter(count => count === 1).length;

    return [
      { name: "Single Planet Systems", value: singlePlanetSystems },
      { name: "Multi-Planet Systems", value: multiPlanetSystems }
    ];
  }, [availablePlanets]);

  // ✅ Radius vs Mass Correlation
  const radiusMassData = useMemo(() => {
    return availablePlanets
      .filter(p => p.radius && p.mass)
      .map(p => ({
        radius: p.radius,
        mass: p.mass,
        name: p.name,
        size: Math.min(p.radius * 5, 20) // For bubble size
      }))
      .slice(0, 50); // Limit for performance
  }, [availablePlanets]);

  // ✅ Discovery Method Efficiency
  const methodEfficiencyData = useMemo(() => {
    const methodStats = {};
    
    availablePlanets.forEach((p) => {
      const method = p.discoveryMethod ?? p.discoverymethod ?? "Unknown";
      if (!methodStats[method]) {
        methodStats[method] = { count: 0, totalRadius: 0, totalMass: 0 };
      }
      methodStats[method].count++;
      if (p.radius) methodStats[method].totalRadius += p.radius;
      if (p.mass) methodStats[method].totalMass += p.mass;
    });

    return Object.entries(methodStats)
      .map(([method, stats]) => ({
        method,
        count: stats.count,
        avgRadius: stats.totalRadius / stats.count,
        avgMass: stats.totalMass / stats.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [availablePlanets]);

  // ✅ Distance vs Discovery Year
  const distanceYearData = useMemo(() => {
    return availablePlanets
      .filter(p => p.distance && p.discoveryYear)
      .map(p => ({
        year: parseInt(p.discoveryYear),
        distance: p.distance * 3.26, // Convert to light years
        name: p.name
      }))
      .slice(0, 100);
  }, [availablePlanets]);

  // ✅ Planetary Diversity Radar
  const diversityData = useMemo(() => {
    const metrics = [
      { subject: 'Small Planets', value: availablePlanets.filter(p => p.radius && p.radius < 2).length },
      { subject: 'Medium Planets', value: availablePlanets.filter(p => p.radius && p.radius >= 2 && p.radius < 6).length },
      { subject: 'Large Planets', value: availablePlanets.filter(p => p.radius && p.radius >= 6).length },
      { subject: 'Close Orbits', value: availablePlanets.filter(p => p.orbitalPeriod && p.orbitalPeriod < 50).length },
      { subject: 'Far Orbits', value: availablePlanets.filter(p => p.orbitalPeriod && p.orbitalPeriod >= 50).length },
      { subject: 'Recent Finds', value: availablePlanets.filter(p => p.discoveryYear && p.discoveryYear >= 2020).length }
    ];

    // Normalize values for radar chart
    const maxValue = Math.max(...metrics.map(m => m.value));
    return metrics.map(m => ({
      ...m,
      value: maxValue > 0 ? (m.value / maxValue) * 100 : 0
    }));
  }, [availablePlanets]);

  const COLORS = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#10b981'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-2xl">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-purple-400">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // If no data available
  if (availablePlanets.length === 0) {
    return (
      <motion.div 
        className="w-full mb-8 text-center py-12 backdrop-blur-xl bg-black/40 rounded-3xl border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FaDatabase className="text-6xl text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl text-gray-400 mb-2">No Data Available</h3>
        <p className="text-gray-500">Planet data is not available for visualization</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Planetary Analytics Dashboard
        </h2>
        <p className="text-gray-400 mt-2">Visual insights from {availablePlanets.length} exoplanets</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {[
          { id: "overview", label: "Overview", icon: <FaChartBar className="text-lg" /> },
          { id: "physical", label: "Physical Properties", icon: <FaGlobe className="text-lg" /> },
          { id: "discovery", label: "Discovery", icon: <FaRocket className="text-lg" /> },
          { id: "correlation", label: "Correlations", icon: <FaChartLine className="text-lg" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Discovery Methods */}
          {methodsData.length > 0 && (
            <motion.div 
              className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 shadow-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-indigo-400 flex items-center gap-2">
                  <FaSearch className="text-indigo-400" />
                  Discovery Methods
                </h3>
                <span className="text-sm text-gray-400 bg-white/5 px-2 py-1 rounded">
                  {methodsData.reduce((sum, item) => sum + item.count, 0)} planets
                </span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={methodsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="method" 
                    stroke="#9ca3af" 
                    fontSize={11}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Distance Distribution */}
          {distanceData.length > 0 && (
            <motion.div 
              className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 shadow-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                  <FaRoute className="text-cyan-400" />
                  Distance Distribution
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={distanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* System Types */}
          {systemData.length > 0 && (
            <motion.div 
              className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 shadow-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                  <FaStar className="text-green-400" />
                  System Types
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={systemData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {systemData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      )}

      {/* Physical Properties Tab */}
      {activeTab === "physical" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radius Distribution */}
          {radiusData.length > 0 && (
            <motion.div 
              className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 shadow-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-pink-400 flex items-center gap-2">
                  <FaRuler className="text-pink-400" />
                  Radius Distribution
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={radiusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Mass Distribution */}
          {massData.length > 0 && (
            <motion.div 
              className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 shadow-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                  <FaBalanceScale className="text-green-400" />
                  Mass Distribution
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={massData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Orbital Period Distribution */}
          {orbitalPeriodData.length > 0 && (
            <motion.div 
              className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 shadow-2xl lg:col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                  <FaChartPie className="text-yellow-400" />
                  Orbital Period Distribution
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orbitalPeriodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      )}

      {/* Discovery Tab */}
      {activeTab === "discovery" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Discovery Timeline */}
          {yearData.length > 0 && (
            <motion.div 
              className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 shadow-2xl lg:col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                  <FaCalendarAlt className="text-cyan-400" />
                  Discovery Timeline
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={yearData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" fill="#06b6d4" stroke="#06b6d4" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Cumulative Discoveries */}
          {cumulativeData.length > 0 && (
            <motion.div 
              className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 shadow-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                  <FaChartLine className="text-purple-400" />
                  Cumulative Discoveries
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cumulativeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="cumulative" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Method Efficiency */}
          {methodEfficiencyData.length > 0 && (
            <motion.div 
              className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 shadow-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                  <FaRocket className="text-red-400" />
                  Method Efficiency
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={methodEfficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="method" stroke="#9ca3af" fontSize={11} angle={-45} textAnchor="end" height={60} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      )}

      {/* Correlation Tab */}
      {activeTab === "correlation" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radius vs Mass Correlation */}
          {radiusMassData.length > 0 && (
            <motion.div 
              className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 shadow-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                  <FaBalanceScale className="text-green-400" />
                  Radius vs Mass
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" dataKey="radius" name="Radius (R⊕)" stroke="#9ca3af" />
                  <YAxis type="number" dataKey="mass" name="Mass (M⊕)" stroke="#9ca3af" />
                  <ZAxis type="number" dataKey="size" range={[50, 300]} name="Size" />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Planets" data={radiusMassData} fill="#22c55e" />
                </ScatterChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Distance vs Discovery Year */}
          {distanceYearData.length > 0 && (
            <motion.div 
              className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 shadow-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                  <FaRoute className="text-blue-400" />
                  Distance vs Year
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" dataKey="year" name="Discovery Year" stroke="#9ca3af" />
                  <YAxis type="number" dataKey="distance" name="Distance (ly)" stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Planets" data={distanceYearData} fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Planetary Diversity Radar */}
          {diversityData.length > 0 && (
            <motion.div 
              className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 shadow-2xl lg:col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                  <FaSatellite className="text-purple-400" />
                  Planetary Diversity
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <RadialBarChart innerRadius="10%" outerRadius="80%" data={diversityData} startAngle={180} endAngle={0}>
                  <RadialBar minAngle={15} label={{ fill: '#fff', position: 'insideStart' }} background clockWise dataKey="value" />
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      )}

      {/* Stats Summary */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { 
            label: "Total Planets", 
            value: availablePlanets.length, 
            icon: <FaGlobe className="text-lg" />, 
            color: "from-purple-600 to-blue-600" 
          },
          { 
            label: "With Radius Data", 
            value: availablePlanets.filter(p => p.radius).length, 
            icon: <FaRuler className="text-lg" />, 
            color: "from-blue-600 to-cyan-500" 
          },
          { 
            label: "With Mass Data", 
            value: availablePlanets.filter(p => p.mass).length, 
            icon: <FaBalanceScale className="text-lg" />, 
            color: "from-cyan-500 to-green-500" 
          },
          { 
            label: "Multi-Planet Systems", 
            value: systemData.find(d => d.name === "Multi-Planet Systems")?.value || 0, 
            icon: <FaStar className="text-lg" />, 
            color: "from-green-500 to-purple-600" 
          },
        ].map((stat, index) => (
          <div key={index} className="backdrop-blur-xl bg-black/40 rounded-2xl p-4 border border-white/10 text-center">
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}