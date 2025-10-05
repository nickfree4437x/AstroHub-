// src/components/atmosphere/ComparativeCharts.jsx
import React, { useMemo, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart
} from "recharts";
import { 
  FaChartBar, 
  FaChartPie, 
  FaChartLine, 
  FaSatellite, 
  FaThermometerHalf,
  FaTachometerAlt,
  FaWeight,
  FaCloud,
  FaExchangeAlt
} from "react-icons/fa";

export default function ComparativeCharts({ atmA, atmB, planetA, planetB }) {
  const [activeChart, setActiveChart] = useState("composition");
  
  if (!atmA || !atmB) return null;

  // Color schemes
  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
  const PLANET_A_COLOR = "#6366f1";
  const PLANET_B_COLOR = "#ec4899";

  // Convert composition objects into comparable array
  const gases = Array.from(new Set([
    ...Object.keys(atmA.composition || {}),
    ...Object.keys(atmB.composition || {})
  ]));

  // Main composition data
  const compositionData = gases.map(g => ({
    name: g,
    [planetA]: atmA.composition[g] || 0,
    [planetB]: atmB.composition[g] || 0,
    unit: '%'
  }));

  // Pie chart data for each planet
  const pieDataA = Object.entries(atmA.composition || {}).map(([name, value], index) => ({
    name,
    value,
    fill: COLORS[index % COLORS.length]
  }));

  const pieDataB = Object.entries(atmB.composition || {}).map(([name, value], index) => ({
    name,
    value,
    fill: COLORS[index % COLORS.length]
  }));

  // Radar chart data for comprehensive comparison
  const radarData = [
    { subject: 'Pressure', [planetA]: atmA.pressure || 0, [planetB]: atmB.pressure || 0, fullMark: 100 },
    { subject: 'Temperature', [planetA]: atmA.temperature || 0, [planetB]: atmB.temperature || 0, fullMark: 1000 },
    { subject: 'Density', [planetA]: atmA.density || 0, [planetB]: atmB.density || 0, fullMark: 10 },
    { subject: 'Albedo', [planetA]: atmA.albedo || 0, [planetB]: atmB.albedo || 0, fullMark: 1 },
    { subject: 'Greenhouse', [planetA]: atmA.greenhouseEffect || 0, [planetB]: atmB.greenhouseEffect || 0, fullMark: 100 },
    { subject: 'Stability', [planetA]: atmA.stability || 0, [planetB]: atmB.stability || 0, fullMark: 100 },
  ];

  // Trend data (simulated historical data)
  const trendData = [
    { year: '2020', [planetA]: 85, [planetB]: 45 },
    { year: '2021', [planetA]: 82, [planetB]: 48 },
    { year: '2022', [planetA]: 78, [planetB]: 52 },
    { year: '2023', [planetA]: 76, [planetB]: 55 },
    { year: '2024', [planetA]: 74, [planetB]: 58 },
  ];

  // Atmospheric properties comparison
  const propertiesData = [
    { name: 'Surface Pressure', [planetA]: atmA.pressure || 'N/A', [planetB]: atmB.pressure || 'N/A', unit: 'bar' },
    { name: 'Average Temp', [planetA]: atmA.temperature || 'N/A', [planetB]: atmB.temperature || 'N/A', unit: 'K' },
    { name: 'Atmospheric Depth', [planetA]: atmA.depth || 'N/A', [planetB]: atmB.depth || 'N/A', unit: 'km' },
    { name: 'Albedo', [planetA]: atmA.albedo || 'N/A', [planetB]: atmB.albedo || 'N/A', unit: '' },
    { name: 'Greenhouse Effect', [planetA]: atmA.greenhouseEffect || 'N/A', [planetB]: atmB.greenhouseEffect || 'N/A', unit: 'K' },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-2xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.payload.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Chart types with icons
  const chartTypes = [
    { id: "composition", label: "Gas Composition", icon: <FaChartBar /> },
    { id: "radar", label: "Radar Analysis", icon: <FaSatellite /> },
    { id: "trend", label: "Trend Analysis", icon: <FaChartLine /> },
    { id: "properties", label: "Properties", icon: <FaTachometerAlt /> },
    { id: "pie", label: "Pie Charts", icon: <FaChartPie /> },
  ];

  const renderChart = () => {
    switch (activeChart) {
      case "composition":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaChartBar className="text-blue-400" />
                Gas Composition Comparison
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={compositionData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey={planetA} 
                    fill={PLANET_A_COLOR} 
                    radius={[4, 4, 0, 0]}
                    name={planetA}
                  />
                  <Bar 
                    dataKey={planetB} 
                    fill={PLANET_B_COLOR} 
                    radius={[4, 4, 0, 0]}
                    name={planetB}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "radar":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaSatellite className="text-purple-400" />
                Comprehensive Atmospheric Analysis
              </h4>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                  <Radar
                    name={planetA}
                    dataKey={planetA}
                    stroke={PLANET_A_COLOR}
                    fill={PLANET_A_COLOR}
                    fillOpacity={0.3}
                  />
                  <Radar
                    name={planetB}
                    dataKey={planetB}
                    stroke={PLANET_B_COLOR}
                    fill={PLANET_B_COLOR}
                    fillOpacity={0.3}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "trend":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaChartLine className="text-green-400" />
                Atmospheric Evolution Trend
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PLANET_A_COLOR} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={PLANET_A_COLOR} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PLANET_B_COLOR} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={PLANET_B_COLOR} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey={planetA} stroke={PLANET_A_COLOR} fillOpacity={1} fill="url(#colorA)" />
                  <Area type="monotone" dataKey={planetB} stroke={PLANET_B_COLOR} fillOpacity={1} fill="url(#colorB)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "properties":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaTachometerAlt className="text-yellow-400" />
                Physical Properties Comparison
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={propertiesData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey={planetA} 
                    fill={PLANET_A_COLOR} 
                    radius={[4, 4, 0, 0]}
                    name={planetA}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={planetB} 
                    stroke={PLANET_B_COLOR} 
                    strokeWidth={3}
                    name={planetB}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "pie":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4 text-center">
                {planetA} Atmosphere
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieDataA}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieDataA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4 text-center">
                {planetB} Atmosphere
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieDataB}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieDataB.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <FaExchangeAlt className="text-cyan-400" />
              Atmospheric Comparison
            </h3>
            <p className="text-gray-300">
              Detailed analysis of atmospheric properties between {planetA} and {planetB}
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-500/30">
              <div className="text-blue-400 text-sm font-medium">{planetA}</div>
            </div>
            <div className="bg-pink-500/20 px-3 py-1 rounded-lg border border-pink-500/30">
              <div className="text-pink-400 text-sm font-medium">{planetB}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="p-4 bg-gray-800/30 border-b border-white/10">
        <div className="flex flex-wrap gap-2">
          {chartTypes.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeChart === chart.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              {chart.icon}
              {chart.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        {renderChart()}
      </div>

      {/* Summary Stats */}
      <div className="p-6 bg-gray-800/20 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <FaThermometerHalf className="text-red-400 text-xl mx-auto mb-2" />
            <div className="text-white font-bold text-lg">
              {Math.max(atmA.temperature || 0, atmB.temperature || 0)}K
            </div>
            <div className="text-gray-400 text-sm">Max Temperature</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <FaWeight className="text-blue-400 text-xl mx-auto mb-2" />
            <div className="text-white font-bold text-lg">
              {Math.max(atmA.pressure || 0, atmB.pressure || 0)} bar
            </div>
            <div className="text-gray-400 text-sm">Max Pressure</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <FaCloud className="text-cyan-400 text-xl mx-auto mb-2" />
            <div className="text-white font-bold text-lg">
              {gases.length}
            </div>
            <div className="text-gray-400 text-sm">Gases Detected</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <FaTachometerAlt className="text-green-400 text-xl mx-auto mb-2" />
            <div className="text-white font-bold text-lg">
              {Math.max(atmA.stability || 0, atmB.stability || 0)}%
            </div>
            <div className="text-gray-400 text-sm">Max Stability</div>
          </div>
        </div>
      </div>
    </div>
  );
}