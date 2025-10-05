import React, { useMemo } from "react";
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ZAxis, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  ComposedChart, Area, ReferenceLine
} from "recharts";
import { motion } from "framer-motion";
import { 
  FaSpaceShuttle, 
  FaGlobeAmericas, 
  FaChartLine,
  FaRuler,
  FaSeedling,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaSatellite
} from "react-icons/fa";

const PlanetDistanceHabitabilityChart = ({ predictions }) => {
  // Advanced distance analytics calculations
  const chartData = useMemo(() => {
    if (!predictions || predictions.length === 0) return null;

    // Prepare bubble chart data
    const chartData = predictions.map((p) => ({
      name: p.planet,
      distance_ly: p.distance_ly || 0,
      habitability_score: p.habitability_score || 0,
      radius_earth: p.radius_earth || 1,
      temperature: p.temp_k || 300,
      mass: p.mass_earth || 1,
      label: p.habitability_label,
      size: Math.min((p.radius_earth || 1) * 15, 100) // Limit bubble size
    }));

    // Distance range analysis
    const distanceRanges = [
      { range: "0-100", min: 0, max: 100, habitable: 0, nonHabitable: 0, color: "#22c55e" },
      { range: "100-500", min: 100, max: 500, habitable: 0, nonHabitable: 0, color: "#3b82f6" },
      { range: "500-1000", min: 500, max: 1000, habitable: 0, nonHabitable: 0, color: "#8b5cf6" },
      { range: "1000-2000", min: 1000, max: 2000, habitable: 0, nonHabitable: 0, color: "#f59e0b" },
      { range: "2000+", min: 2000, max: Infinity, habitable: 0, nonHabitable: 0, color: "#ef4444" },
    ];

    predictions.forEach(p => {
      const distance = p.distance_ly || 0;
      const range = distanceRanges.find(r => distance >= r.min && distance < r.max);
      if (range) {
        if (p.habitability_label === 1) range.habitable++;
        else range.nonHabitable++;
      }
    });

    // Distance statistics
    const allDistances = predictions.map(p => p.distance_ly || 0).filter(d => d > 0);
    const avgDistance = allDistances.length > 0 ? allDistances.reduce((a, b) => a + b) / allDistances.length : 0;
    const minDistance = Math.min(...allDistances);
    const maxDistance = Math.max(...allDistances);

    // Success rate by distance
    const successByDistance = distanceRanges.map(range => ({
      range: range.range,
      successRate: range.habitable + range.nonHabitable > 0 
        ? (range.habitable / (range.habitable + range.nonHabitable)) * 100 
        : 0,
      totalPlanets: range.habitable + range.nonHabitable,
      avgDistance: (range.min + range.max) / 2,
      color: range.color
    }));

    // Nearby habitable planets (within 100 ly)
    const nearbyHabitable = predictions.filter(p => 
      p.distance_ly <= 100 && p.habitability_label === 1
    );

    return {
      bubbleData: chartData,
      distanceRanges,
      successByDistance,
      totalPredictions: predictions.length,
      habitableCount: predictions.filter(p => p.habitability_label === 1).length,
      avgDistance: avgDistance.toFixed(0),
      minDistance: minDistance.toFixed(0),
      maxDistance: maxDistance.toFixed(0),
      nearbyHabitableCount: nearbyHabitable.length,
      observationChallenge: maxDistance > 1000 ? "High" : "Moderate"
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
            <p className="text-blue-400">Distance: {data.distance_ly} ly</p>
            <p className="text-green-400">Habitability: {data.habitability_score}%</p>
            <p className="text-cyan-400">Radius: {data.radius_earth} R⊕</p>
            {data.temperature && <p className="text-orange-400">Temp: {data.temperature}K</p>}
            <p className={`text-sm ${data.label === 1 ? 'text-green-300' : 'text-red-300'}`}>
              Status: {data.label === 1 ? 'Habitable' : 'Non-Habitable'}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  if (!predictions || predictions.length === 0) {
    return (
      <motion.div 
        className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl mb-4">🌌</div>
        <h3 className="text-2xl font-bold text-gray-300 mb-2">No Distance Data</h3>
        <p className="text-gray-400">Make predictions to see distance analytics</p>
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
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
            <FaSpaceShuttle className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Distance Analytics</h3>
            <p className="text-gray-300">Relationship between distance and planetary habitability</p>
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
            <div className="text-2xl font-bold text-blue-400 mb-1">{chartData.avgDistance} ly</div>
            <div className="text-sm text-gray-300">Avg Distance</div>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
            whileHover={{ y: -3, scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-purple-400 mb-1">{chartData.nearbyHabitableCount}</div>
            <div className="text-sm text-gray-300">Nearby Habitable</div>
          </motion.div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Distance vs Habitability Bubble Chart */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaMapMarkerAlt className="text-blue-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Distance vs Habitability</h4>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  type="number"
                  dataKey="distance_ly"
                  name="Distance"
                  unit=" ly"
                  stroke="#9CA3AF"
                  label={{ value: 'Distance from Earth (Light Years)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  type="number"
                  dataKey="habitability_score"
                  name="Habitability"
                  unit="%"
                  stroke="#9CA3AF"
                  label={{ value: 'Habitability Score (%)', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis dataKey="radius_earth" range={[50, 300]} name="Planet Size" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine x={100} stroke="#22c55e" strokeDasharray="3 3" label="Nearby" />
                <ReferenceLine x={1000} stroke="#eab308" strokeDasharray="3 3" label="Distant" />
                <Scatter
                  name="Habitable Planets"
                  data={chartData.bubbleData.filter(d => d.label === 1)}
                  fill="#22c55e"
                  fillOpacity={0.7}
                />
                <Scatter
                  name="Non-Habitable Planets"
                  data={chartData.bubbleData.filter(d => d.label === 0)}
                  fill="#ef4444"
                  fillOpacity={0.7}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Distance Distribution */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaChartLine className="text-purple-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Distance Range Analysis</h4>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData.distanceRanges}>
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
          {/* Success Rate by Distance */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaSeedling className="text-emerald-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Habitability Success Rate</h4>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={chartData.successByDistance}>
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

          {/* Distance Category Distribution */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaSatellite className="text-cyan-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Distance Categories</h4>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData.distanceRanges.filter(d => d.habitable + d.nonHabitable > 0)}
                  dataKey="habitable"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ range, habitable }) => `${range}ly: ${habitable}`}
                >
                  {chartData.distanceRanges.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Distance Insights */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <FaExclamationTriangle className="text-yellow-400" />
            Distance Analysis Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-green-400 font-semibold mb-1">Nearby Range</div>
              <div className="text-gray-300">0-100 light years</div>
              <div className="text-xs text-green-300 mt-1">Best observation targets</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-blue-400 font-semibold mb-1">Observable Range</div>
              <div className="text-gray-300">Up to {chartData.maxDistance} ly</div>
              <div className="text-xs text-blue-300 mt-1">Current detection limit</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-yellow-400 font-semibold mb-1">Observation Challenge</div>
              <div className="text-gray-300">{chartData.observationChallenge}</div>
              <div className="text-xs text-yellow-300 mt-1">Based on max distance</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-cyan-400 font-semibold mb-1">Discovery Potential</div>
              <div className="text-gray-300">{chartData.nearbyHabitableCount} nearby</div>
              <div className="text-xs text-cyan-300 mt-1">Habitable planets within 100ly</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlanetDistanceHabitabilityChart;