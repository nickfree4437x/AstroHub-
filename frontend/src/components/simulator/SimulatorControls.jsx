// src/components/simulator/SimulatorControls.jsx
import { useState, useEffect } from "react";
import { usePlanets } from "../../hooks/usePlanets";

export default function SimulatorControls({ onChange, onRunSimulation }) {
  const { planets, loading } = usePlanets();

  const [selectedPlanet, setSelectedPlanet] = useState("");
  const [mode, setMode] = useState("human");

  const [params, setParams] = useState({
    tempC: 15,
    water: 0.5,
    o2: 21,
    co2: 0.04,
    nitrogen: 78,
    toxicGases: 0,
    radiation: "low",
    gravity: 1,
    pressure: 1,
    elements: ["C", "H", "O", "N", "P", "S"],
  });

  // Inform parent whenever params or selectedPlanet or mode changes
  useEffect(() => {
    if (onChange) onChange(selectedPlanet || "custom", { ...params, mode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, selectedPlanet, mode]);

  const handleChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleElementToggle = (el) => {
    setParams(prev => ({
      ...prev,
      elements: prev.elements.includes(el) ? prev.elements.filter(e => e !== el) : [...prev.elements, el],
    }));
  };

  const handlePlanetSelect = (e) => {
    const name = e.target.value;
    setSelectedPlanet(name);

    const planetData = planets.find(p => p.name === name);
    if (planetData) {
      const updated = {
        ...params,
        tempC: planetData.teqK ? Math.round(planetData.teqK - 273.15) : 15,
        water: planetData.waterPresence ?? 0.5,
        gravity:
          planetData.radius && planetData.mass
            ? Number((planetData.mass / Math.pow(planetData.radius / 6371, 2)) / 5.972e24)
            : 1,
        pressure: 1,
        radiation: "low",
      };
      setParams(updated);
    }
  };

  const handleRun = () => {
    if (!selectedPlanet) return;
    if (onRunSimulation) {
      const payload = {
        planet: selectedPlanet,
        mode,
        params,
      };
      onRunSimulation(payload);
    }
  };

  return (
    <section className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Simulation Controls</h2>

      {/* Planet Selection */}
      <div className="mb-4">
        <label className="block mb-1">Select Planet (required):</label>
        <select
          className="bg-gray-800 p-2 rounded w-full"
          value={selectedPlanet}
          onChange={handlePlanetSelect}
        >
          <option value="">-- Select Planet --</option>
          {loading ? (
            <option>Loading...</option>
          ) : (
            planets.map(p => <option key={p.name} value={p.name}>{p.name}</option>)
          )}
        </select>
        {!selectedPlanet && <p className="text-sm text-red-400 mt-1">Please select a planet to enable simulation.</p>}
      </div>

      {/* Mode */}
      <div className="mb-4">
        <label className="block mb-1">Mode:</label>
        <select
          className="bg-gray-800 p-2 rounded w-full"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="human">Human Survival</option>
          <option value="microbial">Microbial Survival</option>
          <option value="terraforming">Terraforming Mode</option>
        </select>
      </div>

      {/* Parameters */}
      <div className="space-y-4">
        <div>
          <label>Surface Temp (°C): {params.tempC}</label>
          <input
            type="range"
            min="-100" max="150"
            value={params.tempC}
            onChange={(e) => handleChange("tempC", Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label>Water (0–1): {params.water}</label>
          <input
            type="range"
            min="0" max="1" step="0.01"
            value={params.water}
            onChange={(e) => handleChange("water", Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label>O₂ (%):</label>
            <input
              type="number"
              min="0" max="100"
              value={params.o2}
              onChange={(e) => handleChange("o2", Number(e.target.value))}
              className="w-full bg-gray-800 p-2 rounded"
            />
          </div>
          <div>
            <label>CO₂ (%):</label>
            <input
              type="number"
              min="0" max="100" step="0.01"
              value={params.co2}
              onChange={(e) => handleChange("co2", Number(e.target.value))}
              className="w-full bg-gray-800 p-2 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label>Gravity (g):</label>
            <input
              type="number"
              min="0.1" max="5" step="0.01"
              value={params.gravity}
              onChange={(e) => handleChange("gravity", Number(e.target.value))}
              className="w-full bg-gray-800 p-2 rounded"
            />
          </div>
          <div>
            <label>Pressure (atm):</label>
            <input
              type="number"
              min="0.1" max="10" step="0.01"
              value={params.pressure}
              onChange={(e) => handleChange("pressure", Number(e.target.value))}
              className="w-full bg-gray-800 p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label>Radiation:</label>
          <select
            className="w-full bg-gray-800 p-2 rounded"
            value={params.radiation}
            onChange={(e) => handleChange("radiation", e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label>Biosignature Elements:</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {["C", "H", "O", "N", "P", "S"].map(el => (
              <button
                key={el}
                type="button"
                className={`px-2 py-1 rounded ${params.elements.includes(el) ? "bg-green-500" : "bg-gray-700"}`}
                onClick={() => handleElementToggle(el)}
              >
                {el}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Run Simulation */}
      <button
        className={`mt-6 px-6 py-3 rounded-lg font-semibold w-full ${selectedPlanet ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-700 cursor-not-allowed"}`}
        onClick={handleRun}
        disabled={!selectedPlanet}
      >
        Run Simulation
      </button>
    </section>
  );
}
