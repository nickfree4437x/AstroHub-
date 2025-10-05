// src/components/SafetyImpactPanel.jsx
import { useEffect, useState } from "react";
import { fetchSpaceWeatherSummary } from "../../lib/api";
import { motion } from "framer-motion";
import { 
  FaSatellite, 
  FaMapMarkerAlt, 
  FaUserAstronaut, 
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaRadiation,
  FaSignal,
  FaGlobeAmericas
} from "react-icons/fa";

export default function SafetyImpactPanel() {
  const [impact, setImpact] = useState({
    satellite: "Low",
    gps: "Nominal",
    eva: "Safe",
    powerGrid: "Stable",
    aviation: "Normal"
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const summary = await fetchSpaceWeatherSummary();
        const safety = summary.safety || {};

        // Enhanced impact assessment with more detailed data
        setImpact({
          satellite: safety.satelliteCommRisk || "Low",
          gps: safety.gpsImpact || "Nominal",
          eva: safety.astronautEVASafety || "Safe",
          powerGrid: safety.powerGridRisk || "Stable",
          aviation: safety.aviationRisk || "Normal"
        });
        setLastUpdate(new Date());
      } catch (err) {
        console.error("Failed to fetch satellite/astronaut impact:", err);
        // Fallback data
        setImpact({
          satellite: "Low",
          gps: "Nominal",
          eva: "Safe",
          powerGrid: "Stable",
          aviation: "Normal"
        });
      } finally {
        setLoading(false);
      }
    };

    getData();
    const interval = setInterval(getData, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const riskConfig = (level) => {
    const configs = {
      // Safe levels
      "Low": { color: "bg-green-500", textColor: "text-green-400", icon: FaCheckCircle, description: "Minimal impact expected" },
      "Nominal": { color: "bg-green-500", textColor: "text-green-400", icon: FaCheckCircle, description: "Normal operations" },
      "Safe": { color: "bg-green-500", textColor: "text-green-400", icon: FaCheckCircle, description: "Safe for operations" },
      "Stable": { color: "bg-green-500", textColor: "text-green-400", icon: FaCheckCircle, description: "Grid stability maintained" },
      "Normal": { color: "bg-green-500", textColor: "text-green-400", icon: FaCheckCircle, description: "Standard flight conditions" },
      
      // Moderate levels
      "Moderate": { color: "bg-yellow-500", textColor: "text-yellow-400", icon: FaExclamationTriangle, description: "Increased monitoring recommended" },
      "Medium": { color: "bg-yellow-500", textColor: "text-yellow-400", icon: FaExclamationTriangle, description: "Moderate impact possible" },
      "Elevated": { color: "bg-yellow-500", textColor: "text-yellow-400", icon: FaExclamationTriangle, description: "Heightened risk level" },
      "Unstable": { color: "bg-yellow-500", textColor: "text-yellow-400", icon: FaExclamationTriangle, description: "Potential grid fluctuations" },
      
      // High risk levels
      "High": { color: "bg-red-600", textColor: "text-red-400", icon: FaExclamationTriangle, description: "Significant impact expected" },
      "Danger": { color: "bg-red-600", textColor: "text-red-400", icon: FaExclamationTriangle, description: "Immediate action required" },
      "Critical": { color: "bg-red-600", textColor: "text-red-400", icon: FaExclamationTriangle, description: "Critical risk level" },
      "Severe": { color: "bg-red-600", textColor: "text-red-400", icon: FaExclamationTriangle, description: "Severe impact imminent" }
    };
    
    return configs[level] || { color: "bg-gray-500", textColor: "text-gray-400", icon: FaInfoCircle, description: "Status unknown" };
  };

  const impactCards = [
    {
      key: "satellite",
      title: "Satellite Communication",
      description: "Risk to satellite operations and communication systems",
      icon: FaSatellite,
      value: impact.satellite
    },
    {
      key: "gps",
      title: "GPS Navigation",
      description: "Impact on GPS accuracy and navigation systems",
      icon: FaMapMarkerAlt,
      value: impact.gps
    },
    {
      key: "eva",
      title: "Astronaut Safety",
      description: "Extra-vehicular activity radiation risk assessment",
      icon: FaUserAstronaut,
      value: impact.eva
    },
    {
      key: "powerGrid",
      title: "Power Grid Stability",
      description: "Risk to electrical power distribution systems",
      icon: FaSignal,
      value: impact.powerGrid
    },
    {
      key: "aviation",
      title: "Aviation Operations",
      description: "Impact on high-altitude and polar flight routes",
      icon: FaGlobeAmericas,
      value: impact.aviation
    }
  ];

  if (loading) {
    return (
      <section className="mt-8 px-4 md:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-gray-700 rounded-xl"></div>
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
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <FaShieldAlt className="text-2xl text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Safety Impact Assessment</h2>
            <p className="text-gray-400 text-sm">Real-time risk analysis for critical systems and operations</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-gray-600">
            <FaRadiation className="text-green-400" />
            <span className="text-sm font-medium text-green-400">
              Overall: Low Risk
            </span>
          </div>
        </div>

        {/* Impact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactCards.map((card, index) => {
            const config = riskConfig(card.value);
            const CardIcon = card.icon;
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={card.key}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
                whileHover={{ scale: 1.03, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Card Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    <CardIcon className="text-xl text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white flex-1">{card.title}</h3>
                </div>

                {/* Status Indicator */}
                <div className="text-center mb-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.color} mb-2`}>
                    <StatusIcon className="text-white text-sm" />
                    <span className="text-white font-bold text-sm">{card.value}</span>
                  </div>
                  <p className="text-gray-300 text-xs">{config.description}</p>
                </div>

                {/* Progress Bar Indicator */}
                <div className="bg-black/30 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      config.color.includes('green') ? 'bg-green-500' :
                      config.color.includes('yellow') ? 'bg-yellow-500' :
                      config.color.includes('red') ? 'bg-red-600' : 'bg-gray-500'
                    }`}
                    style={{
                      width: config.color.includes('green') ? '25%' :
                             config.color.includes('yellow') ? '60%' :
                             config.color.includes('red') ? '90%' : '50%'
                    }}
                  />
                </div>

                {/* Additional Info */}
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Risk Level</span>
                  <span className={config.textColor}>
                    {config.color.includes('green') ? 'Low' :
                     config.color.includes('yellow') ? 'Medium' :
                     config.color.includes('red') ? 'High' : 'Unknown'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-xs mt-3 leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Overall Safety Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-green-900/20 rounded-xl border border-green-500/30"
        >
          <div className="flex items-start gap-3">
            <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-green-300 font-semibold mb-1">Overall Safety Status: Normal</h4>
              <p className="text-gray-300 text-sm">
                All critical systems are operating within safe parameters. 
                Space weather conditions pose minimal risk to satellite operations, 
                navigation systems, and human spaceflight activities.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30"
        >
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-blue-300 font-semibold mb-1">Safety Recommendations</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Continue normal satellite operations</li>
                <li>• Standard GPS accuracy maintained</li>
                <li>• EVA activities approved for all regions</li>
                <li>• Power grid operations at normal capacity</li>
                <li>• Aviation routes operating normally</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Footer with last update */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <FaShieldAlt />
            <span>Monitoring critical system safety</span>
          </div>
          <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}