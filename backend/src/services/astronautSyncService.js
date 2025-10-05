const Astronaut = require("../models/Astronaut");
const SyncMeta = require("../models/SyncMeta");
const axios = require("axios");

// ------------------ Helpers ------------------

// Convert ISO 8601 duration -> hours
function parseISODurationToHours(iso) {
  if (!iso) return 0;
  const regex = /P(?:\d+D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = iso.match(regex);
  if (!matches) return 0;
  const hours = parseInt(matches[1] || 0);
  const minutes = parseInt(matches[2] || 0);
  const seconds = parseInt(matches[3] || 0);
  return hours + minutes / 60 + seconds / 3600;
}

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Fetch JSON with retries & exponential backoff
async function fetchJsonWithRetry(url, retries = 5, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      if (err.response && err.response.status === 429) {
        const waitTime = err.response.headers["retry-after"]
          ? parseInt(err.response.headers["retry-after"]) * 1000
          : delayMs;
        console.warn(`🚨 429 Rate Limit hit. Waiting ${waitTime / 1000} sec before retry...`);
        await delay(waitTime);
        delayMs *= 2; // exponential backoff
      } else if (err.response && err.response.status === 404) {
        // no data available → return empty response
        return { results: [] };
      } else {
        throw err;
      }
    }
  }
  throw new Error(`Failed to fetch after ${retries} retries: ${url}`);
}

// Fetch missions for a single astronaut
async function fetchAstronautMissions(astronautId) {
  const url = `https://ll.thespacedevs.com/2.2.0/astronautflight/?astronaut=${astronautId}`;
  try {
    await delay(1500); // polite delay
    const data = await fetchJsonWithRetry(url);
    return (data.results || []).map(m => ({
      externalId: m.id,
      name: m.mission_name,
      role: m.role,
      launchDate: m.launch_date ? new Date(m.launch_date) : null,
      landingDate: m.landing_date ? new Date(m.landing_date) : null,
      spacecraft: m.spacecraft || null,
      durationHours: parseISODurationToHours(m.duration),
      EVAcount: m.eva_count || 0,
      EVADurationHours: parseISODurationToHours(m.eva_duration)
    }));
  } catch (err) {
    // already handled 404 in fetchJsonWithRetry
    console.warn(`⚠️ Could not fetch missions for astronaut ${astronautId}: ${err.message}`);
    return [];
  }
}

// Map API object -> Astronaut model
async function mapApiToAstronaut(apiObj) {
  const missions = await fetchAstronautMissions(apiObj.id);

  const mapped = {
    externalId: String(apiObj.id),
    name: apiObj.name,
    nickname: apiObj.nickname || null,
    profileImage: apiObj.profile_image || apiObj.image_url || null,
    profileImageThumb: apiObj.profile_image_thumbnail || null,
    nationality: apiObj.nationality || null,
    flagUrl: apiObj.country_flag || null,
    agency: apiObj.agency ? {
      id: apiObj.agency.id,
      name: apiObj.agency.name,
      abbrev: apiObj.agency.abbrev,
      country_code: apiObj.agency.country_code,
      logo_url: apiObj.agency.logo_url,
      image_url: apiObj.agency.image_url
    } : null,
    status: apiObj.status?.name || null,
    type: apiObj.type?.name || null,
    in_space: Boolean(apiObj.in_space),
    timeInSpaceHours: parseISODurationToHours(apiObj.time_in_space),
    evaTimeHours: parseISODurationToHours(apiObj.eva_time),
    age: apiObj.age || null,
    date_of_birth: apiObj.date_of_birth ? new Date(apiObj.date_of_birth) : null,
    date_of_death: apiObj.date_of_death ? new Date(apiObj.date_of_death) : null,
    bio: apiObj.bio || null,
    twitter: apiObj.twitter || null,
    instagram: apiObj.instagram || null,
    wiki: apiObj.wiki || null,
    flights_count: apiObj.flights_count || 0,
    landings_count: apiObj.landings_count || 0,
    spacewalks_count: apiObj.spacewalks_count || 0,
    first_flight: apiObj.first_flight ? new Date(apiObj.first_flight) : null,
    last_flight: apiObj.last_flight ? new Date(apiObj.last_flight) : null,
    gender: apiObj.gender || null,
    firstFlightYear: apiObj.first_flight ? new Date(apiObj.first_flight).getFullYear() : null,
    totalSpaceHours: parseISODurationToHours(apiObj.time_in_space),
    EVAcount: apiObj.spacewalks_count || 0,
    achievements: apiObj.achievements || [],
    badges: [],
    quotes: apiObj.quotes || [],
    missions
  };

  console.log(`✅ Mapped astronaut: ${mapped.name}, missions count: ${missions.length}`);

  // compute badges
  if (mapped.gender === "Female") mapped.badges.push("First Woman");
  if (missions.some(m => m.name?.toLowerCase().includes("iss"))) mapped.badges.push("ISS Veteran");
  if (missions.some(m => m.name?.toLowerCase().includes("apollo"))) mapped.badges.push("Apollo Hero");

  return mapped;
}

// Upsert astronaut in DB
async function upsertAstronaut(mapped) {
  return Astronaut.findOneAndUpdate(
    { externalId: mapped.externalId },
    { $set: mapped },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

// ------------------ Main sync function ------------------
async function syncAstronauts(runContext = { source: "launchlib2" }) {
  const API_BASE = process.env.SYNC_API_BASE || "https://ll.thespacedevs.com/2.2.0/astronaut/";
  let url = API_BASE + "?limit=5"; // even smaller batches
  let totalProcessed = 0;

  try {
    while (url) {
      const data = await fetchJsonWithRetry(url);
      const results = data.results || [];
      console.log(`📡 Fetched ${results.length} astronauts from API`);

      for (const apiAstr of results) {
        const mapped = await mapApiToAstronaut(apiAstr);
        await upsertAstronaut(mapped);
        totalProcessed++;
      }

      await SyncMeta.findOneAndUpdate(
        { source: runContext.source },
        { lastSyncedAt: new Date(), lastCount: totalProcessed },
        { upsert: true }
      );

      url = data.next || null;
      if (url) {
        console.log("⏳ Waiting 20 sec before next page...");
        await delay(20000); // wait 20 sec between pages
      }
    }

    console.log(`🎉 Sync completed. Total astronauts processed: ${totalProcessed}`);
    return { success: true, processed: totalProcessed, message: "Sync completed" };
  } catch (err) {
    await SyncMeta.findOneAndUpdate(
      { source: runContext.source },
      { lastSyncedAt: new Date(), lastError: err.message },
      { upsert: true }
    );
    console.error("❌ Sync error:", err.message);
    throw err;
  }
}

module.exports = { syncAstronauts, parseISODurationToHours, fetchJsonWithRetry, delay };
