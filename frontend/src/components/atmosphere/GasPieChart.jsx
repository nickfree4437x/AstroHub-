// src/components/atmosphere/GasPieChart.jsx
import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

// Enhanced color palette for gases
const GAS_COLORS = {
  // Common atmospheric gases with meaningful colors
  "N2": "#3B82F6",    // Nitrogen - Blue
  "O2": "#EF4444",    // Oxygen - Red
  "CO2": "#10B981",   // Carbon Dioxide - Green
  "Ar": "#8B5CF6",    // Argon - Purple
  "H2": "#F59E0B",    // Hydrogen - Amber
  "He": "#06B6D4",    // Helium - Cyan
  "CH4": "#F97316",   // Methane - Orange
  "H2O": "#60A5FA",   // Water Vapor - Light Blue
  "Ne": "#A78BFA",    // Neon - Violet
  "Kr": "#F472B6",    // Krypton - Pink
  "Xe": "#34D399",    // Xenon - Emerald
  "NH3": "#84CC16",   // Ammonia - Lime
  "SO2": "#FACC15",   // Sulfur Dioxide - Yellow
};

// Fallback colors for unknown gases
const FALLBACK_COLORS = [
  "#60A5FA", "#F472B6", "#F59E0B", "#34D399", "#F97316", 
  "#A78BFA", "#EF4444", "#84CC16", "#FACC15", "#06B6D4"
];

function toData(composition) {
  if (!composition || typeof composition !== "object") return [];
  
  return Object.entries(composition)
    .map(([name, value]) => ({ 
      name, 
      value: Number(value),
      percentage: Number(value)
    }))
    .filter(item => !isNaN(item.value) && item.value > 0)
    .sort((a, b) => b.value - a.value); // Sort by value descending
}

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl backdrop-blur-sm">
        <p className="text-white font-semibold mb-1">{data.payload.name}</p>
        <p className="text-blue-400">
          Composition: <span className="text-white font-bold">{data.value}%</span>
        </p>
        {data.payload.description && (
          <p className="text-gray-400 text-xs mt-1 max-w-xs">
            {data.payload.description}
          </p>
        )}
      </div>
    );
  }
  return null;
};

// Custom Legend
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 px-2">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2 text-xs">
          <div 
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-300">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Gas descriptions for common atmospheric components
const GAS_DESCRIPTIONS = {
  "N2": "Nitrogen - Inert gas, forms majority of Earth's atmosphere",
  "O2": "Oxygen - Essential for aerobic life, supports combustion",
  "CO2": "Carbon Dioxide - Greenhouse gas, used in photosynthesis",
  "Ar": "Argon - Noble gas, chemically inert",
  "H2": "Hydrogen - Lightest element, highly flammable",
  "He": "Helium - Noble gas, second lightest element",
  "CH4": "Methane - Greenhouse gas, main component of natural gas",
  "H2O": "Water Vapor - Variable component, affects humidity and clouds",
  "Ne": "Neon - Noble gas, produces bright red-orange glow",
  "Kr": "Krypton - Rare noble gas, used in lighting",
  "Xe": "Xenon - Heavy noble gas, used in specialized lighting",
  "NH3": "Ammonia - Toxic gas, found in some planetary atmospheres",
  "SO2": "Sulfur Dioxide - Volcanic gas, contributes to acid rain"
};

export default function GasPieChart({ data = {} }) {
  const chartData = toData(data);
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  
  // Get color for each gas, fallback to sequential colors
  const getGasColor = (gasName, index) => {
    return GAS_COLORS[gasName] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  };

  // Add descriptions to chart data
  const enhancedData = chartData.map((item, index) => ({
    ...item,
    color: getGasColor(item.name, index),
    description: GAS_DESCRIPTIONS[item.name] || `${item.name} - Atmospheric component`
  }));

  if (chartData.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-64 bg-black/20 rounded-xl border border-gray-600/30"
      >
        <div className="text-gray-400 text-lg mb-2">🌫️</div>
        <p className="text-gray-400 text-center">No atmospheric data available</p>
        <p className="text-gray-500 text-sm mt-1">Gas composition data missing</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-black/20 rounded-xl p-4 border border-gray-600/30"
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">Gas Composition</h3>
        <div className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
          Total: {total.toFixed(1)}%
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={enhancedData}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={1}
              cornerRadius={4}
              startAngle={90}
              endAngle={450}
              animationBegin={0}
              animationDuration={800}
            >
              {enhancedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#1F2937"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Composition Summary */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Primary Gas:</span>
          <span className="text-white font-medium">
            {chartData[0]?.name} ({chartData[0]?.value}%)
          </span>
        </div>
        
        {chartData.length > 1 && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Secondary Gas:</span>
            <span className="text-white font-medium">
              {chartData[1]?.name} ({chartData[1]?.value}%)
            </span>
          </div>
        )}

        {/* Gas Diversity Indicator */}
        <div className="flex justify-between items-center text-xs mt-3 pt-2 border-t border-gray-700/50">
          <span className="text-gray-400">Gas Diversity:</span>
          <div className="flex items-center gap-1">
            {chartData.length <= 2 && (
              <span className="text-yellow-400 font-medium">Simple</span>
            )}
            {chartData.length > 2 && chartData.length <= 4 && (
              <span className="text-green-400 font-medium">Moderate</span>
            )}
            {chartData.length > 4 && (
              <span className="text-purple-400 font-medium">Complex</span>
            )}
            <span className="text-gray-400">({chartData.length} gases)</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-700/50">
        <div className="text-center">
          <div className="text-white font-bold text-sm">
            {Math.max(...chartData.map(d => d.value)).toFixed(1)}%
          </div>
          <div className="text-gray-400 text-xs">Highest</div>
        </div>
        <div className="text-center">
          <div className="text-white font-bold text-sm">
            {Math.min(...chartData.map(d => d.value)).toFixed(1)}%
          </div>
          <div className="text-gray-400 text-xs">Lowest</div>
        </div>
      </div>
    </motion.div>
  );
}