import React from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const HabitabilityGauge = ({ score }) => {
  // Ensure score is between 0–100
  const value = Math.max(0, Math.min(100, score || 0));
  
  const data = [
    {
      name: "Habitability",
      value: value,
      fill: value >= 80 ? "#22c55e" : value >= 50 ? "#eab308" : "#ef4444",
    },
  ];

  const getStatusText = (score) => {
    if (score >= 80) return "Highly Habitable";
    if (score >= 50) return "Moderately Habitable";
    if (score >= 20) return "Marginally Habitable";
    return "Non-Habitable";
  };

  const getStatusColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    if (score >= 20) return "text-orange-400";
    return "text-red-400";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-white">Habitability Score</p>
          <p className="text-cyan-400">{payload[0].value}%</p>
          <p className="text-gray-300 text-sm">{getStatusText(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Habitability Score</h3>
        <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto"></div>
      </div>

      <div className="flex flex-col items-center">
        {/* Gauge Chart */}
        <div className="relative w-48 h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="75%"
              outerRadius="100%"
              data={data}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                minAngle={15}
                clockWise
                dataKey="value"
                cornerRadius={8}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-white">{value}%</div>
            <div className="text-sm text-gray-400">Score</div>
          </div>
        </div>

        {/* Status Information */}
        <div className="text-center space-y-3">
          <div className={`text-lg font-semibold ${getStatusColor(value)}`}>
            {getStatusText(value)}
          </div>
          
          {/* Score Ranges */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="text-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
              <div>0-20</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
              <div>21-50</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
              <div>51-80</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
              <div>81-100</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-gray-300 mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            {value >= 80 && "Excellent conditions for potential life"}
            {value >= 50 && value < 80 && "Moderate potential for habitability"}
            {value >= 20 && value < 50 && "Limited habitability potential"}
            {value < 20 && "Challenging conditions for life"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitabilityGauge;