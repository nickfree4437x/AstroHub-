// src/components/mission/MissionTimeline.jsx
import React from "react";

export default function MissionTimeline({ missions, onDotClick, filterStatus }) {
  // Filter missions by status if provided
  const filteredMissions = filterStatus
    ? missions.filter(m => m.status === filterStatus)
    : missions;

  // Extract unique years
  const years = [
    ...new Set(filteredMissions.map(m => new Date(m.launchDate).getFullYear()))
  ].sort((a, b) => a - b);

  return (
    <div className="overflow-x-auto py-6 px-2 sm:px-4">
    <div className="flex space-x-6 min-w-max">
      {years.map((year) => {
        const missionsInYear = filteredMissions.filter(
          (m) => new Date(m.launchDate).getFullYear() === year
        );
        return (
          <div key={year} className="flex flex-col items-center">
            <span className="text-white font-bold mb-2">{year}</span>
            <div className="flex space-x-2">
              {missionsInYear.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onDotClick(m)}
                  className={`w-4 h-4 rounded-full border-2 border-white ${
                    m.status === "Ongoing"
                      ? "bg-green-500 animate-pulse"
                      : m.status === "Upcoming"
                      ? "bg-blue-500"
                      : "bg-gray-400"
                  }`}
                  title={`${m.name} (${m.status})`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
  );
}
