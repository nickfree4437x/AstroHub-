// src/components/atmosphere/FullDetailsModal.jsx
import React from "react";
import LayerInfo from "./LayerInfo";
import Atmosphere3DSlider from "./Atmosphere3DSlider";

export default function FullDetailsModal({ planetData, onClose, unitSettings }) {
  if (!planetData) return null;
  const { pressureUnit, tempUnit } = unitSettings;

  const formatPressure = (p, atmUnit) => {
    if (p == null) return "—";
    if (pressureUnit === "Pa") return `${atmUnit === "bar" ? p * 1e5 : p} Pa`;
    if (pressureUnit === "bar") return `${atmUnit === "Pa" ? p / 1e5 : p} bar`;
    return p;
  };

  const formatTemp = (tempStr) => {
    if (!tempStr || tempUnit === "°C") return tempStr || "—";
    return tempStr.replace(/(-?\d+)(°C)/g, (_, n) => `${Number(n) + 273.15}K`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl font-bold"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">{planetData.name || "Planet Full Details"}</h2>

        <div className="text-gray-300 text-sm space-y-3">
          {planetData.gravity && <div><strong>Gravity:</strong> {planetData.gravity} m/s²</div>}
          {planetData.radius && <div><strong>Radius:</strong> {planetData.radius} km</div>}
          {planetData.rotationPeriod && <div><strong>Rotation Period:</strong> {planetData.rotationPeriod} h</div>}
          {planetData.orbitalPeriod && <div><strong>Orbital Period:</strong> {planetData.orbitalPeriod} days</div>}
          {planetData.moons && <div><strong>Moons:</strong> {planetData.moons.join(", ")}</div>}
          {planetData.special && <div><strong>Special Features:</strong> {planetData.special.join(", ")}</div>}

          {planetData.atmosphere && (
            <>
              <h3 className="mt-3 font-semibold">Atmosphere</h3>
              <ul className="list-disc list-inside">
                <li><strong>Mean Molecular Weight:</strong> {planetData.atmosphere.meanMolecularWeight ?? "—"}</li>
                <li><strong>Surface Pressure:</strong> {formatPressure(planetData.atmosphere.surfacePressure, planetData.atmosphere.pressureUnit)}</li>
                <li><strong>Scale Height:</strong> {planetData.atmosphere.scaleHeight ?? "—"} km</li>
              </ul>

              {/* 3D Atmosphere Slider */}
              {planetData.atmosphere.layers && (
                <div className="mt-3 h-80">
                  <Atmosphere3DSlider layers={planetData.atmosphere.layers} planetName={planetData.name} />
                </div>
              )}

              {/* Layers */}
              {planetData.atmosphere.layers && (
                <div className="mt-3">
                  <LayerInfo layers={planetData.atmosphere.layers} tempFormatter={formatTemp} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
