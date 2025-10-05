// src/components/astronauts/AstronautAchievements.jsx
import React from "react";

export default function AstronautAchievements({ astronaut }) {
  // Collect meaningful stats
  const stats = [
    { label: "EVA Count", value: astronaut.EVAcount },
    { label: "Total Space Hours", value: astronaut.totalSpaceHours || astronaut.timeInSpaceHours },
    { label: "Flights", value: astronaut.flights_count },
    { label: "Landings", value: astronaut.landings_count },
    { label: "Spacewalks", value: astronaut.spacewalks_count },
    { label: "Age", value: astronaut.age },
  ].filter(s => s.value && s.value > 0);

  const hasAchievements = astronaut.achievements?.length > 0;
  const hasBadges = astronaut.badges?.length > 0;

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-4 text-white">
      <h3 className="text-xl font-semibold mb-2">Achievements & Stats</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {hasAchievements &&
          astronaut.achievements.map((a, i) => (
            <span
              key={i}
              className="bg-green-500 text-black px-2 py-1 rounded-full text-sm"
            >
              {a}
            </span>
          ))}

        {stats.length > 0 &&
          stats.map((s, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded-full text-sm ${
                s.label === "EVA Count"
                  ? "bg-blue-500 text-black"
                  : s.label === "Total Space Hours"
                  ? "bg-purple-500 text-black"
                  : s.label === "Flights"
                  ? "bg-indigo-500 text-black"
                  : "bg-gray-600 text-white"
              }`}
            >
              {s.label}: {Number(s.value).toFixed(1)}
            </span>
          ))}

        {hasBadges &&
          astronaut.badges.map((b, i) => (
            <span
              key={`badge-${i}`}
              className="bg-yellow-500 text-black px-2 py-1 rounded-full text-sm"
            >
              {b}
            </span>
          ))}
      </div>

      {/* Optional: Bio preview */}
      {astronaut.bio && (
        <p className="text-gray-300 text-sm">
          {astronaut.bio.length > 100
            ? astronaut.bio.slice(0, 100) + "..."
            : astronaut.bio}
        </p>
      )}
    </div>
  );
}
