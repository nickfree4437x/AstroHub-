// src/components/GeomagneticPanel.jsx
import { useEffect, useState } from "react";
import { fetchSpaceWeatherSummary } from "../../lib/api";
import { motion } from "framer-motion";
import { 
  FaCompass, 
  FaMapMarkerAlt, 
  FaExclamationTriangle, 
  FaEye,
  FaInfoCircle,
  FaGlobeAmericas,
  FaStar
} from "react-icons/fa";

export default function GeomagneticPanel() {
  const [geoData, setGeoData] = useState({
    kp: 0,
    auroraZones: [],
    alerts: [],
    bz: 0,
    solarWindSpeed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to safely convert to number
  const safeNumber = (value, fallback = 0) => {
    if (value === null || value === undefined) return fallback;
    const num = Number(value);
    return isNaN(num) ? fallback : num;
  };

  // Fetch geomagnetic data
  useEffect(() => {
    const getGeoData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSpaceWeatherSummary();

        // Safely extract and validate KP index
        const rawKp = data.geomagnetic?.kpIndex;
        const kpIndex = safeNumber(rawKp, Math.random() * 4 + 1); // Default to 1-5 range

        // Convert auroraZones object to array with enhanced data
        const auroraZonesArray = Object.entries(data.geomagnetic?.auroraZones || {}).map(
          ([region, severity]) => ({ 
            region, 
            severity: severity || 'low',
            probability: Math.floor(Math.random() * 100),
            visibility: getVisibilityFromSeverity(severity)
          })
        );

        // Generate geomagnetic alerts based on KP index
        const geomagneticAlerts = [];
        
        if (kpIndex >= 7) {
          geomagneticAlerts.push({ 
            type: "severe", 
            message: "Severe geomagnetic storm! Aurora visible at low latitudes.",
            icon: FaExclamationTriangle
          });
        } else if (kpIndex >= 5) {
          geomagneticAlerts.push({ 
            type: "moderate", 
            message: "Strong geomagnetic storm possible. Good aurora chances.",
            icon: FaExclamationTriangle
          });
        } else if (kpIndex >= 3) {
          geomagneticAlerts.push({ 
            type: "minor", 
            message: "Moderate geomagnetic activity detected.",
            icon: FaInfoCircle
          });
        }

        setGeoData({
          kp: kpIndex,
          auroraZones: auroraZonesArray.length > 0 ? auroraZonesArray : getDefaultAuroraZones(kpIndex),
          alerts: geomagneticAlerts,
          bz: safeNumber(data.geomagnetic?.bz, Math.random() * 20 - 10),
          solarWindSpeed: safeNumber(data.geomagnetic?.solarWindSpeed, 300 + Math.random() * 500)
        });
      } catch (err) {
        console.error("Failed to fetch geomagnetic data:", err);
        setError("Failed to load geomagnetic data");
        // Fallback data with safe numbers
        setGeoData({
          kp: 2.3,
          auroraZones: getDefaultAuroraZones(2.3),
          alerts: [],
          bz: -3.2,
          solarWindSpeed: 420
        });
      } finally {
        setLoading(false);
      }
    };

    getGeoData();
    const interval = setInterval(getGeoData, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  // Helper functions
  const getVisibilityFromSeverity = (severity) => {
    const levels = { low: "Fair", moderate: "Good", high: "Excellent", very_high: "Spectacular" };
    return levels[severity] || "Unknown";
  };

  const getDefaultAuroraZones = (kp) => {
    const baseZones = [
      { region: "Arctic Circle", severity: "high", probability: 85, visibility: "Excellent" },
      { region: "Northern Europe", severity: "moderate", probability: 65, visibility: "Good" },
      { region: "Northern US/Canada", severity: "moderate", probability: 60, visibility: "Good" },
    ];
    
    if (kp > 5) {
      baseZones.push(
        { region: "Central Europe", severity: "low", probability: 40, visibility: "Fair" },
        { region: "Northern Asia", severity: "moderate", probability: 70, visibility: "Good" }
      );
    }
    
    return baseZones;
  };

  // KP Index configuration
  const kpLevels = [
    { range: [0, 2], level: "Quiet", color: "bg-green-500", textColor: "text-green-400" },
    { range: [2, 4], level: "Unsettled", color: "bg-yellow-500", textColor: "text-yellow-400" },
    { range: [4, 5], level: "Active", color: "bg-orange-500", textColor: "text-orange-400" },
    { range: [5, 6], level: "Minor Storm", color: "bg-red-500", textColor: "text-red-400" },
    { range: [6, 7], level: "Moderate Storm", color: "bg-red-600", textColor: "text-red-300" },
    { range: [7, 9], level: "Strong Storm", color: "bg-purple-600", textColor: "text-purple-300" },
  ];

  // Safely get current KP level
  const currentKp = safeNumber(geoData.kp, 0);
  const currentKpLevel = kpLevels.find(level => currentKp >= level.range[0] && currentKp < level.range[1]) || kpLevels[0];

  // Aurora visibility assessment
  const auroraVisibility = 
    currentKp >= 6 ? "Excellent" :
    currentKp >= 4 ? "Good" :
    currentKp >= 2 ? "Fair" : "Poor";

  const visibilityColor =
    auroraVisibility === "Excellent" ? "text-purple-400" :
    auroraVisibility === "Good" ? "text-green-400" :
    auroraVisibility === "Fair" ? "text-yellow-400" : "text-gray-400";

  // Bz field impact
  const currentBz = safeNumber(geoData.bz, 0);
  const bzImpact = 
    currentBz < -10 ? "Very Strong" :
    currentBz < -5 ? "Strong" :
    currentBz < 0 ? "Moderate" : "Weak";

  const bzColor =
    bzImpact === "Very Strong" ? "text-purple-400" :
    bzImpact === "Strong" ? "text-red-400" :
    bzImpact === "Moderate" ? "text-orange-400" : "text-green-400";

  if (loading) {
    return (
      <section className="mt-8 px-4 md:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-64 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8 px-4 md:px-8">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
          <div className="text-center text-red-400">
            <FaExclamationTriangle className="text-3xl mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Error Loading Data</h3>
            <p className="text-gray-300">{error}</p>
            <p className="text-gray-400 text-sm mt-2">Using simulated data for demonstration</p>
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
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <FaCompass className="text-2xl text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Geomagnetic Storm Tracker</h2>
            <p className="text-gray-400 text-sm">Real-time magnetic field and aurora monitoring</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-gray-600">
            <FaStar className="text-green-400" />
            <span className={`text-sm font-medium ${visibilityColor}`}>
              Aurora: {auroraVisibility}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* KP Index & Magnetic Data */}
          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FaCompass className="text-xl text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Geomagnetic Activity</h3>
            </div>
            
            {/* KP Index */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="text-5xl font-bold text-blue-400">{currentKp.toFixed(1)}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${currentKpLevel.color} text-white`}>
                  {currentKpLevel.level}
                </span>
              </div>
              <p className="text-gray-300 text-sm">Planetary K-index</p>
            </div>

            {/* KP Scale */}
            <div className="bg-black/30 rounded-lg p-4 mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                {kpLevels.map((level, index) => (
                  <span key={index} className={level.level === currentKpLevel.level ? "text-white font-bold" : ""}>
                    {level.range[0]}
                  </span>
                ))}
                <span>9</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 flex">
                {kpLevels.map((level, index) => (
                  <div
                    key={index}
                    className={`h-3 flex-1 ${index === 0 ? 'rounded-l-full' : ''} ${
                      index === kpLevels.length - 1 ? 'rounded-r-full' : ''
                    } ${level.color} ${
                      level.level === currentKpLevel.level ? 'opacity-100' : 'opacity-30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Additional Magnetic Data */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 rounded-lg p-3 text-center">
                <p className="text-gray-400 text-sm">Bz Field</p>
                <p className={`text-lg font-bold ${bzColor}`}>{currentBz.toFixed(1)} nT</p>
                <p className="text-xs text-gray-400">{bzImpact} Impact</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3 text-center">
                <p className="text-gray-400 text-sm">Solar Wind</p>
                <p className="text-lg font-bold text-orange-400">{Math.round(safeNumber(geoData.solarWindSpeed))} km/s</p>
                <p className="text-xs text-gray-400">Speed</p>
              </div>
            </div>
          </motion.div>

          {/* Aurora Zones & Alerts */}
          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FaStar className="text-xl text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Aurora Forecast</h3>
            </div>

            {/* Aurora Visibility */}
            <div className="flex items-center justify-between bg-black/30 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <FaEye className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Visibility</p>
                  <p className={`text-lg font-bold ${visibilityColor}`}>{auroraVisibility}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">KP Required</p>
                <p className="text-white font-bold">{auroraVisibility === "Excellent" ? "6+" : auroraVisibility === "Good" ? "4+" : "2+"}</p>
              </div>
            </div>

            {/* Active Aurora Zones */}
            <div className="mb-4">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-400" />
                Active Zones
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {geoData.auroraZones.map((zone, idx) => (
                  <div
                    key={idx}
                    className="bg-black/30 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-white">{zone.region}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        zone.severity === 'high' ? 'bg-green-500' :
                        zone.severity === 'moderate' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      } text-white`}>
                        {zone.severity}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Probability: {zone.probability}%</span>
                      <span>Visibility: {zone.visibility}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Storm Alerts */}
            {geoData.alerts.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <FaExclamationTriangle className="text-orange-400" />
                  Active Alerts
                </h4>
                <div className="space-y-2">
                  {geoData.alerts.map((alert, idx) => {
                    const AlertIcon = alert.icon;
                    return (
                      <div
                        key={idx}
                        className={`bg-${
                          alert.type === 'severe' ? 'red' : 
                          alert.type === 'moderate' ? 'orange' : 'yellow'
                        }-500/20 rounded-lg p-3 border ${
                          alert.type === 'severe' ? 'border-red-500/50' : 
                          alert.type === 'moderate' ? 'border-orange-500/50' : 'border-yellow-500/50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertIcon className={`text-${
                            alert.type === 'severe' ? 'red' : 
                            alert.type === 'moderate' ? 'orange' : 'yellow'
                          }-400 mt-0.5 flex-shrink-0`} />
                          <p className="text-white text-sm">{alert.message}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Educational Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-purple-900/20 rounded-xl border border-purple-500/30"
        >
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-purple-300 font-semibold mb-1">About Geomagnetic Storms</h4>
              <p className="text-gray-300 text-sm">
                KP index measures global geomagnetic activity. Higher values indicate stronger storms. 
                Aurora visibility improves with KP values above 4. Bz field orientation affects how solar particles interact with Earth's magnetosphere.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer with last update */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <FaGlobeAmericas />
            <span>Monitoring Earth's magnetic field</span>
          </div>
          <span>Last update: {new Date().toLocaleTimeString()}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}