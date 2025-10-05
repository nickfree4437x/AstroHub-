const mongoose = require("mongoose");
const axios = require("axios");
const Planet = require("../models/Planet");
const { calculateHabitability } = require("../utils/habitability");
const { Parser } = require("json2csv");

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24h
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x400?text=Planet";

// ------------------ NASA API Helpers ------------------
const fetchPlanetFromNASA = async (name) => {
  try {
    const encodedName = encodeURIComponent(name);
    // NASA Exoplanet Archive API
    const nasaURL = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,discoverymethod,disc_year,sy_dist,pl_rade,pl_bmasse,pl_orbper,pl_orbsmax,pl_orbeccen,st_spectype+from+pscomppars+where+pl_name='${encodedName}'&format=json`;
    const resp = await axios.get(nasaURL, { timeout: 20000 });
    const data = Array.isArray(resp.data) ? resp.data[0] : resp.data?.collection?.items?.[0];
    if (!data) return null;

    // Fetch image from NASA Images API
    const imgResp = await axios.get(
      `https://images-api.nasa.gov/search?q=${encodedName}&media_type=image`,
      { timeout: 20000 }
    );
    const items = imgResp.data?.collection?.items || [];
    let imageURL = PLACEHOLDER_IMAGE;
    if (items.length > 0) {
      const link = items[0]?.links?.find((l) => l?.render === "image") || items[0]?.links?.[0];
      imageURL = link?.href || PLACEHOLDER_IMAGE;
    }

    return {
      name: data.pl_name,
      hostStar: data.hostname ?? null,
      discoveryMethod: data.discoverymethod ?? null,
      discoveryYear: data.disc_year ?? null,
      distance: data.sy_dist ?? null,
      radius: data.pl_rade ?? null,
      mass: data.pl_bmasse ?? null,
      orbitalPeriod: data.pl_orbper ?? null,
      semiMajorAxis: data.pl_orbsmax ?? null,
      eccentricity: data.pl_orbeccen ?? null,
      starType: data.st_spectype ?? null,
      teqK: null,
      waterPresence: null,
      atmosphere: null,
      habitableZone: null,
      flareActivity: 0,
      imageURL,
      cachedAt: new Date(),
    };
  } catch (err) {
    console.error(`❌ NASA fetch failed for ${name}:`, err.message || err);
    return null;
  }
};

// ------------------ CACHE CHECK & UPSERT ------------------
const getOrFetchPlanet = async (query) => {
  let planet = await Planet.findOne(query).lean();
  const now = Date.now();

  if (!planet || !planet.cachedAt || now - new Date(planet.cachedAt).getTime() > CACHE_DURATION_MS) {
    const nameToFetch = planet?.name || query.name?.$regex?.replace(/\\\^|\$\\/g, "") || null;
    if (!nameToFetch) return planet; // cannot fetch without name

    const fresh = await fetchPlanetFromNASA(nameToFetch);
    if (fresh) {
      planet = await Planet.findOneAndUpdate({ name: fresh.name }, fresh, { upsert: true, new: true }).lean();
    }
  }

  return planet;
};

// ------------------ GET ALL PLANETS ------------------
const getPlanets = async (req, res) => {
  try {
    const { q, page = 1, limit = 100, minScore, starType, maxDistance } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filters = {};

    if (q) {
      filters.$or = [
        { name: { $regex: q, $options: "i" } },
        { hostStar: { $regex: q, $options: "i" } },
      ];
    }
    if (starType) filters.starType = { $regex: `^${starType}$`, $options: "i" };
    if (maxDistance) filters.distance = { $lte: Number(maxDistance) };

    const totalCount = await Planet.countDocuments(filters);

    let docs = await Planet.find(filters).skip(skip).limit(Number(limit)).lean();

    // Ensure caching for each planet
    docs = await Promise.all(docs.map(async (d) => await getOrFetchPlanet({ name: d.name })));

    let enriched = docs.map((d) => ({ ...d, habitability: calculateHabitability(d) }));

    if (minScore) {
      const ms = Number(minScore);
      enriched = enriched.filter((p) => (p.habitability?.score ?? 0) >= ms);
    }

    res.json({
      items: enriched,
      total: totalCount,
      count: enriched.length,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error("❌ Error in getPlanets:", err);
    res.status(500).json({ error: "Failed to fetch planets" });
  }
};

// ------------------ GET PLANET BY ID ------------------
const getPlanetById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid planet ID" });

    const planet = await Planet.findById(req.params.id).lean();
    if (!planet) return res.status(404).json({ error: "Planet not found" });

    const cachedPlanet = await getOrFetchPlanet({ name: planet.name });
    res.json({ ...cachedPlanet, habitability: calculateHabitability(cachedPlanet) });
  } catch (err) {
    console.error("❌ Error in getPlanetById:", err);
    res.status(500).json({ error: "Failed to fetch planet" });
  }
};

