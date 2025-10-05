// src/components/astronauts/AstronautMissionList.jsx
import React from "react";

export default function AstronautMissionList({ astronaut }) {
  if (!astronaut) return null;

  // Map boolean in_space to readable string
  const inSpaceText = astronaut.in_space ? "Yes" : "No";

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-4 text-white">
      <h3 className="text-xl font-semibold mb-2">Space Mission Stats</h3>
      <ul className="space-y-2">
        {astronaut.evaTimeHours ? (
          <li>EVA Time (hrs): {astronaut.evaTimeHours.toFixed(1)}</li>
        ) : null}
        {astronaut.firstFlightYear ? (
          <li>First Flight Year: {astronaut.firstFlightYear}</li>
        ) : null}
        {astronaut.first_flight ? (
          <li>First Flight Date: {new Date(astronaut.first_flight).toLocaleDateString()}</li>
        ) : null}
        <li>Currently in Space: {inSpaceText}</li>
        {astronaut.landings_count ? (
          <li>Landings: {astronaut.landings_count}</li>
        ) : null}
        {astronaut.last_flight ? (
          <li>Last Flight Date: {new Date(astronaut.last_flight).toLocaleDateString()}</li>
        ) : null}
      </ul>
    </div>
  );
}
