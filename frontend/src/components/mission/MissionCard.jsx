// src/components/mission/MissionCard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Calendar, Users, MapPin } from "lucide-react";

// Agency logos mapping with fallbacks
const agencyLogos = {
  NASA: "/logos/nasa.jpg",
  ESA: "/logos/esa.jpg", 
  ISRO: "/logos/isro.jpg",
  JAXA: "/logos/jaxa.jpg",
  CNSA: "/logos/cnsa.jpg",
  "NASA/ESA": "/logos/nasa-esa.jpg",
  "NASA/Roscosmos": "/logos/nasa-roscosmos.jpg",
  "SpaceX/NASA": "/logos/spacex-nasa.jpg",
  "NASA/ESA/CSA": "/logos/nasa-esa-csa.jpg",
  "Soviet Space Program": "/logos/soviet-space.jpg",
};

// Status colors
const statusColors = {
  "Ongoing": "bg-green-500",
  "Upcoming": "bg-blue-500", 
  "Completed": "bg-purple-500",
  "Failed": "bg-red-500",
  "Launch Successful": "bg-green-500",
  "Unknown": "bg-gray-500"
};

export default function MissionCard({ mission, onExplore }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const isFavorite = favorites.includes(mission.id);

  // Format date properly
  const formatLaunchDate = (date) => {
    if (!date) return "TBD";
    
    try {
      if (date.$date) {
        const timestamp = parseInt(date.$date.$numberLong || date.$date);
        return new Date(timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short'
        });
      }
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    } catch (error) {
      return "TBD";
    }
  };

  // Format crew information
  const formatCrew = (crew) => {
    if (crew === undefined || crew === null) return "0";
    if (crew === 0) return "0";
    if (typeof crew === 'object') return crew.$numberInt || "0";
    return crew;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-5 flex flex-col justify-between border border-gray-700/50 overflow-hidden group cursor-pointer h-full"
    >
      {/* Mission Thumbnail */}
      <div className="relative w-full h-40 md:h-48 rounded-xl overflow-hidden mb-4">
        {mission.image ? (
          <img
            src={mission.image}
            alt={mission.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="w-10 h-10 mx-auto mb-2 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-lg">🚀</span>
              </div>
              No Image
            </div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
        
        {/* Favorite Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(mission.id);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-sm transition-all duration-300 z-10"
        >
          <Star
            className={`w-4 h-4 transition-all ${
              isFavorite 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300 hover:text-yellow-300"
            }`}
          />
        </button>

        {/* Status Badge */}
        <div className="absolute bottom-2 left-2">
          <span
            className={`px-2 py-1 rounded-full text-white font-semibold text-xs ${
              statusColors[mission.status] || statusColors.Unknown
            }`}
          >
            {mission.status || "Unknown"}
          </span>
        </div>
      </div>

      {/* Mission Info - Only 3 Key Details */}
      <div className="flex flex-col flex-1 space-y-3">
        {/* Mission Name */}
        <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight">
          {mission.name}
        </h3>

        {/* Agency */}
        <div className="flex items-center gap-2">
          {agencyLogos[mission.agency] ? (
            <img
              src={agencyLogos[mission.agency]}
              alt={mission.agency}
              className="w-6 h-6 object-contain rounded-full border border-gray-600"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center border border-gray-600">
              <span className="text-xs">🚀</span>
            </div>
          )}
          <span className="text-xs bg-gray-700/80 px-2 py-1 rounded-full font-medium text-gray-200 truncate">
            {mission.agency}
          </span>
        </div>

        {/* Only 3 Key Information Points */}
        <div className="space-y-2">
          {/* 1. Destination */}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="truncate">{mission.destination || "Unknown Destination"}</span>
          </div>
          
          {/* 2. Launch Date */}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>{formatLaunchDate(mission.launchDate)}</span>
          </div>
          
          {/* 3. Crew */}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Users className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>{formatCrew(mission.crew)} Crew</span>
          </div>
        </div>
      </div>

      {/* Explore Button */}
      <button
        onClick={() => onExplore(mission)}
        className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/20"
      >
        View Details
      </button>
    </motion.div>
  );
}