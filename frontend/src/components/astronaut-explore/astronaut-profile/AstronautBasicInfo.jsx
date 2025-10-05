// src/components/astronauts/AstronautBasicInfo.jsx
import React from "react";

export default function AstronautBasicInfo({ astronaut }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-4 text-white">
      <h3 className="text-xl font-semibold mb-2">Astronaut Info</h3>

      {/* Name */}
      <p><strong>Name:</strong> {astronaut.name || "Unknown"}</p>

      {/* DOB */}
      <p>
        <strong>Date of Birth:</strong>{" "}
        {astronaut.date_of_birth ? new Date(astronaut.date_of_birth).toLocaleDateString() : "Unknown"}
      </p>

      {/* Agency */}
      <p><strong>Agency:</strong> {astronaut.agency?.name || "Unknown"}</p>

      {/* Status */}
      <p><strong>Status:</strong> {astronaut.status || "Unknown"}</p>

      {/* Bio */}
      {astronaut.bio && (
        <p className="mt-2"><strong>Bio:</strong> {astronaut.bio}</p>
      )}

      {/* Social Links */}
      <div className="mt-2 flex gap-3">
        {astronaut.twitter && (
          <a href={astronaut.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Twitter</a>
        )}
        {astronaut.instagram && (
          <a href={astronaut.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-400 underline">Instagram</a>
        )}
        {astronaut.wiki && (
          <a href={astronaut.wiki} target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline">Wiki</a>
        )}
      </div>
    </div>
  );
}
