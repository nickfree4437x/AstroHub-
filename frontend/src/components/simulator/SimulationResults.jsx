// src/components/SimulationResults.jsx
import { useState, useEffect } from "react";
import { runSimulationAPI } from "../../lib/api";
import PlanetVisualization from "./PlanetVisualization";

export default function SimulationResults({ input, runTrigger }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState(input?.mode || "human");
  const [params, setParams] = useState(input);

  useEffect(() => {
    setParams(input);
    setMode(input?.mode || "human");
    setResult(null); // Reset result whenever new input arrives
  }, [input]);

  useEffect(() => {
    if (params && runTrigger > 0) {
      handleRunSimulation(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runTrigger, mode]);

  const handleRunSimulation = async (customParams = params) => {
    if (!customParams?.planet) return; // Planet not selected, skip

    setLoading(true);
    setError(null);
    try {
      const payload = {
        planet: customParams.planet || customParams.name || "Custom",
        params: { ...customParams },
        mode,
      };
      delete payload.params.planet;
      delete payload.params.mode;

      const res = await runSimulationAPI(payload);
      setResult(res.result || res);
    } catch (err) {
      console.error(err);
      setError("Simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleParamChange = (key, value) => {
    const updated = { ...params, [key]: value };
    setParams(updated);
  };

  if (!params?.planet) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg shadow-lg text-gray-400">
        <p>Select a planet and run the simulation to see results.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6 text-white">
      {/* Mode Selector */}
      <div className="flex gap-4 mb-4">
        {["human", "microbial", "terraforming"].map((m) => (
          <button
            key={m}
            className={`px-4 py-2 rounded font-semibold ${
              mode === m ? "bg-green-600" : "bg-gray-700"
            }`}
            onClick={() => setMode(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["temp", "water", "o2", "co2", "gravity", "pressure"].map((key) => (
          <div key={key}>
            <label>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {params[key]}
            </label>
            <input
              type="range"
              min={key === "temp" ? -100 : 0}
              max={
                key === "temp"
                  ? 150
                  : key === "o2"
                  ? 50
                  : key === "co2"
                  ? 10
                  : key === "gravity"
                  ? 5
                  : 10
              }
              step={key === "co2" || key === "gravity" || key === "pressure" ? 0.01 : 1}
              value={params[key] || 0}
              onChange={(e) => handleParamChange(key, Number(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => handleRunSimulation()}
        className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded font-semibold mt-4"
      >
        Run Simulation
      </button>

      {loading && <p className="mt-4 text-yellow-300">Running simulation...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Show results only if simulation actually ran */}
      {result && (
        <div className="mt-6 bg-gray-900 p-6 rounded-lg shadow-lg">
          <PlanetVisualization result={result} />

          <div className="flex flex-col items-center mt-4">
            <h3 className="text-2xl font-bold">
              Survivability Score: {result.score}%
            </h3>
            <p className="text-lg mt-1">Status: {result.status}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {["temp", "water", "o2", "co2", "gravity", "pressure", "radiation"].map(
              (f) => (
                <div key={f} className="bg-gray-800 p-4 rounded shadow">
                  <h4 className="font-semibold capitalize">{f}</h4>
                  {result.breakdown && result.breakdown[f] ? (
                    <>
                      <p>Value: {result.breakdown[f].value}</p>
                      <p>Contribution: {result.breakdown[f].contribution}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">Not calculated</p>
                  )}
                </div>
              )
            )}
          </div>

          <div className="bg-gray-800 p-4 rounded shadow mt-4">
            <h4 className="font-bold mb-1">Recommendation:</h4>
            <p>{result.recommendation || result.recommendedPlanet}</p>
          </div>
        </div>
      )}
    </div>
  );
}
