import React from "react";
import { motion } from "framer-motion";

const PlanetDetailsCard = ({ planet }) => {
  if (!planet) return null;

  return (
    <motion.div 
      className="w-full bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
        <h3 className="text-xl font-bold text-white">
          Planet Details: <span className="text-cyan-400">{planet.name}</span>
        </h3>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-300 font-medium">Mass</span>
            <span className="text-white font-semibold">{planet.mass_earth || "N/A"} Earths</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-300 font-medium">Radius</span>
            <span className="text-white font-semibold">{planet.radius_earth || "N/A"} Earth radii</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-300 font-medium">Orbital Period</span>
            <span className="text-white font-semibold">{planet.period_days || "N/A"} days</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-300 font-medium">Semi-major Axis</span>
            <span className="text-white font-semibold">{planet.semi_major_axis_au || "N/A"} AU</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-300 font-medium">Temperature</span>
            <span className="text-white font-semibold">{planet.temp_k || "N/A"} K</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-300 font-medium">Distance</span>
            <span className="text-white font-semibold">{planet.distance_ly || "N/A"} ly</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-300 font-medium">Star Mass</span>
            <span className="text-white font-semibold">{planet.star_mass_solar || "N/A"} M☉</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-gray-300 font-medium">Star Temperature</span>
            <span className="text-white font-semibold">{planet.star_temp_k || "N/A"} K</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlanetDetailsCard;