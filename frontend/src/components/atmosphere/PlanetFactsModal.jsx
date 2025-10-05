// src/components/atmosphere/PlanetFactsModal.jsx
import React from "react";

export default function PlanetFactsModal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">{data.name || "Planet Facts"}</h2>
        <ul className="text-gray-300 space-y-1 text-sm">
          {data.gravity && <li><strong>Gravity:</strong> {data.gravity} m/s²</li>}
          {data.radius && <li><strong>Radius:</strong> {data.radius} km</li>}
          {data.rotationPeriod && <li><strong>Rotation period:</strong> {data.rotationPeriod} h</li>}
          {data.orbitalPeriod && <li><strong>Orbital period:</strong> {data.orbitalPeriod} days</li>}
          {data.moons && <li><strong>Moons:</strong> {data.moons.join(", ")}</li>}
          {data.special && <li><strong>Special features:</strong> {data.special.join(", ")}</li>}
        </ul>
      </div>
    </div>
  );
}
