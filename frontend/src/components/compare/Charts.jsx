// src/components/compare/Charts.jsx
import React, { useState, useMemo } from "react";
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, CartesianGrid, ReferenceLine
} from "recharts";
import { 
  FaChartBar, 
  FaChartLine, 
  FaChartArea, 
  FaChartPie,
  FaExpand,
  FaDownload,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaBullseye,
  FaDotCircle
} from "react-icons/fa";

const chartTypes = [
  { id: 'radar', label: 'Radar', icon: FaBullseye, color: '#8884d8' },
  { id: 'bar', label: 'Bar', icon: FaChartBar, color: '#82ca9d' },
  { id: 'line', label: 'Trend', icon: FaChartLine, color: '#ff7300' },
  { id: 'area', label: 'Area', icon: FaChartArea, color: '#0088fe' },
  { id: 'pie', label: 'Distribution', icon: FaChartPie, color: '#ffc658' },
  { id: 'scatter', label: 'Correlation', icon: FaDotCircle, color: '#00C49F' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function Charts({ radarData, barData, planet, highlightMetric }) {
  const [activeChart, setActiveChart] = useState('radar');
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Enhanced data processing for different chart types
  const processedData = useMemo(() => {
    if (!radarData.length) return [];
    
    return radarData.map(item => ({
      ...item,
      difference: Math.abs(item.Planet - item.Earth),
      percentageDiff: ((item.Planet - item.Earth) / item.Earth * 100).toFixed(1),
      similarity: 100 - Math.abs((item.Planet - item.Earth) / item.Earth * 100)
    }));
  }, [radarData]);

  // Pie chart data for similarity distribution
  const pieData = useMemo(() => {
    return processedData.map(item => ({
      name: item.metric,
      value: Math.max(0, Math.min(100, item.similarity)),
      difference: item.difference
    }));
  }, [processedData]);

  // Trend data for line chart
  const trendData = useMemo(() => {
    return processedData.map((item, index) => ({
      metric: item.metric,
      Earth: item.Earth,
      Planet: item.Planet,
      index: index
    }));
  }, [processedData]);

  // Scatter plot data for correlation analysis
  const scatterData = useMemo(() => {
    return processedData.map(item => ({
      x: item.Earth,
      y: item.Planet,
      metric: item.metric,
      difference: item.difference
    }));
  }, [processedData]);

  const ChartComponent = () => {
    switch (activeChart) {
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={processedData}>
              <PolarGrid 
                stroke="#374151" 
                strokeWidth={0.5}
                polarRadius={[0, 25, 50, 75, 100]}
              />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fill: '#D1D5DB', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]}
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
              />
              <Radar 
                name="Earth" 
                dataKey="Earth" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar 
                name={planet?.name || 'Planet'} 
                dataKey="Planet" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                iconSize={10}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={processedData}>
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis 
                dataKey="metric" 
                tick={{ fill: '#D1D5DB', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                domain={[0, 'dataMax + 10']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              <Bar 
                dataKey="Earth" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                name="Earth Reference"
              />
              <Bar 
                dataKey="Planet" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
                name={planet?.name || 'Selected Planet'}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis 
                dataKey="metric" 
                tick={{ fill: '#D1D5DB', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Earth" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Earth Trend"
              />
              <Line 
                type="monotone" 
                dataKey="Planet" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name={`${planet?.name} Trend`}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="earthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="planetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis 
                dataKey="metric" 
                tick={{ fill: '#D1D5DB', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="Earth" 
                stroke="#3B82F6" 
                fill="url(#earthGradient)" 
                strokeWidth={2}
                name="Earth Area"
              />
              <Area 
                type="monotone" 
                dataKey="Planet" 
                stroke="#10B981" 
                fill="url(#planetGradient)" 
                strokeWidth={2}
                name={`${planet?.name} Area`}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <div className="flex flex-col lg:flex-row items-center justify-center h-400">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="lg:ml-8 mt-4 lg:mt-0">
              <h4 className="text-lg font-semibold text-gray-200 mb-3">Similarity Distribution</h4>
              <div className="space-y-2">
                {pieData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-gray-300 text-sm">{item.name}</span>
                    <span className="text-gray-400 text-sm ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={scatterData}>
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Earth Value"
                tick={{ fill: '#D1D5DB', fontSize: 10 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Planet Value"
                tick={{ fill: '#D1D5DB', fontSize: 10 }}
              />
              <ReferenceLine y={100} stroke="#374151" strokeDasharray="3 3" />
              <ReferenceLine x={100} stroke="#374151" strokeDasharray="3 3" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value, name) => [value, name === 'x' ? 'Earth' : 'Planet']}
              />
              <Scatter 
                name="Comparison Points" 
                dataKey="y" 
                fill="#00C49F"
                shape={(props) => {
                  const { cx, cy, payload } = props;
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={8} fill="#00C49F" fillOpacity={0.7} />
                      <text x={cx} y={cy} dy={-12} textAnchor="middle" fill="#F9FAFB" fontSize={10}>
                        {payload.metric}
                      </text>
                    </g>
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const chartsPerPage = 4;
  const totalPages = Math.ceil(chartTypes.length / chartsPerPage);
  const startIndex = currentPage * chartsPerPage;
  const visibleCharts = chartTypes.slice(startIndex, startIndex + chartsPerPage);

  return (
    <div className={`space-y-6 ${isExpanded ? 'fixed inset-0 z-50 bg-gray-900 p-6' : ''}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Advanced Analytics
          </h2>
          <p className="text-gray-400">Multiple visualization types for comprehensive analysis</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
          >
            <FaExpand className="text-gray-300" />
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-200">Chart Types</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-2 bg-gray-700/50 rounded-lg disabled:opacity-30"
            >
              <FaChevronLeft className="text-gray-300" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-2 bg-gray-700/50 rounded-lg disabled:opacity-30"
            >
              <FaChevronRight className="text-gray-300" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {visibleCharts.map((chart) => {
            const IconComponent = chart.icon;
            return (
              <button
                key={chart.id}
                onClick={() => setActiveChart(chart.id)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  activeChart === chart.id
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 shadow-lg'
                    : 'bg-gray-700/30 hover:bg-gray-600/50'
                }`}
              >
                <IconComponent className={`text-lg ${activeChart === chart.id ? 'text-white' : 'text-gray-300'}`} />
                <span className={`font-medium ${activeChart === chart.id ? 'text-white' : 'text-gray-300'}`}>
                  {chart.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart Display */}
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm rounded-3xl p-6 border border-gray-700 shadow-xl">
        <ChartComponent />
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 p-4 rounded-xl border border-blue-500/20">
          <h4 className="text-sm text-blue-300 mb-2">Average Similarity</h4>
          <p className="text-2xl font-bold text-white">
            {pieData.length ? (pieData.reduce((sum, item) => sum + item.value, 0) / pieData.length).toFixed(1) : 0}%
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 p-4 rounded-xl border border-green-500/20">
          <h4 className="text-sm text-green-300 mb-2">Closest Metric</h4>
          <p className="text-lg font-semibold text-white">
            {pieData.length ? pieData.reduce((max, item) => item.value > max.value ? item : max).name : 'N/A'}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 p-4 rounded-xl border border-purple-500/20">
          <h4 className="text-sm text-purple-300 mb-2">Largest Difference</h4>
          <p className="text-lg font-semibold text-white">
            {processedData.length ? processedData.reduce((max, item) => item.difference > max.difference ? item : max).metric : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}