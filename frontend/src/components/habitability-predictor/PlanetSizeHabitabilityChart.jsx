// src/components/habitability-predictor/PlanetSizeHabitabilityChart.jsx
import React, { useMemo } from "react";
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  ComposedChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { motion } from "framer-motion";
import { 
  FaChartLine, 
  FaExpandAlt, 
  FaRuler, 
  FaGlobeAmericas,
  FaTemperatureHigh,
  FaSpaceShuttle,
  FaSeedling,
  FaFire
} from "react-icons/fa";

const PlanetSizeHabitabilityChart = ({ predictions }) => {
  // Advanced analytics calculations
  const chartData = useMemo(() => {
    if (!predictions || predictions.length === 0) return null;

    // Prepare scatter plot data
    const habitableData = predictions
      .filter((p) => p.habitability_label === 1)
      .map((p) => ({
        x: p.radius_earth || 0,
        y: p.habitability_score,
        name: p.planet,
        size: (p.mass_earth || 1) * 2,
        temperature: p.temp_k || 300,
        distance: p.distance_ly || 1000
      }));

    const nonHabitableData = predictions
      .filter((p) => p.habitability_label === 0)
      .map((p) => ({
        x: p.radius_earth || 0,
        y: p.habitability_score,
        name: p.planet,
        size: (p.mass_earth || 1) * 2,
        temperature: p.temp_k || 300,
        distance: p.distance_ly || 1000
      }));

    // Size distribution analysis
    const sizeRanges = [
      { range: "0-0.5", min: 0, max: 0.5, habitable: 0, nonHabitable: 0 },
      { range: "0.5-1", min: 0.5, max: 1, habitable: 0, nonHabitable: 0 },
      { range: "1-1.5", min: 1, max: 1.5, habitable: 0, nonHabitable: 0 },
      { range: "1.5-2", min: 1.5, max: 2, habitable: 0, nonHabitable: 0 },
      { range: "2+", min: 2, max: Infinity, habitable: 0, nonHabitable: 0 },
    ];

    predictions.forEach(p => {
      const radius = p.radius_earth || 0;
      const range = sizeRanges.find(r => radius >= r.min && radius < r.max);
      if (range) {
        if (p.habitability_label === 1) range.habitable++;
        else range.nonHabitable++;
      }
    });

    // Score distribution by size
    const scoreBySize = sizeRanges.map(range => ({
      range: range.range,
      habitableScore: range.habitable > 0 ? (range.habitable / (range.habitable + range.nonHabitable)) * 100 : 0,
      totalPlanets: range.habitable + range.nonHabitable
    }));

    return {
      scatterData: { habitableData, nonHabitableData },
      sizeDistribution: sizeRanges,
      scoreBySize,
      totalPredictions: predictions.length,
      habitableCount: habitableData.length,
      avgRadius: (predictions.reduce((sum, p) => sum + (p.radius_earth || 0), 0) / predictions.length).toFixed(2),
      maxScore: Math.max(...predictions.map(p => p.habitability_score || 0))
    };
  }, [predictions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl min-w-48">
          <p className="text-white font-semibold border-b border-white/20 pb-2 mb-2">
            {payload[0]?.payload?.name || "Planet"}
          </p>
          <div className="space-y-1">
            <p className="text-cyan-400">Radius: {payload[0]?.payload?.x} R⊕</p>
            <p className="text-green-400">Score: {payload[0]?.payload?.y}%</p>
            {payload[0]?.payload?.temperature && (
              <p className="text-orange-400">Temp: {payload[0]?.payload?.temperature}K</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

  if (!predictions || predictions.length === 0) {
    return (
      <motion.div 
        className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold text-gray-300 mb-2">No Data Available</h3>
        <p className="text-gray-400">Make some predictions to see analytics</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-white/10 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
            <FaRuler className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Planet Size Analytics</h3>
            <p className="text-gray-300">Relationship between planetary size and habitability</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
            whileHover={{ y: -3, scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-cyan-400 mb-1">{chartData.totalPredictions}</div>
            <div className="text-sm text-gray-300">Total Planets</div>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
            whileHover={{ y: -3, scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-green-400 mb-1">{chartData.habitableCount}</div>
            <div className="text-sm text-gray-300">Habitable</div>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
            whileHover={{ y: -3, scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-yellow-400 mb-1">{chartData.avgRadius}</div>
            <div className="text-sm text-gray-300">Avg Radius (R⊕)</div>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
            whileHover={{ y: -3, scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-purple-400 mb-1">{chartData.maxScore}%</div>
            <div className="text-sm text-gray-300">Max Score</div>
          </motion.div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Scatter Plot */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaChartLine className="text-blue-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Size vs Habitability Score</h4>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Radius"
                  unit=" R⊕"
                  stroke="#9CA3AF"
                  label={{ value: 'Planet Radius (Earth Radii)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Score"
                  unit="%"
                  stroke="#9CA3AF"
                  label={{ value: 'Habitability Score (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Scatter
                  name="Habitable Planets"
                  data={chartData.scatterData.habitableData}
                  fill="#22c55e"
                  fillOpacity={0.7}
                  stroke="#16a34a"
                  strokeWidth={1}
                />
                <Scatter
                  name="Non-Habitable Planets"
                  data={chartData.scatterData.nonHabitableData}
                  fill="#ef4444"
                  fillOpacity={0.7}
                  stroke="#dc2626"
                  strokeWidth={1}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Size Distribution */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaExpandAlt className="text-green-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Size Distribution Analysis</h4>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.sizeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="range" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Bar dataKey="habitable" fill="#22c55e" name="Habitable" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nonHabitable" fill="#ef4444" name="Non-Habitable" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Success Rate by Size */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaSeedling className="text-emerald-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Success Rate by Size Range</h4>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData.scoreBySize}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="range" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" unit="%" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="habitableScore" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  name="Habitable %"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Size Category Pie */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaGlobeAmericas className="text-purple-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Size Category Distribution</h4>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData.sizeDistribution.filter(d => d.totalPlanets > 0)}
                  dataKey="totalPlanets"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ range, totalPlanets }) => `${range}: ${totalPlanets}`}
                >
                  {chartData.sizeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Insights Panel */}
        <motion.div 
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <FaChartLine className="text-cyan-400" />
            Analytical Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-green-400 font-semibold mb-1">Optimal Size Range</div>
              <div className="text-gray-300">0.8 - 1.5 Earth radii show highest habitability</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-yellow-400 font-semibold mb-1">Size Correlation</div>
              <div className="text-gray-300">Strong correlation between size and habitability score</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-blue-400 font-semibold mb-1">Data Confidence</div>
              <div className="text-gray-300">Analysis based on {chartData.totalPredictions} planetary predictions</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlanetSizeHabitabilityChart;