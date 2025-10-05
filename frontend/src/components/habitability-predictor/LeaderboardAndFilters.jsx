import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaderboardAndFilters = () => {
  const [planets, setPlanets] = useState([]);
  const [search, setSearch] = useState("");
  const [showHabitableOnly, setShowHabitableOnly] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState([0, 2000]); // in ly
  const [tempFilter, setTempFilter] = useState([0, 5000]); // in K

  // Fetch planets
  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/habitability/planets");
        setPlanets(res.data);
      } catch (err) {
        console.error("❌ Error fetching planets:", err.message);
      }
    };
    fetchPlanets();
  }, []);

  // Apply filters + sorting
  const filteredPlanets = planets
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => (showHabitableOnly ? p.habitability_label === 1 : true))
    .filter((p) => p.distance_ly >= distanceFilter[0] && p.distance_ly <= distanceFilter[1])
    .filter((p) => p.temp_k >= tempFilter[0] && p.temp_k <= tempFilter[1])
    .sort((a, b) => b.habitability_score - a.habitability_score)
    .slice(0, 10);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        🏆 Top 10 Most Habitable Planets
      </h2>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search planet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 w-full"
        />

        {/* Habitable Toggle */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showHabitableOnly}
            onChange={() => setShowHabitableOnly(!showHabitableOnly)}
          />
          <span>🌍 Show Only Habitable</span>
        </label>

        {/* Distance Filter */}
        <div>
          <label className="block text-sm">Distance (ly)</label>
          <input
            type="range"
            min="0"
            max="5000"
            value={distanceFilter[1]}
            onChange={(e) => setDistanceFilter([0, parseInt(e.target.value)])}
            className="w-full"
          />
          <p className="text-sm">0 - {distanceFilter[1]} ly</p>
        </div>

        {/* Temperature Filter */}
        <div>
          <label className="block text-sm">Temperature (K)</label>
          <input
            type="range"
            min="0"
            max="10000"
            value={tempFilter[1]}
            onChange={(e) => setTempFilter([0, parseInt(e.target.value)])}
            className="w-full"
          />
          <p className="text-sm">0 - {tempFilter[1]} K</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 rounded-lg">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 text-left">Rank</th>
              <th className="p-2 text-left">Planet</th>
              <th className="p-2 text-center">Habitability Score</th>
              <th className="p-2 text-center">Distance (ly)</th>
              <th className="p-2 text-center">Temp (K)</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlanets.map((planet, index) => (
              <tr
                key={planet.name}
                className="hover:bg-gray-800 transition"
              >
                <td className="p-2">#{index + 1}</td>
                <td className="p-2 font-semibold">{planet.name}</td>
                <td
                  className={`p-2 text-center font-bold ${
                    planet.habitability_label === 1
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {planet.habitability_score}
                </td>
                <td className="p-2 text-center">{planet.distance_ly}</td>
                <td className="p-2 text-center">{planet.temp_k}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredPlanets.length === 0 && (
        <p className="text-center mt-6 text-gray-400">
          ❌ No planets match the selected filters.
        </p>
      )}
    </div>
  );
};

export default LeaderboardAndFilters;
