// src/components/simulator/PlanetVisualization.jsx
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function PlanetVisualization({ result, params, planet }) {
  if (!params && !result) return null;

  // Labels mapping backend keys → chart labels
  const keyMap = {
    temp: "Temperature",
    water: "Water",
    o2: "O₂",
    co2: "CO₂",
    gravity: "Gravity",
    pressure: "Pressure",
    radiation: "Radiation",
  };

  const keys = Object.keys(keyMap);
  const labels = Object.values(keyMap);

  // Planet values (from backend breakdown OR input params)
  const planetValues = keys.map((k) => {
    if (result?.breakdown) {
      return result.breakdown[k]?.value ?? 0;
    } else if (params) {
      return params[k] ?? 0;
    }
    return 0;
  });

  // Earth reference values (baseline)
  const earthValues = [15, 0.71, 21, 0.04, 1, 1, 0]; // radiation = 0 for baseline

  const data = {
    labels,
    datasets: [
      {
        label: planet || "Custom Planet",
        data: planetValues,
        backgroundColor: "rgba(30, 64, 175, 0.3)",
        borderColor: "rgba(30, 64, 175, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(30, 64, 175, 1)",
      },
      {
        label: "Earth",
        data: earthValues,
        backgroundColor: "rgba(34,197,94,0.3)",
        borderColor: "rgba(34,197,94,1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(34,197,94,1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: Math.max(...planetValues.concat(earthValues)) * 1.2 || 10,
      },
    },
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4">
      <h3 className="text-center text-white font-bold text-lg mb-2">
        {planet || "Custom Planet"} Overview
      </h3>
      <Radar data={data} options={options} />
      {result && (
        <div className="mt-4 text-white text-center">
          <p className="font-semibold">
            Survivability Score: {result.score ?? "N/A"}%
          </p>
          <p>Status: {result.status ?? "N/A"}</p>
        </div>
      )}
    </div>
  );
}
