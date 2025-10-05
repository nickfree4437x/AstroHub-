// backend/controllers/spaceWeatherController.js
const fetchAPI = require("../utils/apiFetch");

exports.getSpaceWeather = async (req, res) => {
  try {
    console.log("🚀 getSpaceWeather called");

    // --- Real NASA Data ---
    const sunspots = await fetchAPI(
      `https://api.nasa.gov/DONKI/SS?api_key=${process.env.NASA_API_KEY}`
    );

    const flares = await fetchAPI(
      `https://api.nasa.gov/DONKI/FLR?api_key=${process.env.NASA_API_KEY}`
    );

    const cmes = await fetchAPI(
      `https://api.nasa.gov/DONKI/CME?api_key=${process.env.NASA_API_KEY}`
    );

    // --- SWPC Available Data ---
    const kpIndexData = await fetchAPI(
      "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json"
    );
    const latestKp =
      Array.isArray(kpIndexData) && kpIndexData.length > 0
        ? kpIndexData[kpIndexData.length - 1].kp
        : null;

    // --- Simulated Data for unavailable endpoints ---
    const solarWind = Array(48)
      .fill(0)
      .map((_, i) => ({
        time: `-${48 - i}h`,
        speed: Math.floor(300 + Math.random() * 200),
        density: Math.floor(1 + Math.random() * 10),
        bz: parseFloat((Math.random() * 10 - 5).toFixed(2)), // -5 to +5
      }));

    const radiation = {
      index: ["S1", "S2", "S3", "S4", "S5"][Math.floor(Math.random() * 5)],
      protonElectronFlux: Array(48)
        .fill(0)
        .map((_, i) => ({
          time: `-${48 - i}h`,
          protons: Math.floor(Math.random() * 100),
          electrons: Math.floor(Math.random() * 50),
        })),
      cosmicRays: Math.floor(Math.random() * 300),
    };

    const auroraZones = { north: "green", south: "yellow" }; // simplified
    const alerts = flares.map((f) => ({
      type: "flare",
      message: `${f.class || "C"}-class flare detected at ${f.beginTime}`,
    }));

    const historical = {
      solarWindHistory: solarWind,
      flareHistory: flares,
      radiationHistory: radiation.protonElectronFlux,
    };

    const forecast = {
      kpForecast: [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)],
      solarWindForecast: [
        { speed: 400, density: 5 },
        { speed: 350, density: 4 },
      ],
    };

    const safety = {
      satelliteCommRisk: "Low",
      gpsImpact: "Moderate",
      astronautEVASafety: "High",
    };

    res.json({
      solar: { sunspots, flares, cmes, solarWind },
      radiation,
      geomagnetic: { kpIndex: latestKp, auroraZones },
      alerts,
      historical,
      forecast,
      safety,
    });
  } catch (error) {
    console.error("🔥 getSpaceWeather Error:", error.message);
    res.status(500).json({ error: "Failed to fetch space weather data" });
  }
};

exports.getKpIndex = async (req, res) => {
  try {
    console.log("🚀 getKpIndex called");
    const kpData = await fetchAPI(
      "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json"
    );
    const latestKp =
      Array.isArray(kpData) && kpData.length > 0 ? kpData[kpData.length - 1].kp : null;
    res.json({ kp: latestKp });
  } catch (err) {
    console.error("🔥 KP Index Error:", err.message);
    res.status(500).json({ error: "Failed to fetch KP index" });
  }
};

exports.getSolarWind = async (req, res) => {
  try {
    console.log("🚀 getSolarWind called");
    const solarWind = Array(48)
      .fill(0)
      .map((_, i) => ({
        time: `-${48 - i}h`,
        speed: Math.floor(300 + Math.random() * 200),
        density: Math.floor(1 + Math.random() * 10),
        bz: parseFloat((Math.random() * 10 - 5).toFixed(2)),
      }));
    res.json({ solarWind });
  } catch (err) {
    console.error("🔥 Solar Wind Error:", err.message);
    res.status(500).json({ error: "Failed to fetch solar wind data" });
  }
};

exports.getFlares = async (req, res) => {
  try {
    console.log("🚀 getFlares called");
    const flares = await fetchAPI(
      `https://api.nasa.gov/DONKI/FLR?api_key=${process.env.NASA_API_KEY}`
    );
    res.json({ data: flares });
  } catch (err) {
    console.error("🔥 Flares Error:", err.message);
    res.status(500).json({ error: "Failed to fetch flares" });
  }
};
