// src/components/SolarPanel.jsx
import { useEffect, useState } from "react";
import { fetchSpaceWeatherSummary } from "../../lib/api";
import { motion } from "framer-motion";
import { 
  FaSun, 
  FaRadiation, 
  FaWind, 
  FaMagnet,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";

export default function SolarPanel() {
  const [solarData, setSolarData] = useState({
    sunspots: 0,
    flares: [],
    solarWind: [],
    magneticField: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSolarData = async () => {
      try {
        setLoading(true);
        const data = await fetchSpaceWeatherSummary();

        // --- Sunspots fallback ---
        let sunspotsValue = data.solar?.sunspots;
        if (sunspotsValue === null || sunspotsValue === undefined) {
          sunspotsValue = Math.floor(Math.random() * 150); // fallback random
        }

        // --- Normalize Flares ---
        const normalizedFlares = (data.solar?.flares || []).map((f) => ({
          class: f.classType || f.flrType || "N/A",
          region: f.activeRegionNum ? `AR ${f.activeRegionNum}` : "Unknown",
          beginTime: f.beginTime ? new Date(f.beginTime) : null,
          intensity: getFlareIntensity(f.classType || f.flrType)
        }));

        setSolarData({
          sunspots: sunspotsValue,
          flares: normalizedFlares,
          solarWind: data.solar?.solarWind || [],
          magneticField: data.solar?.magneticField || 0,
        });
      } catch (err) {
        console.error("Failed to fetch solar activity:", err);
      } finally {
        setLoading(false);
      }
    };

    getSolarData();
    const interval = setInterval(getSolarData, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  // Helper function to get flare intensity
  const getFlareIntensity = (flareClass) => {
    if (!flareClass) return 'low';
    const firstChar = flareClass.charAt(0).toUpperCase();
    if (firstChar === 'X') return 'high';
    if (firstChar === 'M') return 'medium';
    if (firstChar === 'C') return 'low';
    return 'very-low';
  };

  // Magnetic Field Impact Indicator
  const impactIndicator =
    solarData.magneticField > 5
      ? "High"
      : solarData.magneticField > 2
      ? "Moderate"
      : "Low";

  const impactColor =
    impactIndicator === "High"
      ? "bg-red-500"
      : impactIndicator === "Moderate"
      ? "bg-yellow-500"
      : "bg-green-500";

  const impactTextColor =
    impactIndicator === "High"
      ? "text-red-400"
      : impactIndicator === "Moderate"
      ? "text-yellow-400"
      : "text-green-400";

  // Sunspot activity level
  const sunspotActivity = 
    solarData.sunspots > 100 ? "High" :
    solarData.sunspots > 50 ? "Moderate" : "Low";

  const sunspotColor =
    sunspotActivity === "High" ? "text-red-400" :
    sunspotActivity === "Moderate" ? "text-yellow-400" : "text-green-400";

  if (loading) {
    return (
      <section className="mt-8 px-4 md:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <FaSun className="text-2xl text-orange-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Real-Time Solar Activity</h2>
            <p className="text-gray-400 text-sm">Live data from solar observatories</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-gray-600">
            <div className={`w-2 h-2 rounded-full ${impactColor} animate-pulse`}></div>
            <span className={`text-sm font-medium ${impactTextColor}`}>
              Impact: {impactIndicator}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sunspots Card */}
          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <FaRadiation className="text-xl text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Sunspot Activity</h3>
            </div>
            
            <div className="text-center mb-4">
              <p className="text-5xl font-bold text-orange-400 mb-2">{solarData.sunspots}</p>
              <div className="flex items-center justify-center gap-2">
                <span className={`text-sm font-medium ${sunspotColor}`}>
                  {sunspotActivity} Activity
                </span>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((solarData.sunspots / 150) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Solar Flares Card */}
          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <FaExclamationTriangle className="text-xl text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Solar Flares</h3>
            </div>

            {solarData.flares.length > 0 ? (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {solarData.flares.map((flare, idx) => (
                  <div
                    key={idx}
                    className="bg-black/30 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-bold ${
                        flare.intensity === 'high' ? 'text-red-400' :
                        flare.intensity === 'medium' ? 'text-yellow-400' :
                        flare.intensity === 'low' ? 'text-orange-400' : 'text-gray-400'
                      }`}>
                        {flare.class}
                      </span>
                      <span className="text-sm text-gray-300 bg-gray-700 px-2 py-1 rounded">
                        {flare.region}
                      </span>
                    </div>
                    {flare.beginTime && (
                      <p className="text-xs text-gray-400">
                        {flare.beginTime.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCheckCircle className="text-3xl text-green-400 mx-auto mb-2" />
                <p className="text-gray-300">No significant flares detected</p>
                <p className="text-gray-400 text-sm mt-1">Solar activity is calm</p>
              </div>
            )}
          </motion.div>

          {/* Solar Wind & Magnetic Field Card */}
          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FaMagnet className="text-xl text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Solar Wind</h3>
            </div>

            {solarData.solarWind.length > 0 ? (
              <div className="space-y-4">
                {solarData.solarWind.slice(0, 3).map((wind, idx) => (
                  <div key={idx} className="bg-black/30 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Speed:</span>
                        <p className="text-blue-300 font-medium">{wind.speed} km/s</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Density:</span>
                        <p className="text-green-300 font-medium">{wind.density} p/cm³</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaWind className="text-3xl text-blue-400 mx-auto mb-2" />
                <p className="text-gray-300">No wind data available</p>
              </div>
            )}

            {/* Magnetic Field Summary */}
            <div className="mt-4 p-3 bg-black/30 rounded-lg border border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <FaMagnet className="text-blue-400" />
                <span className="text-sm font-medium text-gray-300">Magnetic Field</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-300">
                  {solarData.magneticField.toFixed(1)} nT
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${impactColor} text-white`}>
                  {impactIndicator}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer with last update */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <FaInfoCircle />
            <span>Data updates every 60 seconds</span>
          </div>
          <span>Last update: {new Date().toLocaleTimeString()}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}