// backend/seedPlanet.js
// Optimized seeder: fetch top-N exoplanets + NASA images (throttled + retries) and bulk-insert.

const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Planet = require("../src/models/Planet");
const connectDB = require("../src/config/db");

dotenv.config();

// ----- CONFIG -----
const TOP_N = 258; // total exoplanets to seed
const MAX_CONCURRENT_REQUESTS = 20; 
const DELAY_BETWEEN_BATCHES_MS = 300;
const MAX_RETRIES = 3; 
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x400?text=Planet";

// ----- Helpers -----
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const fetchPlanetImage = async (planetName, attempt = 1) => {
  try {
    if (!planetName || typeof planetName !== "string") return PLACEHOLDER_IMAGE;
    const searchName = encodeURIComponent(planetName);
    const url = `https://images-api.nasa.gov/search?q=${searchName}&media_type=image`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "application/json",
      },
      timeout: 20000,
    });

    const items = data?.collection?.items || [];
    if (items.length > 0) {
      const link = items[0]?.links?.find((l) => l?.render === "image") || items[0]?.links?.[0];
      return (link && link.href) || PLACEHOLDER_IMAGE;
    }

    return PLACEHOLDER_IMAGE;
  } catch (err) {
    if (attempt <= MAX_RETRIES) {
      const backoff = 200 * attempt;
      console.log(`⚡ [Retry ${attempt}] fetching image for "${planetName}" after ${backoff}ms`);
      await sleep(backoff);
      return fetchPlanetImage(planetName, attempt + 1);
    }
    console.error(`❌ Failed to fetch image for "${planetName}": ${err.message || err}`);
    return PLACEHOLDER_IMAGE;
  }
};

const processInBatches = async (items, handler) => {
  const out = [];
  let i = 0;
  while (i < items.length) {
    const batch = items.slice(i, i + MAX_CONCURRENT_REQUESTS);
    const results = await Promise.all(batch.map(handler));
    out.push(...results);
    i += MAX_CONCURRENT_REQUESTS;
    if (i < items.length) await sleep(DELAY_BETWEEN_BATCHES_MS);
    console.log(`⏳ Processed ${Math.min(i, items.length)} / ${items.length}`);
  }
  return out;
};

// ----- Main seeder -----
const seedPlanets = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected:", (process.env.MONGO_URI || "").split("@").pop?.() || "local");

    let queryUrl =
      `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+${TOP_N}+pl_name,hostname,discoverymethod,disc_year,sy_dist,pl_rade,pl_bmasse,pl_orbper,pl_orbsmax,pl_orbeccen,st_spectype+from+pscomppars&format=json`;

    console.log("🌍 Fetching exoplanet data from NASA...");
    const resp = await axios.get(queryUrl, { timeout: 120000 });
    let data = Array.isArray(resp.data) ? resp.data : resp.data?.collection || [];

    if (!Array.isArray(data) && Array.isArray(resp.data)) data = resp.data;
    if (!Array.isArray(data)) throw new Error("Unexpected response format from exoplanet archive");

    if (data.length > TOP_N) data = data.slice(0, TOP_N);
    console.log(`🔎 Will seed ${data.length} exoplanets`);

    await Planet.deleteMany({});
    console.log("🗑 Old planets removed");

    const handler = async (p) => {
      const name = p?.pl_name || p.name || "Unknown";
      const imageURL = await fetchPlanetImage(name);
      return {
        name,
        hostStar: p.hostname ?? null,
        discoveryMethod: p.discoverymethod ?? null,
        discoveryYear: p.disc_year ?? null,
        distance: p.sy_dist ?? null,
        radius: p.pl_rade ?? null,
        mass: p.pl_bmasse ?? null,
        orbitalPeriod: p.pl_orbper ?? null,
        semiMajorAxis: p.pl_orbsmax ?? null,
        eccentricity: p.pl_orbeccen ?? null,
        starType: p.st_spectype ?? null,
        imageURL,
        teqK: null,
        waterPresence: null,
        atmosphere: null,
        habitableZone: null,
        flareActivity: 0,
      };
    };

    const planetsWithImages = await processInBatches(data, handler);

    // ✅ Only NASA exoplanets, Solar System excluded
    await Planet.insertMany(planetsWithImages, { ordered: false });
    console.log(`🎉 Seed complete: Inserted ${planetsWithImages.length} planets`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder failed:", err);
    process.exit(1);
  }
};

seedPlanets();
