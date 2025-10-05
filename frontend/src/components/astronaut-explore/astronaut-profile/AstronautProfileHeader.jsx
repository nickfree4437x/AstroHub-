// src/components/astronauts/AstronautProfileHeader.jsx
import React from "react";

export default function AstronautProfileHeader({ astronaut }) {
  return (
    <div className="flex items-center gap-6 bg-gray-800 p-4 rounded-xl shadow-lg">
      {/* Profile Image */}
      <div className="relative">
        <img
          src={astronaut.profileImage || "/default-avatar.png"}
          alt={astronaut.name}
          className="w-28 h-28 rounded-full object-cover border-4 border-gray-700 shadow-md"
        />
        {astronaut.in_space && (
          <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800" title="Currently in Space"></span>
        )}
      </div>

      {/* Name & Agency Info */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold">{astronaut.name}</h2>

        <div className="flex items-center gap-3 mt-2">
          {astronaut.flagUrl && (
            <img
              src={astronaut.flagUrl}
              alt={astronaut.nationality}
              className="w-6 h-4 rounded-sm border border-gray-600"
            />
          )}

          {astronaut.agency?.logo_url && (
            <img
              src={astronaut.agency.logo_url}
              alt={astronaut.agency.name}
              className="w-10 h-10 rounded-sm border border-gray-600"
            />
          )}

          {astronaut.agency?.name && (
            <span className="bg-gray-700 px-2 py-0.5 rounded text-sm font-medium text-gray-200">
              {astronaut.agency.name}
            </span>
          )}
        </div>

        {astronaut.status && (
          <p className="mt-1 text-sm text-gray-400">Status: {astronaut.status}</p>
        )}
      </div>
    </div>
  );
}
