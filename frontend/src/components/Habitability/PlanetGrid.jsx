import { useState, useEffect } from "react";
import PlanetCard from "./PlanetCard";

export default function PlanetGrid({ planets = [], onCompare, onCardClick, comparisonList = [] }) {
  const [filteredPlanets, setFilteredPlanets] = useState(planets);
  const [sortBy, setSortBy] = useState("default");
  const [filterHabitability, setFilterHabitability] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Apply local filtering, searching & sorting
  useEffect(() => {
    let result = Array.isArray(planets) ? [...planets] : [];

    // 🔍 Search by planet name or host star
    if (searchQuery.trim() !== "") {
      result = result.filter((planet) => {
        const name = planet.name?.toLowerCase() || "";
        const host = planet.hostStar?.toLowerCase() || "";
        return (
          name.includes(searchQuery.toLowerCase()) ||
          host.includes(searchQuery.toLowerCase())
        );
      });
    }

    // 🌍 Filter by habitability range
    if (filterHabitability !== "all") {
      result = result.filter((planet) => {
        const score = planet.habitability?.score || 0;
        if (filterHabitability === "high") return score >= 70;
        if (filterHabitability === "moderate") return score >= 40 && score < 70;
        if (filterHabitability === "low") return score > 0 && score < 40;
        if (filterHabitability === "uninhabitable") return score === 0;
        return true;
      });
    }

    // 🔢 Sorting logic
    switch (sortBy) {
      case "name":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "habitability":
        result.sort(
          (a, b) => (b.habitability?.score || 0) - (a.habitability?.score || 0)
        );
        break;
      case "temperature":
        result.sort((a, b) => (a.teqK || 0) - (b.teqK || 0));
        break;
      case "size":
        result.sort((a, b) => (b.radius || 0) - (a.radius || 0));
        break;
      default:
        break;
    }

    setFilteredPlanets(result);
  }, [planets, searchQuery, filterHabitability, sortBy]);

  const comparisonCount = comparisonList.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-950 p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">🌌 Exoplanet Catalog</h1>
        <p className="text-gray-400">
          Explore {planets.length} discovered exoplanets
        </p>
      </div>

      {/* Filters & Controls */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 mb-8 border border-gray-700 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* 🔍 Search Input */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search planets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full rounded-lg bg-gray-700 border border-gray-600 text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* 🧭 Filter + Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={filterHabitability}
              onChange={(e) => setFilterHabitability(e.target.value)}
              className="rounded-lg bg-gray-700 border border-gray-600 text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Habitability</option>
              <option value="high">High Habitability (≥70)</option>
              <option value="moderate">Moderate (40–70)</option>
              <option value="low">Low (1–40)</option>
              <option value="uninhabitable">Uninhabitable (0)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg bg-gray-700 border border-gray-600 text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="default">Default Order</option>
              <option value="name">Name A–Z</option>
              <option value="habitability">Habitability Score</option>
              <option value="temperature">Temperature (Low→High)</option>
              <option value="size">Size (Large→Small)</option>
            </select>
          </div>
        </div>

        {/* 🌠 Results Count + Compare Status */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-gray-400">
            Showing {filteredPlanets.length} of {planets.length} planets
          </p>

          {comparisonCount > 0 && (
            <div className="flex items-center gap-2 bg-sky-900/40 text-sky-300 py-1 px-3 rounded-full border border-sky-700/30">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span>{comparisonCount} selected for comparison</span>
            </div>
          )}
        </div>
      </div>

      {/* 🪐 Grid of Planets */}
      {filteredPlanets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlanets.map((planet) => (
            <PlanetCard
              key={planet._id || planet.name}
              planet={planet}
              onCompare={onCompare}
              onClick={() => onCardClick(planet)}
              comparisonList={comparisonList}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 mb-6 opacity-50">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No planets found
          </h3>
          <p className="text-gray-400 max-w-md">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </div>
      )}

      {/* 🚀 Floating Compare Button */}
      {comparisonCount > 0 && (
        <button
          onClick={() => {
            // handle comparison view in parent
          }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 px-6 rounded-full shadow-lg flex items-center gap-2 z-10 hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 animate-pulse"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Compare {comparisonCount} Planets
        </button>
      )}
    </div>
  );
}
