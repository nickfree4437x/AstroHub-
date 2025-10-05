// src/components/habitability-predictor/HabitabilityDistributionChart.jsx
import React, { useMemo } from "react";
import { 
  PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  RadialBarChart, RadialBar, ComposedChart, Line,
  LabelList
} from "recharts";
import { motion } from "framer-motion";
import { FaChartPie, FaChartBar, FaGlobe, FaSeedling, FaFire } from "react-icons/fa";

const HabitabilityDistributionChart = ({ predictions }) => {
  // Advanced analytics calculations
  const chartData = useMemo(() => {
    if (!predictions || predictions.length === 0) {
      return null;
    }

    const habitableCount = predictions.filter((p) => p.habitability_label === 1).length;
    const nonHabitableCount = predictions.filter((p) => p.habitability_label === 0).length;
    const totalPredictions = predictions.length;
    
    // Calculate average scores
    const habitableAvgScore = predictions
      .filter(p => p.habitability_label === 1)
      .reduce((sum, p) => sum + (p.habitability_score || 0), 0) / habitableCount || 0;
    
    const nonHabitableAvgScore = predictions
      .filter(p => p.habitability_label === 0)
      .reduce((sum, p) => sum + (p.habitability_score || 0), 0) / nonHabitableCount || 0;

    // Score distribution
    const scoreRanges = [
      { range: "0-20", min: 0, max: 20, count: 0 },
      { range: "21-40", min: 21, max: 40, count: 0 },
      { range: "41-60", min: 41, max: 60, count: 0 },
      { range: "61-80", min: 61, max: 80, count: 0 },
      { range: "81-100", min: 81, max: 100, count: 0 },
    ];

    predictions.forEach(p => {
      const score = p.habitability_score || 0;
      if (score <= 20) scoreRanges[0].count++;
      else if (score <= 40) scoreRanges[1].count++;
      else if (score <= 60) scoreRanges[2].count++;
      else if (score <= 80) scoreRanges[3].count++;
      else scoreRanges[4].count++;
    });

    return {
      basicData: [
        { 
          name: "Habitable", 
          value: habitableCount,
          percentage: ((habitableCount / totalPredictions) * 100).toFixed(1),
          avgScore: habitableAvgScore.toFixed(1),
          color: "#22c55e"
        },
        { 
          name: "Non-Habitable", 
          value: nonHabitableCount,
          percentage: ((nonHabitableCount / totalPredictions) * 100).toFixed(1),
          avgScore: nonHabitableAvgScore.toFixed(1),
          color: "#ef4444"
        },
      ],
      scoreDistribution: scoreRanges,
      totalPredictions,
      habitablePercentage: ((habitableCount / totalPredictions) * 100).toFixed(1),
      metrics: {
        total: totalPredictions,
        habitable: habitableCount,
        nonHabitable: nonHabitableCount,
        avgHabitableScore: habitableAvgScore.toFixed(1),
        avgNonHabitableScore: nonHabitableAvgScore.toFixed(1)
      }
    };
  }, [predictions]);

  if (!predictions || predictions.length === 0) {
    return (
      <motion.div 
        className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl mb-4">🌌</div>
        <h3 className="text-2xl font-bold text-gray-300 mb-2">No Predictions Yet</h3>
        <p className="text-gray-400">Start analyzing planets to see distribution charts</p>
      </motion.div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl min-w-48">
          <p className="text-white font-semibold border-b border-white/20 pb-2 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-gray-300 text-sm">{entry.name}:</span>
              <span className="text-cyan-400 font-semibold">
                {entry.value}{entry.dataKey === 'percentage' ? '%' : ''}
              </span>
            </div>
          ))}
          {payload[0]?.payload?.avgScore && (
            <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-white/10">
              <span className="text-gray-300 text-sm">Avg Score:</span>
              <span className="text-yellow-400 font-semibold">
                {payload[0].payload.avgScore}%
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const RadialCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl">
          <p className="text-white font-semibold text-sm">{payload[0].payload.range}</p>
          <p className="text-cyan-400 text-sm">Planets: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/10 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
            <FaChartPie className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Habitability Analytics</h3>
            <p className="text-gray-300">Distribution and score analysis of predicted planets</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
            whileHover={{ y: -3, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-2xl font-bold text-cyan-400 mb-1">{chartData.metrics.total}</div>
            <div className="text-sm text-gray-300">Total Predictions</div>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
            whileHover={{ y: -3, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-2xl font-bold text-green-400 mb-1">{chartData.metrics.habitable}</div>
            <div className="text-sm text-gray-300">Habitable</div>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
            whileHover={{ y: -3, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-2xl font-bold text-red-400 mb-1">{chartData.metrics.nonHabitable}</div>
            <div className="text-sm text-gray-300">Non-Habitable</div>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
            whileHover={{ y: -3, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-2xl font-bold text-yellow-400 mb-1">{chartData.habitablePercentage}%</div>
            <div className="text-sm text-gray-300">Habitable Rate</div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Pie Chart */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaChartPie className="text-green-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Distribution Overview</h4>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.basicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}\n${percentage}%`}
                  labelLine={false}
                >
                  {chartData.basicData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="#1f2937"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value, entry) => (
                    <span className="text-gray-300 text-sm">
                      {value} ({chartData.basicData.find(d => d.name === value)?.percentage}%)
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Score Distribution Bar Chart */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaChartBar className="text-blue-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Score Distribution</h4>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="range" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip content={<RadialCustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
                >
                  <LabelList 
                    dataKey="count" 
                    position="top" 
                    fill="#ffffff"
                    fontSize={12}
                  />
                </Bar>
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#ec4899" 
                  strokeWidth={2}
                  dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radial Progress Chart */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaGlobe className="text-purple-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Habitability Score Analysis</h4>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart 
                innerRadius="20%" 
                outerRadius="90%" 
                data={chartData.basicData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar 
                  minAngle={15}
                  background
                  dataKey="avgScore"
                  cornerRadius={10}
                >
                  {chartData.basicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RadialBar>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  wrapperStyle={{ right: -20 }}
                  formatter={(value) => <span className="text-gray-300 text-sm">{value} Avg</span>}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Detailed Metrics */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaSeedling className="text-green-400 text-xl" />
              <h4 className="text-xl font-bold text-white">Detailed Metrics</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Average Habitable Score</span>
                </div>
                <span className="text-green-400 font-bold text-lg">
                  {chartData.metrics.avgHabitableScore}%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300">Average Non-Habitable Score</span>
                </div>
                <span className="text-red-400 font-bold text-lg">
                  {chartData.metrics.avgNonHabitableScore}%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <FaFire className="text-yellow-400 text-lg" />
                  <span className="text-gray-300">Success Rate</span>
                </div>
                <span className="text-yellow-400 font-bold text-lg">
                  {chartData.habitablePercentage}%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-gray-300">Data Confidence</span>
                </div>
                <span className="text-cyan-400 font-bold text-lg">
                  {chartData.totalPredictions > 10 ? "High" : "Moderate"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Prediction Insights */}
        <motion.div 
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <FaChartBar className="text-cyan-400" />
            Prediction Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-green-400">{chartData.habitablePercentage}%</div>
              <div className="text-sm text-gray-300">Habitable Planets</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-red-400">
                {(100 - parseFloat(chartData.habitablePercentage)).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-300">Non-Habitable</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.max(...chartData.scoreDistribution.map(s => s.count))}
              </div>
              <div className="text-sm text-gray-300">Peak Score Range</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-cyan-400">
                {chartData.totalPredictions}
              </div>
              <div className="text-sm text-gray-300">Total Analysis</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HabitabilityDistributionChart;