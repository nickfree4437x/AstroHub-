const Atmosphere = require("../models/Atmosphere");
const { getAtmosphereData } = require("../services/nasaAtmosphereService");

// 🌍 Get atmosphere by planet ID (real-time + caching)
exports.getAtmosphereByPlanetId = async (req, res) => {
  try {
    const planetId = req.params.planetId;

    // Call service → check cache → fetch from NASA if needed
    const atmosphere = await getAtmosphereData(planetId);

    if (!atmosphere) {
      return res.status(404).json({ message: "No atmosphere data found" });
    }

    res.json(atmosphere);
  } catch (err) {
    console.error("getAtmosphereByPlanetId Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🌍 Compare atmospheres of multiple planets
exports.compareAtmospheres = async (req, res) => {
  try {
    const { planetIds } = req.body; // array of planet IDs

    if (!planetIds || planetIds.length === 0) {
      return res.status(400).json({ message: "planetIds array required" });
    }

    // Fetch each atmosphere from service
    const atmospheres = [];
    for (let id of planetIds) {
      const data = await getAtmosphereData(id);
      if (data) atmospheres.push(data);
    }

    res.json(atmospheres);
  } catch (err) {
    console.error("compareAtmospheres Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🌍 Create or update atmosphere manually (Admin only)
exports.upsertAtmosphere = async (req, res) => {
  try {
    const { planetId, gases, layers, greenhouseIndex, radiationProtection, breathabilityIndex } = req.body;

    const atmosphere = await Atmosphere.findOneAndUpdate(
      { planet: planetId },
      { gases, layers, greenhouseIndex, radiationProtection, breathabilityIndex },
      { upsert: true, new: true }
    );

    res.json(atmosphere);
  } catch (err) {
    console.error("upsertAtmosphere Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
