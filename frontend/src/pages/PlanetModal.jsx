import React, { useMemo } from "react";
import { EARTH, computeGravityG, kToC } from "../utils/earth";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from "recharts";

/* ---------------- Modal ---------------- */
export default function PlanetModal({ planet, loading, onClose }) {
  const p = planet;
  const pRadius = p?.radius ?? null;
  const pMass   = p?.mass ?? null;
  const pTempK  = p?.teqK ?? null;
  const pTempC  = pTempK != null ? kToC(pTempK) : null;
  const pOrbit  = p?.orbitalPeriod ?? null;
  const pG      = computeGravityG(pMass, pRadius);

  // Radar data
  const radarDataEarth = useMemo(() => {
    function n(val, idealMin, idealMax, floor=0, ceil=100) {
      if (val == null) return 0;
      const v = Number(val);
      if (v < idealMin) return Math.max(floor, ((v/idealMin)*60));
      if (v > idealMax) return Math.max(floor, ((idealMax/v)*60));
      return ceil;
    }
    const earth = { Gravity: 100, Radius: 100, Mass: 100, Temp: 100, Orbit: 100 };
    const exo = {
      Gravity: n(pG, 0.75, 1.25),
      Radius: n(pRadius, 0.8, 1.8),
      Mass:   n(pMass,   0.8, 5),
      Temp:   n(pTempK, 250, 320),
      Orbit:  n(pOrbit, 200, 600),
    };
    return [
      { metric: "Gravity", Earth: earth.Gravity, Planet: exo.Gravity },
      { metric: "Radius",  Earth: earth.Radius,  Planet: exo.Radius },
      { metric: "Mass",    Earth: earth.Mass,    Planet: exo.Mass },
      { metric: "Temp",    Earth: earth.Temp,    Planet: exo.Temp },
      { metric: "Orbit",   Earth: earth.Orbit,   Planet: exo.Orbit },
    ];
  }, [pG, pRadius, pMass, pTempK, pOrbit]);

  const barsEarth = [
    { name: "Gravity (g)", Earth: EARTH.gravityG, Planet: pG ?? 0 },
    { name: "Radius (R⊕)", Earth: EARTH.radiusRe, Planet: pRadius ?? 0 },
    { name: "Mass (M⊕)",   Earth: EARTH.massMe,   Planet: pMass ?? 0 },
    { name: "Temp (°C)",   Earth: 15,             Planet: pTempC ?? 0 },
    { name: "Year (days)", Earth: EARTH.orbitDays,Planet: pOrbit ?? 0 },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl max-w-5xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2 gap-6 mb-8 mt-6">
          <PlanetCardEarth />
          <PlanetCard planet={p} loading={loading} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <RadarChartBox radarData={radarDataEarth} keys={["Earth","Planet"]} />
          <BarChartBox bars={barsEarth} keys={["Earth","Planet"]} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */
function PlanetCardEarth() {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
      <h2 className="text-xl font-semibold mb-2">🌎 Earth</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Item label="Gravity" value="1.00 g" />
        <Item label="Temp (avg)" value="~15 °C" />
        <Item label="Year length" value="365.25 days" />
        <Item label="Radius" value="1.00 R⊕" />
        <Item label="Mass" value="1.00 M⊕" />
        <Item label="Star Type" value={EARTH.starType} />
      </div>
    </div>
  );
}

function PlanetCard({ planet, loading }) {
  if (!planet) return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 text-gray-400">No planet selected</div>
  );
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
      <h2 className="text-xl font-semibold mb-2">🪐 {planet.name}</h2>
      {loading && <div className="text-xs text-gray-400">Loading...</div>}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Item label="Gravity" value={computeGravityG(planet.mass, planet.radius)?.toFixed(2)+" g"} />
        <Item label="Temp (eq.)" value={planet.teqK ? kToC(planet.teqK).toFixed(0)+" °C" : "—"} />
        <Item label="Year length" value={planet.orbitalPeriod ? planet.orbitalPeriod+" days" : "—"} />
        <Item label="Radius" value={planet.radius ? planet.radius+" R⊕" : "—"} />
        <Item label="Mass" value={planet.mass ? planet.mass+" M⊕" : "—"} />
        <Item label="Star Type" value={planet.starType || "—"} />
      </div>
    </div>
  );
}

function RadarChartBox({ radarData, keys }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            {keys.map((k,i)=>(
              <Radar key={k} name={k} dataKey={k} stroke={i? "#82ca9d":"#8884d8"} fill={i? "#82ca9d":"#8884d8"} fillOpacity={0.4} />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BarChartBox({ bars, keys }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((k,i)=>(
              <Bar key={k} dataKey={k} fill={i? "#82ca9d":"#8884d8"} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div className="bg-gray-950/40 border border-gray-800 rounded-xl px-3 py-2">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
