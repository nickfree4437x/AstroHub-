// src/components/habitability-predictor/PlanetTempHabitabilityChart.jsx
import React, { useMemo } from "react";
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  ComposedChart, Area, ReferenceLine
} from "recharts";
import { motion } from "framer-motion";
import { 
  FaThermometerHalf, 
  FaFire, 
  FaSnowflake,
  FaChartLine,
  FaTemperatureHigh,
  FaSeedling,
  FaExclamationTriangle
} from "react-icons/fa";

const PlanetTempHabitabilityChart = ({ predictions }) => {
  // Advanced temperature analytics calculations
  const chartData = useMemo(() => {
    if (!predictions || predictions.length === 0) return null;

    // Prepare scatter plot data
    const habitableData = predictions
      .filter((p) => p.habitability_label === 1)
      .map((p) => ({
        x: p.temp_k || 0,
        y: p.habitability_score,
        name: p.planet,
        radius: p.radius_earth || 1,
        distance: p.distance_ly || 1000,
        mass: p.mass_earth || 1
      }));

    const nonHabitableData = predictions
      .filter((p) => p.habitability_label === 0)
      .map((p) => ({
        x: p.temp_k || 0,
        y: p.habitability_score,
        name: p.planet,
        radius: p.radius_earth || 1,
        distance: p.distance_ly || 1000,
        mass: p.mass_earth || 1
      }));

    // Temperature range analysis (Earth-like: 250-350K)
    const tempRanges = [
      { range: "0-100K", min: 0, max: 100, habitable: 0, nonHabitable: 0, color: "#3b82f6" },
      { range: "100-200K", min: 100, max: 200, habitable: 0, nonHabitable: 0, color: "#60a5fa" },
      { range: "200-300K", min: 200, max: 300, habitable: 0, nonHabitable: 0, color: "#22c55e" },
      { range: "300-400K", min: 300, max: 400, habitable: 0, nonHabitable: 0, color: "#eab308" },
      { range: "400-500K", min: 400, max: 500, habitable: 0, nonHabitable: 0, color: "#f97316" },
      { range: "500K+", min: 500, max: Infinity, habitable: 0, nonHabitable: 0, color: "#ef4444" },
    ];

    predictions.forEach(p => {
      const temp = p.temp_k || 0;
      const range = tempRanges.find(r => temp >= r.min && temp < r.max);
      if (range) {
        if (p.habitability_label === 1) range.habitable++;
        else range.nonHabitable++;
      }
    });

    // Temperature statistics
    const allTemps = predictions.map(p => p.temp_k || 0).filter(temp => temp > 0);
    const avgTemp = allTemps.length > 0 ? allTemps.reduce((a, b) => a + b) / allTemps.length : 0;
    const earthLikeTemps = predictions.filter(p => {
      const temp = p.temp_k || 0;
      return temp >= 250 && temp <= 350; // Earth-like temperature range
    });

    // Success rate by temperature range
    const successByTemp = tempRanges.map(range => ({
      range: range.range,
      successRate: range.habitable + range.nonHabitable > 0 
        ? (range.habitable / (range.habitable + range.nonHabitable)) * 100 
        : 0,
      totalPlanets: range.habitable + range.nonHabitable,
      color: range.color
    }));

    return {
      scatterData: { habitableData, nonHabitableData },
      tempRanges,
      successByTemp,
      totalPredictions: predictions.length,
      habitableCount: habitableData.length,
      avgTemperature: avgTemp.toFixed(0),
      earthLikeCount: earthLikeTemps.length,
      earthLikeHabitable: earthLikeTemps.filter(p => p.habitability_label === 1).length,
      optimalRange: "200-400K"
    };
  }, [predictions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl min-w-48">
          <p className="text-white font-semibold border-b border-white/20 pb-2 mb-2">
            {data.name}
          </p>
          <div className="space-y-1">
            <p className="text-orange-400">Temperature: {data.x}K</p>
            <p className="text-green-400">Habitability: {data.y}%</p>
            {data.radius && <p className="text-cyan-400">Radius: {data.radius}R⊕</p>}
            {data.distance && <p className="text-blue-400">Distance: {data.distance}ly</p>}
          </div>
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#3b82f6', '#60a5fa', '#22c55e', '#eab308', '#f97316', '#ef4444'];

  if (!predictions || predictions.length === 0) {
    return (
      <motion.div 
        className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl mb-4">🌡️</div>
        <h3 className="text-2xl font-bold text-gray-300 mb-2">No Temperature Data</h3>
        <p className="text-gray-400">Make predictions to see temperature analytics</p>
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
      <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-white/10 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
            <FaThermometerHalf className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Temperature Analytics</h3>
            <p className="text-gray-300">Impact of surface temperature on planetary habitability</p>
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
            <div className="text-2xl font-bold text-orange-400 mb-1">{chartData.avgTemperature}K</div>
            <div className="text-sm text-gray-300">Avg Temperature</div>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
            whileHover={{ y: -3, scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-yellow-400 mb-1">{chartData.earthLikeCount}</div>
            <div className="text-sm text-gray-300">Earth-like Temp</div>
          </motion.div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Temperature vs Habitability Scatter */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaTemperatureHigh className="text-red-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Temperature vs Habitability</h4>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Temperature"
                  unit=" K"
                  stroke="#9CA3AF"
                  label={{ value: 'Surface Temperature (K)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Habitability"
                  unit="%"
                  stroke="#9CA3AF"
                  label={{ value: 'Habitability Score (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine x={288} stroke="#22c55e" strokeDasharray="3 3" label="Earth Temp" />
                <ReferenceLine x={373} stroke="#eab308" strokeDasharray="3 3" label="Water Boiling" />
                <ReferenceLine x={273} stroke="#3b82f6" strokeDasharray="3 3" label="Water Freezing" />
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

          {/* Temperature Distribution */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaChartLine className="text-purple-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Temperature Range Analysis</h4>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.tempRanges}>
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
          {/* Success Rate by Temperature */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaSeedling className="text-emerald-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Habitability Success Rate</h4>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={chartData.successByTemp}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="range" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" unit="%" />
                <Tooltip />
                <Bar dataKey="successRate" fill="#3b82f6" name="Success Rate" opacity={0.7} />
                <Line 
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  name="Trend"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Temperature Category Distribution */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaFire className="text-orange-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Temperature Categories</h4>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData.tempRanges.filter(d => d.habitable + d.nonHabitable > 0)}
                  dataKey="habitable"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ range, habitable }) => `${range}: ${habitable}`}
                >
                  {chartData.tempRanges.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Temperature Insights */}
        <motion.div 
          className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <FaExclamationTriangle className="text-yellow-400" />
            Temperature Habitability Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-green-400 font-semibold mb-1">Optimal Range</div>
              <div className="text-gray-300">{chartData.optimalRange}</div>
              <div className="text-xs text-green-300 mt-1">Highest habitability</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-blue-400 font-semibold mb-1">Earth-like Planets</div>
              <div className="text-gray-300">{chartData.earthLikeHabitable}/{chartData.earthLikeCount}</div>
              <div className="text-xs text-blue-300 mt-1">Habitable in Earth range</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-yellow-400 font-semibold mb-1">Critical Threshold</div>
              <div className="text-gray-300">~400K</div>
              <div className="text-xs text-yellow-300 mt-1">Upper limit for life</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-cyan-400 font-semibold mb-1">Data Coverage</div>
              <div className="text-gray-300">{chartData.totalPredictions} planets</div>
              <div className="text-xs text-cyan-300 mt-1">Statistical significance</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlanetTempHabitabilityChart;