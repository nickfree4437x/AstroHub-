// src/components/explorer/PlanetCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaGlobe, 
  FaRuler, 
  FaWeightHanging, 
  FaStar, 
  FaCalendarAlt,
  FaSearch,
  FaRocket,
  FaPlusCircle,
  FaEye,
  FaRoute,
  FaSun,
  FaTint,
  FaWind
} from "react-icons/fa";

export default function PlanetCard({ planet, onOpen, onSelect, selectedForCompare }) {
  const distPc = planet.distance ?? planet.sy_dist ?? planet.distancePc ?? null;
  const radius = planet.radius ?? planet.pl_rade ?? planet.radiusRe ?? null;
  const mass = planet.mass ?? planet.pl_bmasse ?? planet.massMe ?? null;
  
  // New fields from database
  const orbitalPeriod = planet.orbitalPeriod ?? planet.pl_orbper ?? null;
  const semiMajorAxis = planet.semiMajorAxis ?? planet.pl_orbsmax ?? null;
  const eccentricity = planet.eccentricity ?? planet.pl_orbeccen ?? null;
  const waterPresence = planet.waterPresence ?? null;
  const atmosphere = planet.atmosphere ?? null;
  const habitableZone = planet.habitableZone ?? null;
  const flareActivity = planet.flareActivity ?? null;

  const [useLightYears, setUseLightYears] = useState(false);

  // --- Formatting Helpers ---
  const formatDistance = (value) => {
    if (typeof value !== "number") return "—";
    if (useLightYears) {
      const ly = value * 3.26; // 1 parsec = 3.26 light years
      return ly >= 1000 ? `${(ly / 1000).toFixed(1)}k ly` : `${ly.toFixed(1)} ly`;
    }
    return value >= 1000 ? `${(value / 1000).toFixed(1)}k pc` : `${value.toFixed(1)} pc`;
  };

  const formatValue = (value) => {
    if (typeof value !== "number") return "—";
    return value.toFixed(2);
  };

  const formatOrbitalPeriod = (value) => {
    if (typeof value !== "number") return "—";
    if (value < 1) return `${(value * 24).toFixed(1)}h`; // Hours
    if (value < 365) return `${value.toFixed(1)}d`; // Days
    return `${(value / 365).toFixed(1)}y`; // Years
  };

  const formatSemiMajorAxis = (value) => {
    if (typeof value !== "number") return "—";
    return value < 0.1 ? `${(value * 1000).toFixed(1)}m AU` : `${value.toFixed(3)} AU`;
  };

  const formatEccentricity = (value) => {
    if (typeof value !== "number") return "—";
    return value.toFixed(3);
  };

  const formatFlareActivity = (value) => {
    if (typeof value !== "number") return "—";
    if (value === 0) return "None";
    if (value < 0.5) return "Low";
    if (value < 1) return "Medium";
    return "High";
  };

  // Get planet color based on habitable zone or water presence
  const getPlanetColor = () => {
    if (waterPresence === "Confirmed") return "from-blue-500 to-cyan-500";
    if (habitableZone === true || habitableZone === "Yes") return "from-green-500 to-emerald-500";
    if (atmosphere) return "from-orange-500 to-yellow-500";
    return "from-purple-500 to-indigo-500";
  };

  // Choose which stats to show (prioritize available data)
  const getStatsToShow = () => {
    const stats = [];
    
    // Always show distance and radius
    stats.push({ 
      key: 'distance', 
      value: distPc, 
      label: 'Distance', 
      icon: FaSearch, 
      color: 'cyan',
      formatter: formatDistance
    });
    
    stats.push({ 
      key: 'radius', 
      value: radius, 
      label: 'Radius (R⊕)', 
      icon: FaRuler, 
      color: 'pink',
      formatter: formatValue
    });

    // Then add mass if available
    if (mass) {
      stats.push({ 
        key: 'mass', 
        value: mass, 
        label: 'Mass (M⊕)', 
        icon: FaWeightHanging, 
        color: 'green',
        formatter: formatValue
      });
    }

    // Then choose from other available fields
    const availableFields = [
      { 
        key: 'orbitalPeriod', 
        value: orbitalPeriod, 
        label: 'Orbital Period', 
        icon: FaRoute, 
        color: 'purple',
        formatter: formatOrbitalPeriod
      },
      { 
        key: 'semiMajorAxis', 
        value: semiMajorAxis, 
        label: 'Semi-Major Axis', 
        icon: FaSun, 
        color: 'yellow',
        formatter: formatSemiMajorAxis
      },
      { 
        key: 'waterPresence', 
        value: waterPresence, 
        label: 'Water', 
        icon: FaTint, 
        color: 'blue',
        formatter: (val) => val || "—"
      },
      { 
        key: 'flareActivity', 
        value: flareActivity, 
        label: 'Flare Activity', 
        icon: FaWind, 
        color: 'orange',
        formatter: formatFlareActivity
      },
      { 
        key: 'eccentricity', 
        value: eccentricity, 
        label: 'Eccentricity', 
        icon: FaRoute, 
        color: 'indigo',
        formatter: formatEccentricity
      }
    ];

    // Add available fields until we have 4 stats total
    for (const field of availableFields) {
      if (stats.length >= 4) break;
      if (field.value !== null && field.value !== undefined) {
        stats.push(field);
      }
    }

    return stats;
  };

  const statsToShow = getStatsToShow();

  return (
    <motion.article
      onClick={() => onOpen(planet)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group cursor-pointer bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border rounded-3xl p-6 
        hover:shadow-2xl transition-all duration-500 relative overflow-hidden
        ${selectedForCompare ? "border-indigo-500 ring-2 ring-indigo-400/50" : "border-white/10"}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" ? onOpen(planet) : null)}
    >
      {/* Background Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getPlanetColor()} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`}></div>
      
      {/* Compare Checkbox - Enhanced */}
      <div
        className="absolute top-4 right-4 z-10"
        onClick={(e) => e.stopPropagation()} // prevent modal trigger
      >
        <motion.label 
          className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-300
            ${selectedForCompare 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50" 
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}
          whileTap={{ scale: 0.9 }}
        >
          <input
            type="checkbox"
            checked={selectedForCompare}
            onChange={(e) => onSelect(planet, e.target.checked)}
            className="hidden"
          />
          <FaPlusCircle className={`transition-transform ${selectedForCompare ? "rotate-45" : ""}`} />
        </motion.label>
      </div>

      {/* Header Section */}
      <div className="flex items-center gap-4 mb-5">
        {/* Planet Avatar */}
        <div className="relative">
          <motion.div 
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${getPlanetColor()} flex items-center justify-center text-2xl font-bold text-white 
              shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}
            whileHover={{ rotate: 5 }}
          >
            <FaGlobe className="text-2xl" />
          </motion.div>
          
          {/* Discovery Year Badge */}
          {planet.discoveryYear && (
            <motion.div 
              className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1"
              whileHover={{ scale: 1.1 }}
            >
              <FaCalendarAlt className="text-xs" />
              <span>{planet.discoveryYear ?? planet.disc_year}</span>
            </motion.div>
          )}
        </div>

        {/* Planet Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
            {planet.name}
          </h3>
          <p className="text-sm text-gray-300 truncate flex items-center gap-2 mt-1">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="truncate">{planet.hostStar ?? planet.hostname ?? "Unknown Star"}</span>
          </p>
        </div>
      </div>

      {/* Discovery Method */}
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl text-sm text-cyan-300 border border-cyan-500/20">
          <FaRocket className="text-xs" />
          <span className="truncate">{planet.discoveryMethod ?? planet.discoverymethod ?? "Unknown Method"}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {statsToShow.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div 
              key={stat.key}
              className={`bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/5 group-hover:border-${stat.color}-500/30 transition-all duration-300`}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`text-${stat.color}-400 text-xs font-medium flex items-center gap-2`}>
                  <IconComponent className="text-xs" />
                  <span>{stat.label}</span>
                </div>
                {stat.key === 'distance' && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUseLightYears(!useLightYears);
                    }}
                    className="text-xs bg-cyan-900/30 px-2 py-1 rounded text-cyan-300 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {useLightYears ? "ly" : "pc"}
                  </motion.button>
                )}
              </div>
              <div className="text-white font-bold text-lg">{stat.formatter(stat.value)}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Special Indicators */}
      <div className="flex flex-wrap gap-2 mb-4">
        {waterPresence && waterPresence !== "No" && (
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-lg text-blue-300 text-xs">
            <FaTint className="text-xs" />
            <span>Water</span>
          </div>
        )}
        {(habitableZone === true || habitableZone === "Yes") && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-lg text-green-300 text-xs">
            <FaSun className="text-xs" />
            <span>Habitable</span>
          </div>
        )}
        {atmosphere && (
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded-lg text-orange-300 text-xs">
            <FaWind className="text-xs" />
            <span>Atmosphere</span>
          </div>
        )}
      </div>

      {/* Hover Indicator */}
      <motion.div 
        className="flex justify-center items-center gap-3 py-3 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl border border-white/10 
          opacity-0 group-hover:opacity-100 transition-all duration-500"
        whileHover={{ scale: 1.02 }}
      >
        <FaEye className="text-cyan-400 text-sm" />
        <span className="text-cyan-400 text-sm font-medium">Click for details</span>
        <span className="text-gray-400 text-sm">|</span>
        <span className="text-indigo-400 text-sm font-medium">Select to compare</span>
      </motion.div>

      {/* Orbital Rings Decoration */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-cyan-500/20 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>
      <div className="absolute -bottom-14 -left-14 w-40 h-40 border border-purple-500/20 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-1200"></div>
    </motion.article>
  );
}