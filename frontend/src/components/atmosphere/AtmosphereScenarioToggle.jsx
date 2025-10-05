// src/components/atmosphere/AtmosphereScenarioToggle.jsx
import React from "react";

export default function AtmosphereScenarioToggle({ scenario, setScenario }) {
  return (
    <div className="flex gap-2 items-center mb-4">
      <label className="text-sm">Atmosphere Scenario:</label>
      <select
        value={scenario}
        onChange={e => setScenario(e.target.value)}
        className="bg-gray-900 border border-gray-700 px-2 py-1 rounded text-sm"
      >
        <option value="current">Current</option>
        <option value="historical">Historical</option>
        <option value="hypothetical">Hypothetical</option>
      </select>
    </div>
  );
}
