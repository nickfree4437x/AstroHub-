// src/components/MissionAnalytics.jsx
import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  Legend
} from "recharts";
import { 
  FaRocket, 
  FaGlobeAmericas, 
  FaCalendarAlt, 
  FaChartLine,
  FaMoneyBillWave,
  FaClock,
  FaSpaceShuttle,
  FaFilter
} from "react-icons/fa";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#0088FE", "#FF4444", "#82ca9d", "#ffc658"];

export default function MissionAnalytics({ missions = [], onFilterClick }) {
  const [activeFilter, setActiveFilter] = useState(null);

  if (!missions.length) {
    return (
      <div className="text-center py-12 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
        <FaRocket className="text-4xl text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No missions data available for analytics</p>
      </div>
    );
  }

  // Enhanced data processing
  const analyticsData = useMemo(() => {
    // Agency Distribution
    const agencyCount = missions.reduce((acc, m) => {
      const key = m.agency || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const agencyData = Object.entries(agencyCount).map(([name, value]) => ({ name, value }));

    // Decade Distribution
    const decadeCount = missions.reduce((acc, m) => {
      const year = m.launchDate ? new Date(m.launchDate).getFullYear() : 0;
      const decade = year ? Math.floor(year / 10) * 10 + "s" : "Unknown";
      acc[decade] = (acc[decade] || 0) + 1;
      return acc;
    }, {});
    const decadeData = Object.entries(decadeCount).map(([decade, value]) => ({ decade, value }));

    // Cumulative Growth
    const yearlyCount = missions.reduce((acc, m) => {
      const year = m.launchDate ? new Date(m.launchDate).getFullYear() : "Unknown";
      if (year !== "Unknown") {
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {});
    let total = 0;
    const lineData = Object.entries(yearlyCount)
      .sort((a, b) => a[0] - b[0])
      .map(([year, count]) => {
        total += count;
        return { year, count, total };
      });

    // Destination Analysis
    const destinationCount = missions.reduce((acc, m) => {
      const key = m.destination || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const destinationData = Object.entries(destinationCount).map(([name, value]) => ({ name, value }));

    // Status Distribution
    const statusCount = missions.reduce((acc, m) => {
      const status = m.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    const statusData = Object.entries(statusCount).map(([status, count]) => ({ status, count }));

    // Cost Analysis (if available)
    const costData = missions
      .filter(m => m.cost && m.cost !== "N/A")
      .map(m => ({
        name: m.name,
        cost: typeof m.cost === 'string' ? parseFloat(m.cost.replace(/[^0-9.]/g, '')) || 0 : m.cost,
        agency: m.agency,
        year: m.launchDate ? new Date(m.launchDate).getFullYear() : 'Unknown'
      }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10);

    // Duration Analysis
    const durationData = missions
      .filter(m => m.duration && m.duration !== "N/A")
      .map(m => ({
        name: m.name,
        duration: typeof m.duration === 'string' ? parseInt(m.duration) || 0 : m.duration,
        destination: m.destination
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 8);

    // Mission Success Rate by Agency
    const agencySuccess = missions.reduce((acc, m) => {
      const agency = m.agency || "Unknown";
      if (!acc[agency]) {
        acc[agency] = { total: 0, successful: 0 };
      }
      acc[agency].total++;
      if (m.status?.toLowerCase().includes('success')) {
        acc[agency].successful++;
      }
      return acc;
    }, {});
    const successRateData = Object.entries(agencySuccess).map(([agency, data]) => ({
      agency,
      successRate: (data.successful / data.total) * 100,
      total: data.total
    }));

    // Monthly Launch Distribution
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(2020, i, 1).toLocaleString('default', { month: 'short' });
      const count = missions.filter(m => {
        if (!m.launchDate) return false;
        const date = new Date(m.launchDate);
        return date.getMonth() === i;
      }).length;
      return { month, count };
    });

    return {
      agencyData,
      decadeData,
      lineData,
      destinationData,
      statusData,
      costData,
      durationData,
      successRateData,
      monthlyData
    };
  }, [missions]);

  const handleChartClick = (data, filterType) => {
    if (data && data.activePayload && onFilterClick) {
      const filterValue = data.activePayload[0]?.payload?.name || 
                         data.activePayload[0]?.payload?.agency ||
                         data.activePayload[0]?.payload?.decade;
      if (filterValue) {
        setActiveFilter({ type: filterType, value: filterValue });
        onFilterClick({ [filterType.toLowerCase()]: filterValue });
      }
    }
  };

  const ChartCard = ({ title, icon, children, filterType, className = "" }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-3">
          {icon}
          {title}
        </h3>
        {filterType && activeFilter?.type === filterType && (
          <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg">
            Filtered
          </span>
        )}
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 rounded-2xl border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-400">{missions.length}</div>
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <FaRocket className="text-blue-400" />
            Total Missions
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 rounded-2xl border border-green-500/30">
          <div className="text-2xl font-bold text-green-400">
            {new Set(missions.map(m => m.agency)).size}
          </div>
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <FaGlobeAmericas className="text-green-400" />
            Agencies
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-4 rounded-2xl border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-400">
            {new Set(missions.map(m => m.destination)).size}
          </div>
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <FaSpaceShuttle className="text-purple-400" />
            Destinations
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-4 rounded-2xl border border-orange-500/30">
          <div className="text-2xl font-bold text-orange-400">
            {Math.max(...missions.map(m => new Date(m.launchDate).getFullYear()))}
          </div>
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <FaCalendarAlt className="text-orange-400" />
            Latest Year
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agency Distribution */}
        <ChartCard 
          title="Missions by Agency" 
          icon={<FaGlobeAmericas className="text-blue-400" />}
          filterType="agency"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.agencyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                dataKey="value"
                onClick={(data) => handleChartClick(data, "agency")}
              >
                {analyticsData.agencyData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Success Rate Radar */}
        <ChartCard 
          title="Success Rate by Agency" 
          icon={<FaChartLine className="text-green-400" />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={analyticsData.successRateData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="agency" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Success Rate"
                dataKey="successRate"
                stroke="#00C49F"
                fill="#00C49F"
                fillOpacity={0.6}
              />
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, "Success Rate"]} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cumulative Growth */}
        <ChartCard 
          title="Missions Growth Over Time" 
          icon={<FaChartLine className="text-purple-400" />}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="year" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              <Line type="monotone" dataKey="count" stroke="#FFBB28" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Monthly Distribution */}
        <ChartCard 
          title="Monthly Launch Distribution" 
          icon={<FaCalendarAlt className="text-orange-400" />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.monthlyData}>
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="count" fill="#FF8042" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Mission Status */}
        <ChartCard 
          title="Mission Status Distribution" 
          icon={<FaRocket className="text-red-400" />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.statusData} layout="vertical">
              <XAxis type="number" stroke="#fff" />
              <YAxis type="category" dataKey="status" stroke="#fff" width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#FF4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Cost Missions */}
        {analyticsData.costData.length > 0 && (
          <ChartCard 
            title="Top 10 Most Expensive Missions" 
            icon={<FaMoneyBillWave className="text-yellow-400" />}
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={analyticsData.costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#fff" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#fff" />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Cost"]} />
                <Bar dataKey="cost" fill="#FFBB28" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="cost" stroke="#FF8042" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Mission Duration */}
        {analyticsData.durationData.length > 0 && (
          <ChartCard 
            title="Longest Mission Durations" 
            icon={<FaClock className="text-cyan-400" />}
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={analyticsData.durationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#fff" angle={-45} textAnchor="end" height={80} />
                <YAxis dataKey="duration" stroke="#fff" unit=" days" />
                <Tooltip formatter={(value) => [`${value} days`, "Duration"]} />
                <Scatter dataKey="duration" fill="#00C49F" />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>
    </div>
  );
}