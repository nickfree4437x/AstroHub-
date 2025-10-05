import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { 
  FaStar, 
  FaGlobe,
  FaHeart,
  FaRegHeart,
  FaCalendarAlt,
  FaRocket
} from "react-icons/fa";

export default function PlanetCard({ planet, onClick }) {
  const { name, habitability, distance, starType, discoveryYear, discoveryMethod } = planet;
  const score = habitability?.score ?? 0;

  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 🌈 Score color gradient
  const getScoreColor = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-amber-600";
    if (score >= 40) return "from-orange-500 to-amber-600";
    return "from-red-500 to-pink-600";
  };
  const scoreColor = getScoreColor(score);

  // 🌟 Show only available planet info
  const planetInfo = [
    starType && { label: "Star Type", value: starType, icon: <FaStar className="text-yellow-400" /> },
    discoveryYear && { label: "Discovered", value: discoveryYear, icon: <FaCalendarAlt className="text-cyan-400" /> },
    discoveryMethod && { label: "Method", value: discoveryMethod, icon: <FaRocket className="text-purple-400" /> },
  ].filter(Boolean);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    if (onClick) onClick(planet);
  };

  const formatDistance = (dist) => {
    if (!dist) return null;
    return dist >= 1000 ? `${(dist / 1000).toFixed(1)}k ly` : `${dist} ly`;
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 shadow-2xl border border-gray-700/50 
                  cursor-pointer overflow-hidden group transition-all duration-300"
        onClick={handleCardClick}
        data-tooltip-id={`tooltip-${name}`}
      >
        {/* 🌌 Background Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${scoreColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
        
        {/* ❤️ Favorite */}
        <motion.button
          onClick={handleFavoriteClick}
          className="absolute top-4 left-4 z-10 text-xl bg-black/30 backdrop-blur-sm p-2 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isFavorite ? "Remove Favorite" : "Add Favorite"}
        >
          {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400 hover:text-red-400" />}
        </motion.button>

        {/* 🪐 Planet Visual with Score Badge */}
        <div className="flex justify-center mb-5 relative">
          <motion.div
            className="w-24 h-24 rounded-full flex items-center justify-center relative"
            animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${scoreColor} shadow-lg group-hover:shadow-xl transition-shadow`}></div>
            <div className="absolute w-32 h-2 rounded-full bg-gray-600/30 rotate-12"></div>
            <div className={`absolute inset-0 rounded-full ${scoreColor} opacity-20 blur-md group-hover:opacity-30 transition-opacity`}></div>
            <span className="text-white font-bold text-xl relative z-10">{name.charAt(0)}</span>
          </motion.div>
          
          {/* Score Badge */}
          {score > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute -bottom-2 bg-gradient-to-r ${scoreColor} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}
            >
              {score}%
            </motion.div>
          )}
        </div>

        {/* 🌟 Planet Info */}
        <div className="text-center mb-6">
          <h3 className="font-bold text-xl text-white mb-3 group-hover:text-cyan-300 transition-colors">{name}</h3>
          
          {/* Planet Details */}
          {planetInfo.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {planetInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-1 text-gray-400 text-xs bg-gray-800/50 px-2 py-1 rounded-full">
                  {info.icon}
                  <span>{info.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Distance - Second Main Info */}
          {distance && (
            <div className="flex items-center justify-center gap-2 text-gray-300 text-sm bg-gray-800/30 py-2 px-4 rounded-xl">
              <FaGlobe className="text-blue-400" />
              <span className="font-medium">{formatDistance(distance)}</span>
            </div>
          )}
        </div>

        {/* 🌍 Habitability Score Progress - Only show if available */}
        {score > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm font-medium">Habitability Score</span>
              <span className={`text-sm font-bold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>
                {score}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full bg-gradient-to-r ${scoreColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        )}

        {/* 🔍 View Details Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all"
        >
          <span>View Detailed Analysis</span>
        </motion.button>

        {/* 🛰️ Hover Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center pb-4 rounded-2xl transition-opacity"
          initial={{ opacity: 0 }}
        >
          <span className="text-white text-sm font-medium">Click for complete habitability report</span>
        </motion.div>
      </motion.div>

      {/* 🧠 Main Tooltip */}
      <Tooltip
        id={`tooltip-${name}`}
        place="top"
        className="z-50 max-w-xs"
        style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
        render={() => (
          <div className="text-sm">
            <div className="font-semibold text-white mb-2">{name}</div>
            <div className="space-y-2">
              {score > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Habitability:</span>
                  <span className={`font-bold ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {score}% Score
                  </span>
                </div>
              )}
              {distance && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Distance:</span>
                  <span className="text-white font-medium">{formatDistance(distance)}</span>
                </div>
              )}
              {starType && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Star Type:</span>
                  <span className="text-white">{starType}</span>
                </div>
              )}
            </div>
          </div>
        )}
      />
    </>
  );
}