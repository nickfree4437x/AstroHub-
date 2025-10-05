// src/components/compare/PlanetSelector.jsx
import React, { useState, useMemo } from "react";
import { 
  FaSearch, 
  FaRocket, 
  FaGlobeAmericas, 
  FaChevronDown,
  FaSpinner,
  FaTimes
} from "react-icons/fa";

export default function PlanetSelector({ names, selectedName, setSelectedName, loading }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter planets based on search query
  const filteredPlanets = useMemo(() => {
    if (!searchQuery) return names;
    return names.filter(name => 
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [names, searchQuery]);

  // Handle planet selection
  const handlePlanetSelect = (planetName) => {
    setSelectedName(planetName);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedName("");
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <FaRocket className="text-white text-lg" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Select Exoplanet</h3>
          <p className="text-gray-400 text-sm">Choose a planet to compare with Earth</p>
        </div>
      </div>

      {/* Search and Select Container */}
      <div className="relative">
        {/* Main Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 group-hover:text-gray-300 transition-colors" />
          </div>
          
          <input
            type="text"
            value={searchQuery || selectedName}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
              if (!e.target.value) {
                setSelectedName("");
              }
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search for exoplanets..."
            className="w-full pl-10 pr-12 py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300 group-hover:border-gray-600"
          />

          {/* Clear Button */}
          {(selectedName || searchQuery) && (
            <button
              onClick={clearSelection}
              className="absolute inset-y-0 right-12 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>
          )}

          {/* Dropdown Toggle */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <FaChevronDown className={`transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
            {/* Dropdown Header */}
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {filteredPlanets.length} planets found
                </span>
                {loading && (
                  <div className="flex items-center gap-2 text-blue-400 text-sm">
                    <FaSpinner className="animate-spin" />
                    <span>Loading...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Planet List */}
            <div className="py-2">
              {filteredPlanets.length > 0 ? (
                filteredPlanets.map((planetName) => (
                  <button
                    key={planetName}
                    onClick={() => handlePlanetSelect(planetName)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-all duration-200 flex items-center gap-3 group ${
                      selectedName === planetName ? 'bg-blue-500/20 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      selectedName === planetName 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-700 text-gray-400 group-hover:bg-gray-600'
                    }`}>
                      <FaGlobeAmericas className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        selectedName === planetName ? 'text-blue-300' : 'text-white'
                      }`}>
                        {planetName}
                      </div>
                      <div className="text-xs text-gray-400">
                        Click to compare with Earth
                      </div>
                    </div>
                    {selectedName === planetName && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-400">
                  <FaSearch className="text-2xl mx-auto mb-2 opacity-50" />
                  <p>No planets found matching your search</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Planet Display */}
      {selectedName && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FaGlobeAmericas className="text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Selected Planet</h4>
                <p className="text-blue-300 text-sm">{selectedName}</p>
              </div>
            </div>
            <button
              onClick={clearSelection}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Clear selection"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Compare Button */}
      <button
        disabled={!selectedName || loading}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>Loading Comparison...</span>
          </>
        ) : (
          <>
            <FaRocket className="text-lg" />
            <span>Compare {selectedName} with Earth</span>
          </>
        )}
      </button>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-400">{names.length}</div>
          <div className="text-xs text-gray-400">Total Planets</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-400">
            {selectedName ? 1 : 0}
          </div>
          <div className="text-xs text-gray-400">Selected</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-400">
            {filteredPlanets.length}
          </div>
          <div className="text-xs text-gray-400">Filtered</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}