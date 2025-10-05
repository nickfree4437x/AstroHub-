// src/components/astronauts/AstronautCard.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUserAstronaut, 
  FaRocket, 
  FaGlobe, 
  FaCalendarAlt, 
  FaWalking, 
  FaClock,
  FaPlane,
  FaStar,
  FaExpandAlt,
  FaCompressAlt,
  FaTwitter,
  FaInstagram,
  FaWikipediaW,
  FaExternalLinkAlt
} from "react-icons/fa";

export default function AstronautCard({ astronaut, onClick, isSelected = false }) {
  const [expanded, setExpanded] = useState(false);
  const [favorite, setFavorite] = useState(false);

  // Helper function to get available data
  const getAvailableData = () => {
    const data = {
      name: astronaut?.name,
      agency: astronaut?.agency?.name,
      nationality: astronaut?.nationality,
      status: astronaut?.status,
      inSpace: astronaut?.in_space,
      profileImage: astronaut?.profileImageThumb || astronaut?.profileImage,
      age: astronaut?.age,
      dateOfBirth: astronaut?.date_of_birth,
      flightsCount: astronaut?.flights_count,
      landingsCount: astronaut?.landings_count,
      firstFlightYear: astronaut?.firstFlightYear,
      firstFlight: astronaut?.first_flight,
      lastFlight: astronaut?.last_flight,
      evaCount: astronaut?.EVAcount || astronaut?.spacewalks_count,
      evaTimeHours: astronaut?.evaTimeHours,
      timeInSpaceHours: astronaut?.timeInSpaceHours,
      wiki: astronaut?.wiki,
      twitter: astronaut?.twitter,
      instagram: astronaut?.instagram,
      bio: astronaut?.bio
    };

    // Only return properties that have values
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => 
        value !== null && value !== undefined && value !== "" && value !== 0
      )
    );
  };

  const availableData = getAvailableData();

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };

  const age = availableData.age || calculateAge(availableData.dateOfBirth);

  // Status styling
  const getStatusStyle = () => {
    if (availableData.inSpace) return { text: "In Space", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" };
    if (availableData.status === "Active") return { text: "Active", color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" };
    if (availableData.status === "Retired") return { text: "Retired", color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30" };
    return { text: availableData.status || "Unknown", color: "text-gray-400", bg: "bg-gray-500/20", border: "border-gray-500/30" };
  };

  const statusStyle = getStatusStyle();

  // Flag URL for nationality
  const flagUrl = availableData.nationality 
    ? `https://flagcdn.com/24x18/${availableData.nationality.toLowerCase()}.png`
    : null;

  return (
    <motion.div
      className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105 ${
        isSelected 
          ? "border-cyan-500 shadow-2xl shadow-cyan-500/20" 
          : "border-white/10 hover:border-cyan-500/30"
      }`}
      whileHover={{ y: -5 }}
      onClick={() => onClick?.(astronaut)}
    >
      {/* Header with Actions */}
      <div className="relative p-4 pb-0">
        {/* Favorite Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setFavorite(!favorite);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 z-10"
        >
          <FaStar className={`text-lg ${favorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400 hover:text-yellow-300"}`} />
        </motion.button>

        {/* Expand Button */}
        {Object.keys(availableData).length > 5 && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 left-3 z-10 p-1 bg-black/30 rounded-lg border border-white/10"
          >
            {expanded ? <FaCompressAlt className="text-gray-300 text-sm" /> : <FaExpandAlt className="text-gray-300 text-sm" />}
          </motion.button>
        )}

        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <img
              src={availableData.profileImage || "/api/placeholder/120/120"}
              alt={availableData.name || "Astronaut"}
              className="w-24 h-24 rounded-xl object-cover border-2 border-cyan-500/30 shadow-lg"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(availableData.name || "Astronaut")}&background=0ea5e9&color=fff&size=96`;
              }}
            />
            {/* Status Indicator */}
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-800 ${statusStyle.bg.replace('bg-', 'bg-')}`}></div>
          </div>
        </div>

        {/* Name and Basic Info */}
        <div className="text-center mb-3">
          <h3 className="text-lg font-bold text-white truncate mb-1">
            {availableData.name || "Unknown Astronaut"}
          </h3>
          
          {/* Agency */}
          {availableData.agency && (
            <p className="text-cyan-400 text-sm flex items-center justify-center gap-1 mb-2">
              <FaRocket className="text-xs" />
              {availableData.agency}
            </p>
          )}

          {/* Status Badge */}
          {statusStyle.text && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.color} border ${statusStyle.border}`}>
              {statusStyle.text}
            </span>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-300">
          {/* Nationality */}
          {availableData.nationality && (
            <div className="flex items-center gap-1">
              {flagUrl ? (
                <img src={flagUrl} alt={availableData.nationality} className="w-3 h-2 rounded-sm" />
              ) : (
                <FaGlobe className="text-blue-400" />
              )}
              <span>{availableData.nationality}</span>
            </div>
          )}

          {/* Age */}
          {age && (
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="text-purple-400" />
              <span>{age}y</span>
            </div>
          )}

          {/* Flights */}
          {availableData.flightsCount && (
            <div className="flex items-center gap-1">
              <FaPlane className="text-yellow-400" />
              <span>{availableData.flightsCount}</span>
            </div>
          )}

          {/* Spacewalks */}
          {availableData.evaCount && (
            <div className="flex items-center gap-1">
              <FaWalking className="text-red-400" />
              <span>{availableData.evaCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10 bg-black/20"
          >
            <div className="p-4 space-y-3">
              {/* Detailed Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Spacewalk Time */}
                {availableData.evaTimeHours && (
                  <div className="flex items-center gap-1 text-cyan-400">
                    <FaWalking />
                    <span>{availableData.evaTimeHours}h EVA</span>
                  </div>
                )}

                {/* Total Space Time */}
                {availableData.timeInSpaceHours && (
                  <div className="flex items-center gap-1 text-orange-400">
                    <FaClock />
                    <span>{Math.round(availableData.timeInSpaceHours)}h space</span>
                  </div>
                )}

                {/* First Flight Year */}
                {availableData.firstFlightYear && (
                  <div className="flex items-center gap-1 text-green-400">
                    <FaCalendarAlt />
                    <span>Since {availableData.firstFlightYear}</span>
                  </div>
                )}

                {/* Landings */}
                {availableData.landingsCount && (
                  <div className="flex items-center gap-1 text-blue-400">
                    <FaPlane />
                    <span>{availableData.landingsCount} landings</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(availableData.wiki || availableData.twitter || availableData.instagram) && (
                <div className="flex justify-center gap-3 pt-2 border-t border-white/10">
                  {availableData.twitter && (
                    <a
                      href={availableData.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <FaTwitter className="text-sm" />
                    </a>
                  )}
                  {availableData.instagram && (
                    <a
                      href={availableData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-pink-400 hover:text-pink-300 transition-colors"
                    >
                      <FaInstagram className="text-sm" />
                    </a>
                  )}
                  {availableData.wiki && (
                    <a
                      href={availableData.wiki}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <FaWikipediaW className="text-sm" />
                    </a>
                  )}
                </div>
              )}

              {/* View Profile Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.(astronaut);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-xs font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaExternalLinkAlt className="text-xs" />
                View Full Profile
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}