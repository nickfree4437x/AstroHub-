// src/components/compare/DataCards.jsx
import React from "react";
import FunFactTooltip from "./FunFactTooltip";
import { EARTH, computeGravityG, kToC } from "../../utils/earth";
import { 
  FaGlobeAmericas, 
  FaRocket, 
  FaChartLine, 
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaEquals,
  FaTemperatureHigh,
  FaRuler,
  FaWeight,
  FaStar,
  FaCloud,
  FaSun,
  FaCircle,
  FaRoute
} from "react-icons/fa";

const metricIcons = {
  Gravity: FaWeight,
  Temp: FaTemperatureHigh,
  Orbit: FaRoute, // Using FaRoute as alternative for Orbit
  Radius: FaRuler,
  Mass: FaWeight,
  "Star Type": FaStar,
  Atmosphere: FaCloud,
  "Stellar Activity": FaSun
};

const metricColors = {
  Gravity: "from-purple-500 to-purple-600",
  Temp: "from-red-500 to-orange-500",
  Orbit: "from-blue-500 to-cyan-500",
  Radius: "from-green-500 to-emerald-500",
  Mass: "from-yellow-500 to-amber-500",
  "Star Type": "from-pink-500 to-rose-500",
  Atmosphere: "from-teal-500 to-cyan-500",
  "Stellar Activity": "from-orange-500 to-red-500"
};

export default function DataCards({ planet, selectedMetrics, loading, showPercentDifference, showTrendArrow, funFacts }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-300">Loading planetary data...</span>
      </div>
    );
  }

  if (!planet) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 opacity-50">
          <FaRocket className="w-full h-full text-gray-400" />
        </div>
        <p className="text-gray-400 text-lg">Select a planet to compare with Earth</p>
      </div>
    );
  }

  const planetData = {
    Gravity: computeGravityG(planet.mass, planet.radius)?.toFixed(2) + " g",
    Temp: planet.teqK ? kToC(planet.teqK).toFixed(0) + " °C" : "N/A",
    Orbit: planet.orbitalPeriod ? planet.orbitalPeriod + " days" : "N/A",
    Radius: planet.radius ? planet.radius + " R⊕" : "N/A",
    Mass: planet.mass ? planet.mass + " M⊕" : "N/A",
    "Star Type": planet.starType || "N/A",
    Atmosphere: planet.atmosphere || "Unknown",
    "Stellar Activity": planet.stellarActivity || "Unknown"
  };

  const getPercentDiff = (metric) => {
    const planetVal = parseFloat(planetData[metric]);
    const earthVal = {
      Gravity: EARTH.gravityG,
      Temp: 15,
      Orbit: EARTH.orbitDays,
      Radius: EARTH.radiusRe,
      Mass: EARTH.massMe
    }[metric];
    if (!planetVal || !earthVal) return null;
    return (((planetVal - earthVal) / earthVal) * 100).toFixed(1);
  };

  const getDifferenceIcon = (percentDiff) => {
    if (!percentDiff) return null;
    const diff = parseFloat(percentDiff);
    if (diff > 5) return <FaArrowUp className="text-red-400" />;
    if (diff < -5) return <FaArrowDown className="text-blue-400" />;
    return <FaEquals className="text-green-400" />;
  };

  const getDifferenceColor = (percentDiff) => {
    if (!percentDiff) return "text-gray-400";
    const diff = parseFloat(percentDiff);
    if (diff > 10) return "text-red-400";
    if (diff > 5) return "text-orange-400";
    if (diff < -10) return "text-blue-400";
    if (diff < -5) return "text-cyan-400";
    return "text-green-400";
  };

  const MetricCard = ({ metric, earthValue, planetValue, isEarth = false }) => {
    const IconComponent = metricIcons[metric];
    const percentDiff = showPercentDifference ? getPercentDiff(metric) : null;
    const differenceIcon = getDifferenceIcon(percentDiff);
    const differenceColor = getDifferenceColor(percentDiff);

    return (
      <div className={`relative group ${isEarth ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/20' : 'bg-gradient-to-br from-purple-900/30 to-purple-800/20'} backdrop-blur-sm border ${isEarth ? 'border-blue-700/30' : 'border-purple-700/30'} rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${metricColors[metric]} shadow-lg`}>
              <IconComponent className="text-white text-sm" />
            </div>
            <span className="font-semibold text-gray-200">{metric}</span>
          </div>
          {funFacts[metric] && <FunFactTooltip text={funFacts[metric]} />}
        </div>

        {/* Values */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Earth</span>
            <span className="text-blue-300 font-medium">{earthValue}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">{isEarth ? "Earth" : planet.name}</span>
            <span className={`font-medium ${isEarth ? 'text-blue-300' : 'text-purple-300'}`}>
              {planetValue}
            </span>
          </div>
        </div>

        {/* Difference Indicator */}
        {percentDiff && !isEarth && (
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Difference</span>
              <div className="flex items-center gap-1">
                {differenceIcon}
                <span className={`text-xs font-medium ${differenceColor}`}>
                  {Math.abs(percentDiff)}%
                </span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-2">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  Math.abs(percentDiff) > 10 ? 'bg-red-400' : 
                  Math.abs(percentDiff) > 5 ? 'bg-orange-400' : 'bg-green-400'
                }`}
                style={{ width: `${Math.min(Math.abs(percentDiff), 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    );
  };

  const earthData = {
    Gravity: EARTH.gravityG + " g",
    Temp: "15 °C",
    Orbit: EARTH.orbitDays + " days",
    Radius: EARTH.radiusRe + " R⊕",
    Mass: EARTH.massMe + " M⊕",
    "Star Type": EARTH.starType,
    Atmosphere: EARTH.atmosphere || "N2-O2",
    "Stellar Activity": EARTH.stellarActivity || "Normal"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Planetary Comparison
        </h2>
        <p className="text-gray-400">Detailed metrics comparison between Earth and {planet.name}</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earth Card */}
        <div className="relative">
          <div className="absolute -top-2 -left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
            Reference
          </div>
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm border-2 border-blue-500/30 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-2xl">
                <FaGlobeAmericas className="text-3xl text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Earth</h3>
                <p className="text-blue-300">Our Home Planet</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMetrics.map(metric => (
                <MetricCard
                  key={`earth-${metric}`}
                  metric={metric}
                  earthValue={earthData[metric]}
                  planetValue={earthData[metric]}
                  isEarth={true}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Planet Card */}
        <div className="relative">
          <div className="absolute -top-2 -left-2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
            Exoplanet
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 backdrop-blur-sm border-2 border-purple-500/30 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-2xl">
                <FaRocket className="text-3xl text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{planet.name}</h3>
                <p className="text-purple-300">Discovered Exoplanet</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMetrics.map(metric => (
                <MetricCard
                  key={`planet-${metric}`}
                  metric={metric}
                  earthValue={earthData[metric]}
                  planetValue={planetData[metric]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartLine className="text-green-400" />
          Quick Comparison Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedMetrics.slice(0, 4).map(metric => {
            const percentDiff = getPercentDiff(metric);
            return (
              <div key={`summary-${metric}`} className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {percentDiff ? `${Math.abs(percentDiff)}%` : "N/A"}
                </div>
                <div className="text-xs text-gray-400 capitalize">{metric.toLowerCase()}</div>
                {percentDiff && (
                  <div className={`text-xs mt-1 ${getDifferenceColor(percentDiff)}`}>
                    {parseFloat(percentDiff) > 0 ? "Higher" : "Lower"} than Earth
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}