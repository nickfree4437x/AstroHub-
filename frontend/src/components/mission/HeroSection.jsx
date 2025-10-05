// src/components/hero/HeroSection.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaRocket, FaSatellite } from "react-icons/fa";

export default function HeroSection({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center text-white px-4 py-16">
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center items-center gap-4 mb-6"
          >
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <FaRocket className="text-3xl text-blue-400" />
            </div>
            <div className="p-3 bg-purple-500/20 rounded-2xl">
              <FaSatellite className="text-3xl text-purple-400" />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Mission Control
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            Track & Monitor Space Missions
          </p>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Explore historic missions, track ongoing operations, and discover upcoming space expeditions from agencies worldwide.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 gap-6 max-w-md mx-auto py-6"
        >
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-400">500+</div>
            <div className="text-sm text-gray-400">Missions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-400">20+</div>
            <div className="text-sm text-gray-400">Agencies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-cyan-400">60+</div>
            <div className="text-sm text-gray-400">Years</div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search missions by name, agency, or year..."
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Search through NASA, ESA, SpaceX, and other agency missions
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}