// src/lib/astronautApi.js
import { request as apiRequest } from "./api"; // renamed to avoid conflicts

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/astronauts`
  : "http://localhost:4000/api/v1/astronauts";

/* ------------------------------
   👨‍🚀 Astronaut Directory + Search/Filters
--------------------------------*/
export const fetchAstronauts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(query ? `${BASE}?${query}` : BASE);
};

/* ------------------------------
   👨‍🚀 Individual astronaut
--------------------------------*/
export const fetchAstronautById = (id) =>
  apiRequest(`${BASE}/${encodeURIComponent(id)}`);

/* ------------------------------
   👨‍🚀 Compare multiple astronauts
--------------------------------*/
export const compareAstronauts = (ids = []) =>
  apiRequest(`${BASE}/compare?ids=${ids.join(",")}`);

/* ------------------------------
   👨‍🚀 Stats
--------------------------------*/
export const fetchAstronautStats = () => apiRequest(`${BASE}/stats`);

/* ------------------------------
   👨‍🚀 Random Spotlight
--------------------------------*/
export const fetchRandomAstronaut = () =>
  apiRequest(`${BASE}/random-spotlight`);

/* ------------------------------
   👨‍🚀 Missions for astronaut
--------------------------------*/
export const fetchAstronautMissions = (id) =>
  apiRequest(`${BASE}/${encodeURIComponent(id)}/missions`);
