// src/components/compare/AiNarrative.jsx
import React from "react";

export default function AiNarrative({ planet, aiNarrative, narrativeLoading }) {
  if (!planet) return null;

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 text-gray-300 mt-6">
      <h2 className="text-xl font-semibold mb-2">Insights</h2>
      {narrativeLoading
        ? <p className="text-sm text-gray-400">Generating insights...</p>
        : <p>{aiNarrative}</p>
      }
    </div>
  );
}
