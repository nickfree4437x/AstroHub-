// src/components/Habitability/HabitabilityAnalytics.jsx
import React, { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart,
  ScatterChart, Scatter, ZAxis, Treemap, SunburstChart, RadialBarChart, RadialBar,
  Sankey, FunnelChart, Funnel, Brush, ReferenceLine, ErrorBar
} from "recharts";
import { motion } from "framer-motion";
import { 
  FaStar, FaChartBar, FaChartPie, FaChartLine, FaGlobe, 
  FaTemperatureHigh, FaRuler, FaWeightHanging, FaSeedling,
  FaMagnet, FaWater, FaWind, FaMountain, FaCloud,
  FaRadiation, FaCalendarAlt, FaRocket, FaMicroscope,
  FaExpandAlt, FaCompressAlt, FaFilter
} from "react-icons/fa";

export default function HabitabilityAnalytics({ planets, onFilterByStarType }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMetric, setSelectedMetric] = useState("all");

  // Enhanced metrics calculation
  const analyticsData = useMemo(() => {
    if (!planets.length) return {};

    // Basic scores
    const scores = planets.map(p => p.habitability?.score ?? 0);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // Advanced statistics
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const stdDev = Math.sqrt(scores.reduce((sq, n) => sq + Math.pow(n - averageScore, 2), 0) / scores.length);

    // Category counts
    const categories = {
      high: scores.filter(s => s >= 80).length,
      medium: scores.filter(s => s >= 50 && s < 80).length,
      low: scores.filter(s => s < 50).length,
      superEarth: planets.filter(p => (p.radius ?? 0) > 1.5 && (p.radius ?? 0) <= 2.5).length,
      gasGiant: planets.filter(p => (p.radius ?? 0) > 2.5).length,
      earthLike: planets.filter(p => (p.radius ?? 0) >= 0.8 && (p.radius ?? 0) <= 1.2).length,
    };

    return {
      averageScore: averageScore.toFixed(2),
      maxScore,
      minScore,
      stdDev: stdDev.toFixed(2),
      totalPlanets: planets.length,
      ...categories
    };
  }, [planets]);

  // Enhanced Star Type Distribution with habitability scores
  const starTypeAnalysis = useMemo(() => {
    const analysis = {};
    
    planets.forEach(p => {
      const type = p.starType ?? "Unknown";
      if (!analysis[type]) {
        analysis[type] = {
          count: 0,
          totalScore: 0,
          planets: [],
          avgRadius: 0,
          avgMass: 0
        };
      }
      
      analysis[type].count++;
      analysis[type].totalScore += p.habitability?.score ?? 0;
      analysis[type].planets.push(p);
      analysis[type].avgRadius += p.radius ?? 0;
      analysis[type].avgMass += p.mass ?? 0;
    });

    // Calculate averages
    Object.keys(analysis).forEach(type => {
      analysis[type].avgScore = (analysis[type].totalScore / analysis[type].count).toFixed(2);
      analysis[type].avgRadius = (analysis[type].avgRadius / analysis[type].count).toFixed(2);
      analysis[type].avgMass = (analysis[type].avgMass / analysis[type].count).toFixed(2);
    });

    return Object.entries(analysis).map(([name, data]) => ({
      name,
      count: data.count,
      avgScore: parseFloat(data.avgScore),
      avgRadius: parseFloat(data.avgRadius),
      avgMass: parseFloat(data.avgMass),
      value: data.count
    }));
  }, [planets]);

  // Multi-dimensional analysis data
  const multiDimensionalData = useMemo(() => {
    return planets.map(p => ({
      name: p.name,
      score: p.habitability?.score ?? 0,
      radius: p.radius ?? 1,
      mass: p.mass ?? 1,
      distance: p.distance ?? 1000,
      period: p.orbitalPeriod ?? 365,
      temperature: p.temperature ?? p.pl_eqt ?? 300,
      size: Math.log((p.radius ?? 1) * 10), // Logarithmic scale for better visualization
      habitability: p.habitability?.score ?? 0,
      starType: p.starType ?? "Unknown",
      discoveryYear: p.discoveryYear ?? 2000
    }));
  }, [planets]);

  // Advanced correlation matrix data
  const correlationData = useMemo(() => {
    const metrics = ['score', 'radius', 'mass', 'distance', 'period', 'temperature'];
    const correlations = [];
    
    metrics.forEach(metric1 => {
      metrics.forEach(metric2 => {
        if (metric1 !== metric2) {
          const values1 = multiDimensionalData.map(d => d[metric1]);
          const values2 = multiDimensionalData.map(d => d[metric2]);
          const correlation = calculateCorrelation(values1, values2);
          
          correlations.push({
            metric1,
            metric2,
            correlation: Math.abs(correlation),
            strength: getCorrelationStrength(correlation),
            direction: correlation > 0 ? 'positive' : 'negative'
          });
        }
      });
    });
    
    return correlations;
  }, [multiDimensionalData]);

  // Habitability factor breakdown across all planets
  const factorBreakdown = useMemo(() => {
    const factors = {};
    
    planets.forEach(p => {
      const breakdown = p.habitability?.breakdown || {};
      Object.entries(breakdown).forEach(([factor, data]) => {
        if (!factors[factor]) {
          factors[factor] = {
            total: 0,
            count: 0,
            min: 100,
            max: 0,
            values: []
          };
        }
        
        const value = data.score100 || data.contribution || 0;
        factors[factor].total += value;
        factors[factor].count++;
        factors[factor].min = Math.min(factors[factor].min, value);
        factors[factor].max = Math.max(factors[factor].max, value);
        factors[factor].values.push(value);
      });
    });

    return Object.entries(factors).map(([factor, data]) => ({
      factor,
      average: (data.total / data.count).toFixed(2),
      min: data.min,
      max: data.max,
      stdDev: calculateStdDev(data.values).toFixed(2),
      impact: (data.total / data.count) / 100 // Normalized impact
    }));
  }, [planets]);

  // Temporal analysis - discovery trends
  const temporalAnalysis = useMemo(() => {
    const yearData = {};
    const recentYears = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
    
    recentYears.forEach(year => {
      const yearPlanets = planets.filter(p => p.discoveryYear === year);
      if (yearPlanets.length > 0) {
        yearData[year] = {
          count: yearPlanets.length,
          avgScore: yearPlanets.reduce((sum, p) => sum + (p.habitability?.score ?? 0), 0) / yearPlanets.length,
          avgRadius: yearPlanets.reduce((sum, p) => sum + (p.radius ?? 0), 0) / yearPlanets.length,
          highScoreCount: yearPlanets.filter(p => (p.habitability?.score ?? 0) >= 80).length
        };
      }
    });

    return Object.entries(yearData).map(([year, data]) => ({
      year: parseInt(year),
      planets: data.count,
      avgScore: data.avgScore,
      avgRadius: data.avgRadius,
      highScoreRatio: (data.highScoreCount / data.count) * 100
    }));
  }, [planets]);

  // 3D Scatter plot data (simulated 3rd dimension with size)
  const scatter3DData = useMemo(() => {
    return planets.slice(0, 100).map(p => ({
      x: p.distance ?? 1000,
      y: p.habitability?.score ?? 50,
      z: p.radius ?? 1,
      size: (p.mass ?? 1) * 10,
      name: p.name,
      starType: p.starType ?? "Unknown",
      temperature: p.temperature ?? 300
    }));
  }, [planets]);

  // Radial progress chart for factor performance
  const radialChartData = useMemo(() => {
    return factorBreakdown.map(factor => ({
      factor: factor.factor,
      value: parseFloat(factor.average),
      fullMark: 100
    }));
  }, [factorBreakdown]);

  // Heatmap data for star type vs habitability
  const heatmapData = useMemo(() => {
    const scoreRanges = ['0-20', '21-40', '41-60', '61-80', '81-100'];
    const heatmap = {};
    
    starTypeAnalysis.forEach(star => {
      scoreRanges.forEach(range => {
        const [min, max] = range.split('-').map(Number);
        const count = planets.filter(p => 
          p.starType === star.name && 
          (p.habitability?.score ?? 0) >= min && 
          (p.habitability?.score ?? 0) <= max
        ).length;
        
        if (!heatmap[star.name]) heatmap[star.name] = {};
        heatmap[star.name][range] = count;
      });
    });

    return heatmap;
  }, [starTypeAnalysis, planets]);

  // Helper functions
  function calculateCorrelation(x, y) {
    const n = x.length;
    const sum_x = x.reduce((a, b) => a + b, 0);
    const sum_y = y.reduce((a, b) => a + b, 0);
    const sum_xy = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sum_x2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sum_y2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sum_xy - sum_x * sum_y;
    const denominator = Math.sqrt((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  function getCorrelationStrength(r) {
    const absR = Math.abs(r);
    if (absR >= 0.8) return 'Very Strong';
    if (absR >= 0.6) return 'Strong';
    if (absR >= 0.4) return 'Moderate';
    if (absR >= 0.2) return 'Weak';
    return 'Very Weak';
  }

  function calculateStdDev(values) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-2xl min-w-48">
          <p className="text-white font-semibold border-b border-white/20 pb-2 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-cyan-400 text-sm">
              <span className="text-gray-300">{entry.name}:</span> {entry.value}
              {entry.unit && <span className="text-gray-400 ml-1">{entry.unit}</span>}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const COLORS = ["#6366f1", "#ec4899", "#22c55e", "#f59e0b", "#8b5cf6", "#06b6d4", "#ef4444", "#84cc16", "#f97316", "#a855f7"];

  return (
    <motion.div 
      className="habitability-analytics backdrop-blur-xl bg-black/40 rounded-3xl p-6 border border-white/10 shadow-2xl space-y-8 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Planetary Habitability Analytics
        </h2>
        <p className="text-gray-300">Advanced multi-dimensional analysis of {planets.length} exoplanets</p>
        
        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span className="text-green-400 font-semibold">{analyticsData.averageScore}%</span>
            <span className="text-gray-400 text-sm ml-2">Avg Score</span>
          </div>
          <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span className="text-cyan-400 font-semibold">{analyticsData.high}</span>
            <span className="text-gray-400 text-sm ml-2">High Habitability</span>
          </div>
          <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span className="text-yellow-400 font-semibold">{analyticsData.earthLike}</span>
            <span className="text-gray-400 text-sm ml-2">Earth-like</span>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {[
          { id: "overview", label: "Overview", icon: <FaChartBar /> },
          { id: "multidimensional", label: "3D Analysis", icon: <FaExpandAlt /> },
          { id: "correlation", label: "Correlations", icon: <FaChartLine /> },
          { id: "factors", label: "Factors", icon: <FaMicroscope /> },
          { id: "temporal", label: "Trends", icon: <FaCalendarAlt /> },
          { id: "comparative", label: "Comparative", icon: <FaFilter /> },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-green-600 to-cyan-600 text-white shadow-lg"
                : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
            }`}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Overview Tab - Enhanced */}
      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: "Avg Score", value: analyticsData.averageScore, color: "text-green-400", icon: <FaStar /> },
              { label: "Max Score", value: analyticsData.maxScore, color: "text-emerald-400", icon: <FaChartBar /> },
              { label: "Std Dev", value: analyticsData.stdDev, color: "text-yellow-400", icon: <FaRuler /> },
              { label: "Earth-like", value: analyticsData.earthLike, color: "text-blue-400", icon: <FaGlobe /> },
              { label: "Super Earth", value: analyticsData.superEarth, color: "text-purple-400", icon: <FaMountain /> },
              { label: "Gas Giants", value: analyticsData.gasGiant, color: "text-red-400", icon: <FaWind /> },
            ].map((metric, index) => (
              <motion.div 
                key={metric.label}
                className="bg-white/5 backdrop-blur-md rounded-xl p-3 text-center border border-white/10"
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`text-lg font-bold ${metric.color} mb-1 flex items-center justify-center gap-2`}>
                  {metric.icon}
                  {metric.value}
                </div>
                <div className="text-xs text-gray-300">{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Star Type Analysis */}
            <motion.div 
              className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10"
              whileHover={{ y: -3 }}
            >
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                <FaStar />
                Star Type vs Habitability
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={starTypeAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="name" stroke="#D1D5DB" angle={-45} textAnchor="end" height={80} />
                  <YAxis yAxisId="left" stroke="#D1D5DB" />
                  <YAxis yAxisId="right" orientation="right" stroke="#ec4899" />
                  <ReTooltip content={<CustomTooltip />} />
                  <Bar yAxisId="left" dataKey="count" fill="#6366f1" opacity={0.6} name="Planet Count" />
                  <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#ec4899" strokeWidth={2} name="Avg Score" dot={{ fill: '#ec4899' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Radial Progress Chart */}
            <motion.div 
              className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10"
              whileHover={{ y: -3 }}
            >
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                <FaChartPie />
                Factor Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart innerRadius="20%" outerRadius="90%" data={radialChartData} startAngle={180} endAngle={0}>
                  <RadialBar minAngle={15} background dataKey="value" cornerRadius={10}>
                    {radialChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </RadialBar>
                  <ReTooltip content={<CustomTooltip />} />
                  <Legend />
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                </RadialBarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* 3D/Multidimensional Analysis Tab */}
      {activeTab === "multidimensional" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* 3D Scatter Plot */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <FaExpandAlt />
              3D Planetary Analysis (Distance vs Score vs Size)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={scatter3DData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Distance" 
                  unit=" ly" 
                  stroke="#D1D5DB"
                  label={{ value: 'Distance (light years)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Habitability" 
                  unit="%" 
                  stroke="#D1D5DB"
                  label={{ value: 'Habitability Score (%)', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis 
                  type="number" 
                  dataKey="z" 
                  name="Radius" 
                  unit=" R⊕" 
                  range={[50, 300]}
                />
                <ReTooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Planets" data={scatter3DData} fill="#22c55e">
                  {scatter3DData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Multi-axis Composed Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10"
              whileHover={{ y: -3 }}
            >
              <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                <FaRuler />
                Multi-Axis Planetary Metrics
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={multiDimensionalData.slice(0, 20)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="name" stroke="#D1D5DB" angle={-45} textAnchor="end" height={60} />
                  <YAxis yAxisId="left" stroke="#D1D5DB" name="Score" unit="%" />
                  <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" name="Radius" unit=" R⊕" />
                  <ReTooltip content={<CustomTooltip />} />
                  <Bar yAxisId="left" dataKey="score" fill="#6366f1" name="Habitability Score" />
                  <Line yAxisId="right" type="monotone" dataKey="radius" stroke="#f59e0b" name="Radius" />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div 
              className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10"
              whileHover={{ y: -3 }}
            >
              <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                <FaTemperatureHigh />
                Temperature Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={multiDimensionalData.sort((a, b) => a.temperature - b.temperature)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="temperature" stroke="#D1D5DB" name="Temperature" unit="K" />
                  <YAxis stroke="#D1D5DB" />
                  <ReTooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="score" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Habitability Score" />
                  <ReferenceLine y={50} stroke="#22c55e" strokeDasharray="3 3" label="Avg Score" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Correlation Matrix Tab */}
      {activeTab === "correlation" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Correlation Heatmap */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <FaChartLine />
              Metric Correlation Matrix
            </h3>
            <div className="grid grid-cols-6 gap-2 mb-4">
              <div className="col-span-1"></div>
              {['Score', 'Radius', 'Mass', 'Distance', 'Period', 'Temp'].map(metric => (
                <div key={metric} className="text-center text-sm font-semibold text-gray-300">
                  {metric}
                </div>
              ))}
              
              {correlationData.filter(corr => corr.metric1 === 'score').map((corr, index) => (
                <React.Fragment key={corr.metric2}>
                  <div className="text-right text-sm font-semibold text-gray-300 pr-2">
                    {corr.metric2.charAt(0).toUpperCase() + corr.metric2.slice(1)}
                  </div>
                  {Array(6).fill(0).map((_, colIndex) => {
                    const targetMetric = ['score', 'radius', 'mass', 'distance', 'period', 'temperature'][colIndex];
                    const correlation = correlationData.find(c => 
                      c.metric1 === corr.metric2 && c.metric2 === targetMetric
                    );
                    
                    return correlation ? (
                      <div 
                        key={colIndex}
                        className={`text-center text-xs p-2 rounded ${
                          correlation.correlation > 0.7 ? 'bg-green-500/20 text-green-300' :
                          correlation.correlation > 0.5 ? 'bg-blue-500/20 text-blue-300' :
                          correlation.correlation > 0.3 ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-gray-500/20 text-gray-300'
                        } border border-white/10 cursor-help`}
                        title={`${correlation.strength} ${correlation.direction} correlation`}
                      >
                        {correlation.correlation.toFixed(2)}
                      </div>
                    ) : (
                      <div key={colIndex} className="text-center text-xs p-2 bg-gray-500/10 rounded border border-white/5">-</div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Scatter Matrix */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
              <FaMicroscope />
              Scatter Plot Matrix - Score vs Physical Properties
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { x: 'radius', y: 'score', color: '#6366f1', name: 'Radius vs Score' },
                { x: 'mass', y: 'score', color: '#ec4899', name: 'Mass vs Score' },
                { x: 'distance', y: 'score', color: '#22c55e', name: 'Distance vs Score' },
                { x: 'period', y: 'score', color: '#f59e0b', name: 'Orbital Period vs Score' },
                { x: 'temperature', y: 'score', color: '#ef4444', name: 'Temperature vs Score' },
                { x: 'radius', y: 'mass', color: '#8b5cf6', name: 'Radius vs Mass' },
              ].map((plot, index) => (
                <motion.div 
                  key={plot.name}
                  className="bg-black/20 rounded-lg p-3 border border-white/5"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">{plot.name}</h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <ScatterChart data={multiDimensionalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                      <XAxis dataKey={plot.x} tick={false} axisLine={false} />
                      <YAxis dataKey={plot.y} tick={false} axisLine={false} />
                      <ReTooltip content={<CustomTooltip />} />
                      <Scatter data={multiDimensionalData} fill={plot.color} opacity={0.6} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Factors Analysis Tab */}
      {activeTab === "factors" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Factor Breakdown Radar */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <FaChartPie />
              Habitability Factor Analysis
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={factorBreakdown}>
                <PolarGrid stroke="#4B5563" />
                <PolarAngleAxis dataKey="factor" stroke="#D1D5DB" />
                <PolarRadiusAxis stroke="#9CA3AF" angle={30} domain={[0, 100]} />
                <Radar
                  name="Average Score"
                  dataKey="average"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Maximum"
                  dataKey="max"
                  stroke="#ec4899"
                  fill="#ec4899"
                  fillOpacity={0.1}
                />
                <ReTooltip content={<CustomTooltip />} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Factor Impact Treemap */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <FaSeedling />
              Factor Impact Visualization
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={factorBreakdown}
                dataKey="impact"
                aspectRatio={4/3}
                stroke="#fff"
                fill="#8884d8"
              >
                <ReTooltip content={<CustomTooltip />} />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Temporal Analysis Tab */}
      {activeTab === "temporal" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Discovery Trends */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
              <FaCalendarAlt />
              Discovery Trends & Habitability Evolution
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={temporalAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="year" stroke="#D1D5DB" />
                <YAxis yAxisId="left" stroke="#D1D5DB" name="Count" />
                <YAxis yAxisId="right" orientation="right" stroke="#ec4899" name="Score" />
                <ReTooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="planets" fill="#6366f1" name="Planets Discovered" opacity={0.6} />
                <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#ec4899" name="Average Score" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="highScoreRatio" stroke="#22c55e" name="High Score %" strokeWidth={2} strokeDasharray="3 3" />
                <Brush dataKey="year" height={30} stroke="#8884d8" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Comparative Analysis Tab */}
      {activeTab === "comparative" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Star Type Comparison */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
              <FaFilter />
              Comparative Analysis by Star Type
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={starTypeAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="name" stroke="#D1D5DB" />
                <YAxis yAxisId="left" stroke="#D1D5DB" name="Average" />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" name="Radius" />
                <ReTooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="avgScore" fill="#6366f1" name="Avg Habitability" />
                <Line yAxisId="right" type="monotone" dataKey="avgRadius" stroke="#f59e0b" name="Avg Radius" strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="avgMass" stroke="#ec4899" name="Avg Mass" strokeWidth={2} strokeDasharray="3 3" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Funnel Chart for Habitability Categories */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
              <FaRocket />
              Habitability Category Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <FunnelChart data={[
                { name: 'High (80-100%)', value: analyticsData.high, fill: '#22c55e' },
                { name: 'Medium (50-79%)', value: analyticsData.medium, fill: '#f59e0b' },
                { name: 'Low (0-49%)', value: analyticsData.low, fill: '#ef4444' },
              ]}>
                <ReTooltip />
                <Funnel dataKey="value" data={[
                  { name: 'High (80-100%)', value: analyticsData.high, fill: '#22c55e' },
                  { name: 'Medium (50-79%)', value: analyticsData.medium, fill: '#f59e0b' },
                  { name: 'Low (0-49%)', value: analyticsData.low, fill: '#ef4444' },
                ]} />
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}