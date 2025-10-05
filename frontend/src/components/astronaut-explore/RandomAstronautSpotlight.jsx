// src/components/astronauts/RandomAstronautSpotlight.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaQuoteLeft, 
  FaRocket, 
  FaGlobe, 
  FaCalendarAlt, 
  FaUserAstronaut,
  FaWalking,
  FaClock,
  FaPlane
} from "react-icons/fa";

export default function RandomAstronautSpotlight({ count = 3, autoScroll = true, scrollInterval = 5000, onSelect }) {
  const [astronauts, setAstronauts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  // Fetch random astronauts
  useEffect(() => {
    const loadRandom = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1"}/astronauts/random-spotlight?count=${count}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setAstronauts(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Error loading random astronauts:", err);
        setAstronauts([]);
      } finally {
        setLoading(false);
      }
    };

    loadRandom();
  }, [count]);

  // Auto-scroll logic
  useEffect(() => {
    if (!autoScroll || astronauts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % astronauts.length);
    }, scrollInterval);
    return () => clearInterval(interval);
  }, [astronauts, autoScroll, scrollInterval]);

  // Helper function to safely get data
  const getAvailableData = (astronaut) => {
    const data = {
      name: astronaut?.name,
      agency: astronaut?.agency?.name,
      nationality: astronaut?.nationality,
      status: astronaut?.status,
      bio: astronaut?.bio,
      profileImage: astronaut?.profileImageThumb || astronaut?.profileImage,
      age: astronaut?.age,
      flightsCount: astronaut?.flights_count,
      firstFlightYear: astronaut?.firstFlightYear,
      evaCount: astronaut?.EVAcount || astronaut?.spacewalks_count,
      evaTimeHours: astronaut?.evaTimeHours,
      timeInSpaceHours: astronaut?.timeInSpaceHours,
      wiki: astronaut?.wiki,
      twitter: astronaut?.twitter,
      instagram: astronaut?.instagram
    };

    // Only return properties that have values
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => 
        value !== null && value !== undefined && value !== ""
      )
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-300">Discovering amazing astronauts...</p>
        </div>
      </div>
    );
  }

  if (!astronauts.length) {
    return (
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
        <FaUserAstronaut className="text-4xl text-gray-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No Astronauts Available</h3>
        <p className="text-gray-500 text-sm">Check back later for featured space explorers</p>
      </div>
    );
  }

  const astronaut = astronauts[current];
  const availableData = getAvailableData(astronaut);

  // Status styling
  const getStatusStyle = (status) => {
    if (status === "active") return { text: "Active", color: "text-green-400", bg: "bg-green-500/20" };
    if (status === "retired") return { text: "Retired", color: "text-yellow-400", bg: "bg-yellow-500/20" };
    return { text: status || "Unknown", color: "text-gray-400", bg: "bg-gray-500/20" };
  };

  const statusStyle = getStatusStyle(availableData.status);

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-500 cursor-pointer"
         onClick={() => onSelect?.(astronaut)}>
      
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <FaUserAstronaut className="text-cyan-400 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Featured Astronaut</h3>
            <p className="text-gray-400 text-sm">Spotlight on space explorers</p>
          </div>
        </div>

        {/* Navigation Dots */}
        {astronauts.length > 1 && (
          <div className="flex gap-1">
            {astronauts.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === current ? "bg-cyan-400" : "bg-gray-600 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Astronaut Profile */}
          <div className="flex items-start gap-4">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img
                src={availableData.profileImage || `/api/placeholder/80/80`}
                alt={availableData.name || "Astronaut"}
                className="w-20 h-20 rounded-xl object-cover border-2 border-cyan-500/30 shadow-lg"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(availableData.name || "Astronaut")}&background=0ea5e9&color=fff&size=80`;
                }}
              />
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-xl font-bold text-white truncate">
                    {availableData.name || "Unknown Astronaut"}
                  </h4>
                  
                  {/* Agency */}
                  {availableData.agency && (
                    <p className="text-cyan-400 text-sm flex items-center gap-1 mt-1">
                      <FaRocket className="text-xs" />
                      {availableData.agency}
                    </p>
                  )}
                </div>
                
                {/* Status */}
                {availableData.status && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.color} border ${statusStyle.color.replace('text', 'border')}/30`}>
                    {statusStyle.text}
                  </span>
                )}
              </div>

              {/* Available Stats */}
              <div className="flex flex-wrap gap-3 text-sm text-gray-300">
                {/* Nationality */}
                {availableData.nationality && (
                  <span className="flex items-center gap-1">
                    <FaGlobe className="text-blue-400" />
                    {availableData.nationality}
                  </span>
                )}
                
                {/* Age */}
                {availableData.age && (
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-purple-400" />
                    {availableData.age} years
                  </span>
                )}
                
                {/* Flights */}
                {availableData.flightsCount && (
                  <span className="flex items-center gap-1">
                    <FaPlane className="text-yellow-400" />
                    {availableData.flightsCount} flights
                  </span>
                )}
                
                {/* First Flight Year */}
                {availableData.firstFlightYear && (
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-green-400" />
                    Since {availableData.firstFlightYear}
                  </span>
                )}
                
                {/* Spacewalks */}
                {availableData.evaCount && (
                  <span className="flex items-center gap-1">
                    <FaWalking className="text-red-400" />
                    {availableData.evaCount} spacewalks
                  </span>
                )}
                
                {/* Spacewalk Time */}
                {availableData.evaTimeHours && (
                  <span className="flex items-center gap-1">
                    <FaClock className="text-cyan-400" />
                    {availableData.evaTimeHours}h EVA
                  </span>
                )}
                
                {/* Total Space Time */}
                {availableData.timeInSpaceHours && (
                  <span className="flex items-center gap-1">
                    <FaClock className="text-orange-400" />
                    {Math.round(availableData.timeInSpaceHours)}h in space
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio/Description */}
          {availableData.bio && (
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <div className="flex items-start gap-3">
                <FaQuoteLeft className="text-cyan-400 text-lg mt-1 flex-shrink-0" />
                <p className="text-gray-200 text-sm leading-relaxed">
                  {availableData.bio.length > 150 
                    ? availableData.bio.substring(0, 150) + "..." 
                    : availableData.bio
                  }
                </p>
              </div>
            </div>
          )}

          {/* Social Links */}
          {(availableData.wiki || availableData.twitter || availableData.instagram) && (
            <div className="flex gap-3 text-sm">
              {availableData.wiki && (
                <a 
                  href={availableData.wiki} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Wikipedia
                </a>
              )}
              {availableData.twitter && (
                <a 
                  href={availableData.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Twitter
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
                  Instagram
                </a>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-between items-center pt-2">
            {/* <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(astronaut);
              }}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium text-sm transition-all duration-300 flex items-center gap-2"
            >
              <FaUserAstronaut className="text-sm" />
              View Full Profile
            </button> */}

            {/* Manual Navigation */}
            {/* {astronauts.length > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrent((current - 1 + astronauts.length) % astronauts.length);
                  }}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrent((current + 1) % astronauts.length);
                  }}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300"
                >
                  →
                </button>
              </div>
            )} */}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}