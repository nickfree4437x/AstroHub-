// src/pages/SurvivabilitySimulator.jsx
import { useState } from "react";
import SimulatorHero from "../components/simulator/SimulatorHero";
import SimulatorControls from "../components/simulator/SimulatorControls";
import SimulationResults from "../components/simulator/SimulationResults";
import PlanetVisualization from "../components/simulator/PlanetVisualization";

export default function SurvivabilitySimulator() {
  const [simulationData, setSimulationData] = useState(null);
  const [runTrigger, setRunTrigger] = useState(0);

  // Called when controls update planet/params
  const handleInputChange = (planet, paramsWithMode) => {
    const { mode, ...params } = paramsWithMode || {};
    setSimulationData(prev => ({
      ...prev,
      planet,
      params,
      mode: mode || prev?.mode || "human",
    }));
  };

  // Called when Run button clicked
  const handleRunSimulation = (payload) => {
    if (!payload) return;
    setSimulationData({
      planet: payload.planet,
      params: payload.params,
      mode: payload.mode,
    });
    setRunTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <SimulatorHero />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <SimulatorControls
            onChange={handleInputChange}
            onRunSimulation={handleRunSimulation}
          />

          {/* Preview card on right */}
          <div>
            {simulationData?.params ? (
              <PlanetVisualization
                planet={simulationData.planet}
                params={simulationData.params}
              />
            ) : (
              <div className="p-6 bg-gray-900 rounded-lg shadow-lg text-gray-400">
                <p>Select a planet to preview its parameters here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Show results ONLY after user presses Run */}
        {simulationData?.planet && runTrigger > 0 && (
          <SimulationResults input={simulationData} runTrigger={runTrigger} />
        )}
      </div>
    </div>
  );
}