// ------------------ GET PLANET NAMES ------------------
const getPlanetNames = async (req, res) => {
  try {
    const planets = await Planet.find({}, "name").lean();
    // Ensure caching for dropdown
    const updated = await Promise.all(planets.map(async (p) => await getOrFetchPlanet({ name: p.name })));
    res.json({ items: updated.map(p => ({ name: p.name })) });
  } catch (err) {
    console.error("❌ Error in getPlanetNames:", err);
    res.status(500).json({ error: "Failed to fetch planet names" });
  }
};

// ------------------ GET PLANET BY NAME ------------------
const getPlanetByName = async (req, res) => {
  try {
    const rawName = decodeURIComponent(req.params.name).trim();
    const safeName = rawName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const planet = await getOrFetchPlanet({ name: { $regex: `^${safeName}$`, $options: "i" } });
    if (!planet) return res.status(404).json({ error: "Planet not found" });

    res.json({ ...planet, habitability: calculateHabitability(planet) });
  } catch (err) {
    console.error("❌ Error in getPlanetByName:", err);
    res.status(500).json({ error: "Failed to fetch planet by name" });
  }
};

// ------------------ COMPARE MULTIPLE PLANETS (WITH EARTH) ------------------
const comparePlanets = async (req, res) => {
  try {
    const { planetB } = req.body;
    if (!planetB) return res.status(400).json({ error: "Selected planet is required" });

    // Earth baseline
    const EARTH = {
      name: "Earth",
      hostStar: "Sun",
      discoveryMethod: "Known",
      distance: 0,
      radius: 6371,
      mass: 5.972e24,
      orbitalPeriod: 365,
      semiMajorAxis: 1,
      eccentricity: 0.0167,
      starType: "G2V",
      teqK: 288,
      waterPresence: 1,
      atmosphere: true,
      habitableZone: true,
      flareActivity: 0,
    };
    const earthHabit = calculateHabitability(EARTH);

    // Fetch selected planet (cached)
    const query = mongoose.isValidObjectId(planetB)
      ? { _id: planetB }
      : { name: { $regex: `^${planetB}$`, $options: "i" } };

    const planet = await Planet.findOne(query).lean();
    if (!planet) return res.status(404).json({ error: "Selected planet not found" });

    const cachedPlanet = await getOrFetchPlanet({ name: planet.name });
    const planetHabit = calculateHabitability(cachedPlanet);

    // Habitability tag
    let habitTag = "Unknown";
    if (cachedPlanet.radius && cachedPlanet.mass) {
      const r = cachedPlanet.radius;
      const m = cachedPlanet.mass;
      if (r >= 0.8 && r <= 1.8 && m >= 0.5 && m <= 5) habitTag = "🌍 Earth-like";
      else if (r > 5) habitTag = "🪐 Gas Giant";
      else if (cachedPlanet.teqK && cachedPlanet.teqK > 400) habitTag = "🔥 Too Hot";
      else if (cachedPlanet.teqK && cachedPlanet.teqK < 180) habitTag = "❄ Too Cold";
    }

    res.json({
      earth: { ...EARTH, habitability: earthHabit },
      planet: {
        ...cachedPlanet,
        habitability: planetHabit,
        relativeRadius: cachedPlanet.radius / EARTH.radius,
        relativeMass: cachedPlanet.mass / EARTH.mass,
        relativeGravity:
          cachedPlanet.mass && cachedPlanet.radius
            ? (cachedPlanet.mass / Math.pow(cachedPlanet.radius, 2)) / (EARTH.mass / Math.pow(EARTH.radius, 2))
            : null,
        habitTag,
      },
    });
  } catch (err) {
    console.error("❌ Error in comparePlanets:", err);
    res.status(500).json({ error: "Comparison failed" });
  }
};

// ------------------ EXPORT PLANETS TO CSV ------------------
const exportPlanetsCSV = async (req, res) => {
  try {
    const { minScore, starType, maxDistance } = req.query;
    const filters = {};
    if (starType) filters.starType = { $regex: `^${starType}$`, $options: "i" };
    if (maxDistance) filters.distance = { $lte: Number(maxDistance) };

    let planets = await Planet.find(filters).lean();
    planets = await Promise.all(planets.map(async (p) => await getOrFetchPlanet({ name: p.name })));
    planets = planets.map((d) => ({ ...d, habitability: calculateHabitability(d) }));

    if (minScore) {
      const ms = Number(minScore);
      planets = planets.filter((p) => (p.habitability?.score ?? 0) >= ms);
    }

    const fields = [
      "name",
      "hostStar",
      "discoveryMethod",
      "distance",
      "radius",
      "mass",
      "starType",
      "habitability.score",
      "habitability.label",
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(planets);

    res.header("Content-Type", "text/csv");
    res.attachment("planets.csv");
    return res.send(csv);
  } catch (err) {
    console.error("❌ Error exporting planets CSV:", err);
    res.status(500).json({ error: "Failed to export CSV" });
  }
};

module.exports = {
  getPlanets,
  getPlanetById,
  getPlanetNames,
  getPlanetByName,
  comparePlanets,
  exportPlanetsCSV,
};
