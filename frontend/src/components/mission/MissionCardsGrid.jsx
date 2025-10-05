// src/components/mission/MissionCardsGrid.jsx
import React from "react";
import MissionCard from "./MissionCard";

export default function MissionCardsGrid({ missions, onExplore, loading = false }) {
  return (
    <section className="p-4 sm:p-6 max-w-full mx-auto">
      {/* Section Header */}
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center relative inline-block">
        All Missions
        <span className="absolute left-1/2 -bottom-2 w-20 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full -translate-x-1/2" />
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="h-64 bg-gray-800 rounded-xl animate-pulse shadow-lg"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && (!missions || missions.length === 0) && (
        <div className="text-center text-gray-400 py-12">
          <p className="text-xl">No missions found matching your criteria.</p>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters or search.
          </p>
        </div>
      )}

      {/* Missions Grid */}
      {!loading && missions && missions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {missions.map((m) => (
            <MissionCard key={m.missionId || m.id} mission={m} onExplore={onExplore} />
          ))}
        </div>
      )}
    </section>
  );
}
