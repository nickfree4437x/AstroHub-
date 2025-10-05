// src/components/explorer/PlanetFilters.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlanetFilters({
  search,
  setSearch,
  filterMethod,
  setFilterMethod,
  filterYear,
  setFilterYear,
  maxDistance,
  setMaxDistance,
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
  planets,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // ✅ Discovery Method Filter
  const methods = useMemo(() => {
    const methodSet = new Set();
    planets.forEach((p) => {
      const method = p.discoveryMethod ?? p.discoverymethod ?? "Unknown";
      if (method && method !== "Unknown") {
        methodSet.add(method);
      }
    });
    return ["All", ...Array.from(methodSet).sort()];
  }, [planets]);

  const planetNames = useMemo(() => {
    return Array.from(new Set(planets.map(p => p.name ?? p.pl_name).filter(Boolean)));
  }, [planets]);

  // Handle search input changes and show suggestions
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    
    if (value.length > 1) {
      const filteredSuggestions = planetNames.filter(name =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.div 
      className="w-full mb-8 p-6 backdrop-blur-xl bg-black/40 rounded-3xl border border-white/10 shadow-2xl relative z-40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-end justify-between">
        {/* Search with autocomplete */}
        <div className="relative flex-1 min-w-[250px]" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search planets..."
              value={search}
              onChange={handleSearchChange}
              onFocus={() => search.length > 1 && setShowSuggestions(true)}
              className="pl-10 pr-4 py-3 w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 w-full mt-1 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  style={{ top: '100%' }}
                >
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-4 py-3 cursor-pointer hover:bg-purple-600/20 transition-colors border-b border-white/5 last:border-b-0"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400">🌍</span>
                        <span className="text-white">{suggestion}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Discovery Method Filter */}
        <div className="flex flex-col min-w-[180px]">
          <label className="text-sm text-gray-400 mb-2 font-medium">Discovery Method</label>
          <div className="relative">
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {methods.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Distance Slider */}
        <div className="flex flex-col min-w-[220px]">
          <label className="text-sm text-gray-400 mb-2 font-medium">
            Max Distance: <span className="text-cyan-400">{maxDistance} ly</span>
          </label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0 ly</span>
            <span>10,000 ly</span>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-col min-w-[200px]">
          <label className="text-sm text-gray-400 mb-2 font-medium">Sort By</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              >
                {["name", "distance", "radius", "mass", "discoveryYear"].map((k) => (
                  <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all flex items-center justify-center min-w-[60px]"
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              {sortOrder === "asc" ? (
                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Global styles to fix white background on focus */}
      <style jsx global>{`
        /* Fix for white background on inputs in dark mode */
        input, select, textarea {
          color-scheme: dark;
        }
        
        /* Remove default white background on autofill */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        select:-webkit-autofill,
        select:-webkit-autofill:hover,
        select:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.05) inset;
          transition: background-color 5000s ease-in-out 0s;
          color: white;
        }
        
        /* Custom slider thumb */
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .flex-col.lg\\:flex-row {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          
          .min-w-\\[180px\\], .min-w-\\[220px\\], .min-w-\\[200px\\] {
            min-width: 100%;
          }
        }
      `}</style>
    </motion.div>
  );
}