// src/components/PlanetCompare.jsx
import React from "react";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { XMarkIcon } from "@heroicons/react/24/solid"; // ✅ Heroicons cancel icon

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function PlanetCompare({ planets = [], onClose }) {
  if (planets.length < 2) return null; // need at least 2 planets to compare

  const labels = ["Temp", "Radius", "Mass", "Water", "Gravity", "Atmosphere"];
  const datasets = planets.map(p => ({
    label: p.name,
    data: [
      p.habitability?.breakdown.temp?.score100 ?? 0,
      p.habitability?.breakdown.radius?.score100 ?? 0,
      p.habitability?.breakdown.mass?.score100 ?? 0,
      p.habitability?.breakdown.water?.contribution ?? 0,
      p.habitability?.breakdown.gravity?.contribution ?? 0,
      p.habitability?.breakdown.atmosphere?.contribution ?? 0,
    ],
    fill: true,
    backgroundColor: `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.2)`,
    borderColor: `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 1)`,
    pointBackgroundColor: "white",
    pointBorderColor: "black",
  }));

  const closest = planets.reduce(
    (a, b) => ((a.habitability?.score ?? 0) > (b.habitability?.score ?? 0) ? a : b),
    planets[0]
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-5xl relative overflow-y-auto max-h-[90vh] p-6">
        
        {/* Close Button Top-Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-200 hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Planet Comparison</h2>
        <p className="text-gray-300 mb-4">
          Closest to Earth-like: <span className="text-green-400">{closest.name}</span>
        </p>

        <Radar
          data={{ labels, datasets }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                angleLines: { display: true },
                suggestedMin: 0,
                suggestedMax: 100,
              },
            },
          }}
          className="h-96"
        />

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {planets.map(p => (
            <div key={p._id || p.name} className="bg-gray-800 p-4 rounded shadow">
              <h3 className="text-white font-semibold mb-2">{p.name}</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                {labels.map((f, idx) => (
                  <li key={idx}>{f}: {datasets.find(d => d.label === p.name)?.data[idx]}</li>
                ))}
              </ul>
              <span className="mt-2 inline-block text-white bg-blue-600 px-3 py-1 rounded font-medium">
                Total Score: {p.habitability?.score ?? "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
