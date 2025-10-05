// src/components/AlertsPanel.jsx
import { useEffect, useState } from "react";
import { fetchSpaceWeatherSummary } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBell, 
  FaExclamationTriangle, 
  FaRadiation, 
  FaSun, 
  FaMagnet,
  FaFilter,
  FaTimes,
  FaVolumeUp,
  FaVolumeMute
} from "react-icons/fa";

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Alert type configurations
  const alertTypes = {
    flare: { 
      label: "Solar Flare", 
      icon: <FaSun className="text-yellow-400" />, 
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30"
    },
    radiation: { 
      label: "Radiation", 
      icon: <FaRadiation className="text-orange-400" />, 
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30"
    },
    geomagnetic: { 
      label: "Geomagnetic", 
      icon: <FaMagnet className="text-purple-400" />, 
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30"
    },
    alert: { 
      label: "General Alert", 
      icon: <FaExclamationTriangle className="text-red-400" />, 
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30"
    }
  };

  // Fetch alerts
  useEffect(() => {
    const getAlerts = async () => {
      try {
        const data = await fetchSpaceWeatherSummary();
        let allAlerts = data.alerts || [];

        // Simulate sample alerts for demonstration
        const sampleAlerts = [
          {
            type: "flare",
            message: "M-Class Solar Flare detected from AR 3421",
            severity: "medium",
            timestamp: new Date().toISOString(),
            read: false
          },
          {
            type: "radiation",
            message: "Radiation levels elevated - proton event ongoing",
            severity: "high",
            timestamp: new Date(Date.now() - 300000).toISOString(),
            read: false
          },
          {
            type: "geomagnetic",
            message: "G1 Geomagnetic Storm in progress",
            severity: "low",
            timestamp: new Date(Date.now() - 600000).toISOString(),
            read: false
          },
          {
            type: "alert",
            message: "Satellite communication may experience disruptions",
            severity: "medium",
            timestamp: new Date(Date.now() - 900000).toISOString(),
            read: false
          }
        ];

        // Combine real and sample alerts
        const combinedAlerts = [...allAlerts, ...sampleAlerts].map(alert => ({
          id: Math.random().toString(36).substr(2, 9),
          ...alert
        }));

        setAlerts(combinedAlerts);
        setUnreadCount(combinedAlerts.filter(a => !a.read).length);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      }
    };

    getAlerts();
    const interval = setInterval(getAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    return alert.type?.toLowerCase() === filter;
  });

  // Mark alert as read
  const markAsRead = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Clear all alerts
  const clearAllAlerts = () => {
    setAlerts([]);
    setUnreadCount(0);
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  // Get severity badge
  const getSeverityBadge = (severity) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    switch(severity) {
      case 'high': return `${baseClasses} bg-red-500/20 text-red-300 border border-red-500/30`;
      case 'medium': return `${baseClasses} bg-yellow-500/20 text-yellow-300 border border-yellow-500/30`;
      case 'low': return `${baseClasses} bg-green-500/20 text-green-300 border border-green-500/30`;
      default: return `${baseClasses} bg-gray-500/20 text-gray-300 border border-gray-500/30`;
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMinutes = Math.floor((now - alertTime) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return alertTime.toLocaleDateString();
  };

  return (
    <motion.div 
      className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg">
              <FaBell className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Space Weather Alerts</h2>
              <p className="text-gray-300">Real-time notifications and warnings</p>
            </div>
          </div>
          
          {/* Alert Badge */}
          {unreadCount > 0 && (
            <motion.div 
              className="flex items-center gap-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute -top-1 -right-1"></div>
                <div className="px-3 py-1 bg-red-500 rounded-full text-white text-sm font-bold">
                  {unreadCount} New
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Alerts", icon: <FaBell /> },
              { key: "flare", label: "Solar Flares", icon: <FaSun /> },
              { key: "radiation", label: "Radiation", icon: <FaRadiation /> },
              { key: "geomagnetic", label: "Geomagnetic", icon: <FaMagnet /> },
            ].map((filterType) => (
              <motion.button
                key={filterType.key}
                onClick={() => setFilter(filterType.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                  filter === filterType.key
                    ? `bg-gradient-to-r ${alertTypes[filterType.key]?.color || 'from-blue-500 to-cyan-500'} text-white shadow-lg`
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                {filterType.icon}
                {filterType.label}
              </motion.button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setSoundEnabled(!soundEnabled)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg border transition-all ${
                soundEnabled 
                  ? "bg-green-500/20 text-green-300 border-green-500/30" 
                  : "bg-gray-500/20 text-gray-300 border-gray-500/30"
              }`}
            >
              {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            </motion.button>
            
            <motion.button
              onClick={clearAllAlerts}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
            >
              <FaTimes />
              Clear All
            </motion.button>
          </div>
        </div>

        {/* Alerts Container */}
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {filteredAlerts.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl text-gray-300 mb-2">No Active Alerts</h3>
                <p className="text-gray-400">All systems are operating normally</p>
              </motion.div>
            ) : (
              filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-2xl border backdrop-blur-sm transition-all cursor-pointer hover:scale-[1.02] ${
                    alert.read 
                      ? 'bg-white/5 border-white/10' 
                      : 'bg-white/10 border-white/20 shadow-lg'
                  } ${alertTypes[alert.type]?.borderColor || 'border-gray-500/30'}`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Alert Icon */}
                      <div className={`p-3 rounded-xl ${alertTypes[alert.type]?.bgColor || 'bg-gray-500/10'}`}>
                        {alertTypes[alert.type]?.icon || <FaExclamationTriangle className="text-gray-400" />}
                      </div>

                      {/* Alert Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-semibold text-white">
                            {alertTypes[alert.type]?.label || 'Alert'}
                          </span>
                          <span className={getSeverityBadge(alert.severity)}>
                            {alert.severity?.toUpperCase() || 'UNKNOWN'}
                          </span>
                          {!alert.read && (
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          )}
                        </div>
                        <p className="text-gray-200 mb-2 leading-relaxed">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{formatTime(alert.timestamp)}</span>
                          {soundEnabled && (
                            <span className="flex items-center gap-1">
                              <FaVolumeUp className="text-xs" />
                              Audio enabled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {!alert.read && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(alert.id);
                        }}
                      >
                        <FaTimes />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer Stats */}
        {filteredAlerts.length > 0 && (
          <motion.div 
            className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>
              Showing {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
              {filter !== 'all' && ` for ${filter}`}
            </span>
            <span>
              {unreadCount} unread • Last updated: {new Date().toLocaleTimeString()}
            </span>
          </motion.div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #ef4444, #f97316);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #dc2626, #ea580c);
        }
      `}</style>
    </motion.div>
  );
}