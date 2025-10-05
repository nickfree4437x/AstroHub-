// src/components/mission/MissionDetailModal.jsx
import React from "react";
import { X, Calendar, MapPin, Users, Rocket, Target, Clock, DollarSign } from "lucide-react";

export default function MissionDetailModal({ mission, onClose }) {
  if (!mission) return null;

  // Format launch date properly
  const formatLaunchDate = (date) => {
    if (!date) return null;
    
    try {
      if (date.$date) {
        const timestamp = parseInt(date.$date.$numberLong || date.$date);
        return new Date(timestamp);
      }
      return new Date(date);
    } catch (error) {
      return null;
    }
  };

  const launchDate = formatLaunchDate(mission.launchDate);
  const timeSinceLaunch = launchDate
    ? Math.floor((Date.now() - launchDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Calculate mission progress (example calculation)
  const calculateMissionProgress = () => {
    if (mission.status === "Completed" || mission.status === "Launch Successful") return 100;
    if (mission.status === "Upcoming") return 0;
    if (mission.status === "Ongoing") return 65; // Example progress
    return 50;
  };

  const missionProgress = calculateMissionProgress();

  // Available data checks
  const hasBasicInfo = mission.agency || mission.destination || mission.type;
  const hasDates = launchDate;
  const hasCrew = mission.crew && (mission.crew > 0 || (typeof mission.crew === 'object' && mission.crew.$numberInt > 0));
  const hasCost = mission.cost && mission.cost !== "N/A";
  const hasDuration = mission.duration && mission.duration !== "N/A";

  // Format crew count
  const getCrewCount = () => {
    if (!mission.crew) return 0;
    if (typeof mission.crew === 'object') return parseInt(mission.crew.$numberInt) || 0;
    return parseInt(mission.crew) || 0;
  };

  const crewCount = getCrewCount();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-700/50 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Header Section */}
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          {mission.image ? (
            <img
              src={mission.image}
              alt={mission.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Rocket className="w-16 h-16 mx-auto mb-2" />
                <p>No Mission Image</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-end justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {mission.name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${
                    mission.status === "Ongoing" || mission.status === "Launch Successful"
                      ? "bg-green-500"
                      : mission.status === "Upcoming"
                      ? "bg-blue-500"
                      : mission.status === "Completed"
                      ? "bg-purple-500"
                      : "bg-gray-500"
                  }`}>
                    {mission.status || "Status Unknown"}
                  </span>
                  {mission.type && (
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-white font-semibold text-sm">
                      {mission.type}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Mission Progress Chart */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Mission Progress
            </h3>
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 font-semibold">Completion Status</span>
                <span className="text-green-400 font-bold text-lg">{missionProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-400 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${missionProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Start</span>
                <span>In Progress</span>
                <span>Complete</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          {hasBasicInfo && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-400" />
                Mission Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Agency */}
                {mission.agency && (
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Rocket className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-gray-400 text-sm font-semibold">Agency</span>
                    </div>
                    <p className="text-white font-bold text-lg truncate">{mission.agency}</p>
                  </div>
                )}

                {/* Destination */}
                {mission.destination && (
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-gray-400 text-sm font-semibold">Destination</span>
                    </div>
                    <p className="text-white font-bold text-lg truncate">{mission.destination}</p>
                  </div>
                )}

                {/* Crew */}
                {hasCrew && (
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-gray-400 text-sm font-semibold">Crew</span>
                    </div>
                    <p className="text-white font-bold text-lg">
                      {crewCount} {crewCount === 1 ? 'Member' : 'Members'}
                    </p>
                  </div>
                )}

                {/* Launch Date */}
                {hasDates && (
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-orange-400" />
                      </div>
                      <span className="text-gray-400 text-sm font-semibold">Launch Date</span>
                    </div>
                    <p className="text-white font-bold text-lg">
                      {launchDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    {timeSinceLaunch && (
                      <p className="text-gray-400 text-sm mt-1">
                        {timeSinceLaunch} days ago
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Duration */}
            {hasDuration && (
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  Mission Duration
                </h4>
                <div className="text-center py-4">
                  <p className="text-3xl font-bold text-white">{mission.duration}</p>
                  <p className="text-gray-400 mt-2">Planned mission timeline</p>
                </div>
              </div>
            )}

            {/* Cost */}
            {hasCost && (
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Mission Cost
                </h4>
                <div className="text-center py-4">
                  <p className="text-3xl font-bold text-white">{mission.cost}</p>
                  <p className="text-gray-400 mt-2">Total mission budget</p>
                </div>
              </div>
            )}
          </div>

          {/* Mission Statistics Visualization */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-400" />
              Mission Statistics
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Success Probability */}
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="219.8"
                      strokeDashoffset="65.94"
                      className="text-green-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">70%</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-2">Success Probability</p>
              </div>

              {/* Risk Assessment */}
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="219.8"
                      strokeDashoffset="131.88"
                      className="text-yellow-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">40%</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-2">Risk Level</p>
              </div>

              {/* Scientific Value */}
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="219.8"
                      strokeDashoffset="43.96"
                      className="text-blue-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">80%</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-2">Scientific Value</p>
              </div>

              {/* Public Interest */}
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="219.8"
                      strokeDashoffset="87.92"
                      className="text-purple-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">60%</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-2">Public Interest</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/20"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}