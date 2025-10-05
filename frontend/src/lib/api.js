// src/lib/api.js
const API_BASE = import.meta.env.VITE_API_URL || "https://astrohub-aqac.onrender.com/api/v1";

/* ------------------------------
   🔧 Common Fetch Helper
--------------------------------*/
export async function request(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Request failed: ${res.status} ${res.statusText} → ${text}`);
    }
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) return res.json();
    if (contentType.includes("text/")) return res.text();
    return res.blob();
  } catch (err) {
    console.error("❌ API Error:", err);
    throw err;
  }
}

/* ------------------------------
   🛠️ Query String Builder
--------------------------------*/
export function qs(params = {}) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) v.forEach((x) => p.append(k, x));
    else p.append(k, String(v));
  });
  const s = p.toString();
  return s ? `?${s}` : "";
}

/* ------------------------------
   🌍 PLANETS API
--------------------------------*/
export const fetchMeta = () => request(`${API_BASE}/planets/meta`);

export const fetchPlanets = (params = {}) =>
  request(`${API_BASE}/planets${qs(params)}`);

export const fetchPlanetDetail = (name) =>
  request(`${API_BASE}/planets/${encodeURIComponent(name)}`);

export const fetchPlanetNames = () =>
  request(`${API_BASE}/planets/names`);

export const comparePlanets = (planetNames = []) => {
  if (!planetNames || !Array.isArray(planetNames) || planetNames.length < 2) {
    throw new Error("You must provide at least 2 planets to compare (Earth + selected).");
  }

  const payload = { planetB: planetNames[1] };

  return request(`${API_BASE}/planets/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

/* ------------------------------
   Export planets
--------------------------------*/
export async function exportPlanets(params = {}, format = "csv") {
  const url = `${API_BASE}/planets/export${qs({ ...params, format })}`;
  const res = await request(url);
  return format === "json" ? res : res;
}

/* ------------------------------
   🚀 MISSIONS API
--------------------------------*/
export const fetchMissions = (params = {}) =>
  request(`${API_BASE}/missions${qs(params)}`);

/**
 * Fetch a single mission by its ID
 * @param {string|number} id - Mission ID
 */
export const fetchMissionById = (id) => {
  if (!id) throw new Error("fetchMissionById: ID is required");
  return request(`${API_BASE}/missions/${encodeURIComponent(id)}`);
};

/**
 * Compare multiple missions
 * @param {Array<string|number>} ids - Array of mission IDs
 */
export const compareMissions = (ids = []) => {
  if (!Array.isArray(ids) || ids.length < 2) {
    throw new Error(
      "compareMissions: Provide at least 2 mission IDs to compare"
    );
  }

  return request(`${API_BASE}/missions/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
};


export const fetchTimeline = () =>
  request(`${API_BASE}/missions/timeline`);

/* ------------------------------
   🌌 SPACE WEATHER API
--------------------------------*/
export const fetchSpaceWeatherSummary = async () => {
  const data = await request(`${API_BASE}/space/summary`);
  return data || { kp: null, solarWind: null, goes: [] };
};

export const fetchKpIndex = async () => {
  const data = await request(`${API_BASE}/space/kp`);
  return data?.kp || null;
};

export const fetchSolarWind = async () => {
  const data = await request(`${API_BASE}/space/solar-wind`);
  return data?.solarWind || null;
};

export const fetchXRayFlux = async () => {
  const data = await request(`${API_BASE}/space/flares`);
  return data?.data || [];
};

/* ------------------------------
   🌍 SIMULATION API
--------------------------------*/
export const runSimulationAPI = (payload) =>
  request(`${API_BASE}/simulations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
