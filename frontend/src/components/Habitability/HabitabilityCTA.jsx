import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaGlobeAmericas,
  FaInfoCircle,
  FaTimes,
  FaTemperatureHigh,
  FaRuler,
  FaWeight,
  FaWater,
  FaCloud,
  FaSun,
  FaExclamationTriangle,
  FaStar,
  FaBalanceScale,
} from "react-icons/fa";

export default function HabitabilityCTA({ onBack, onEarthView }) {
  const [showInfo, setShowInfo] = useState(false);

  // ✅ ESC to close info modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowInfo(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center mt-8 px-4">
      {/* 🔹 Back to Explorer (Link version) */}
      <Link
        to="/explore"
        onClick={onBack}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/20 group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Explorer</span>
      </Link>

      {/* 🌍 Compare with Earth (Link version) */}
      <Link
        to="/compare"
        onClick={onEarthView}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/20 group"
      >
        <FaGlobeAmericas className="group-hover:scale-110 transition-transform" />
        <span>Compare with Earth</span>
      </Link>

      {/* ℹ️ Info Button */}
      <button
        onClick={() => setShowInfo(true)}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/20 group"
      >
        <FaInfoCircle className="group-hover:scale-110 transition-transform" />
        <span>How Scores Are Calculated</span>
      </button>

      {/* 🧠 Info Modal */}
      {showInfo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowInfo(false)}
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-6 rounded-2xl max-w-3xl w-full text-white relative shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* ❌ Close Button */}
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <FaInfoCircle className="text-purple-400 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Habitability Score Calculation
              </h2>
            </div>

            {/* Introduction */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              Each planet’s <span className="text-cyan-400 font-semibold">Habitability Score (0–100)</span> 
              is based on NASA’s exoplanet models and the{" "}
              <span className="text-green-400 font-semibold">Earth Similarity Index (ESI)</span>.
              It measures how closely a planet matches Earth's life-supporting conditions.
            </p>

            {/* Factors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <FactorCard
                icon={<FaTemperatureHigh className="text-red-400" />}
                color="red"
                title="Temperature"
                desc="Ideal range: 250–320 K. Too hot (>500 K) or cold (<150 K) → uninhabitable."
              />
              <FactorCard
                icon={<FaRuler className="text-blue-400" />}
                color="blue"
                title="Radius"
                desc="Optimal: 0.8–1.8 Earth radii. Too large = gas giant, too small = no atmosphere."
              />
              <FactorCard
                icon={<FaWeight className="text-purple-400" />}
                color="purple"
                title="Mass"
                desc="Ideal: 0.8–5 Earth masses. Impacts surface gravity and atmosphere retention."
              />
              <FactorCard
                icon={<FaSun className="text-yellow-400" />}
                color="yellow"
                title="Stellar Insolation"
                desc="Ideal: 0.35–1.7 Earth flux. Determines heat & light from the star."
              />
              <FactorCard
                icon={<FaSun className="text-orange-400" />}
                color="orange"
                title="Orbital Zone"
                desc="Position within the ‘Goldilocks Zone’ where liquid water can exist."
              />
              <FactorCard
                icon={<FaCloud className="text-teal-400" />}
                color="teal"
                title="Atmosphere"
                desc="Assesses gas quality & thickness — vital for surface temperature stability."
              />
              <FactorCard
                icon={<FaWater className="text-cyan-400" />}
                color="cyan"
                title="Water Potential"
                desc="Estimates chances of liquid water on surface or subsurface regions."
              />
              <FactorCard
                icon={<FaStar className="text-pink-400" />}
                color="pink"
                title="Star Type & Stability"
                desc="Stable G/K-type stars favor life; flaring stars reduce habitability."
              />
              <FactorCard
                icon={<FaExclamationTriangle className="text-orange-400" />}
                color="orange"
                title="Stellar Activity Penalty"
                desc="Planets near flare-active stars lose up to 15% of their score."
              />
            </div>

            {/* Weighting System */}
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <FaBalanceScale className="text-cyan-400" />
                <h3 className="font-semibold text-cyan-400">Weighting System</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                The system gives higher importance to Temperature (25%), Orbital Zone (25%), 
                Radius (15%), Mass (15%), and Insolation (10%). Atmospheric and water-related 
                factors refine the result for a more realistic habitability score.
              </p>
            </div>

            {/* References */}
            <div className="mt-6 text-xs text-gray-500 italic">
              Based on <span className="text-cyan-400">Kopparapu et al. (2013)</span> and{" "}
              <span className="text-green-400">Schulze-Makuch et al. (2011)</span>. 
              Only Earth can achieve a perfect 100.
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowInfo(false)}
              className="w-full mt-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🔧 Reusable FactorCard component */
function FactorCard({ icon, color, title, desc }) {
  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 bg-${color}-500/20 rounded-lg`}>{icon}</div>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-400 leading-snug">{desc}</p>
    </div>
  );
}
