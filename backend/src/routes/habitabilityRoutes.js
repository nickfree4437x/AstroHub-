const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// ✅ In-memory planet cache
let planetCache = [];

// Load CSV once on startup
const filePath = path.join(
  __dirname,
  "../../../ml-service/data/exoplanets_processed.csv"
);

if (fs.existsSync(filePath)) {
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      planetCache.push({
        name: row["name"], // ✅ lowercase header
        mass_earth: parseFloat(row["mass_earth"]) || 0,
        radius_earth: parseFloat(row["radius_earth"]) || 0,
        period_days: parseFloat(row["period_days"]) || 0,
        semi_major_axis_au: parseFloat(row["semi_major_axis_au"]) || 0,
        temp_k: parseFloat(row["temp_k"]) || 0,
        distance_ly: parseFloat(row["distance_ly"]) || 0,
        star_mass_solar: parseFloat(row["star_mass_solar"]) || 0,
        star_temp_k: parseFloat(row["star_temp_k"]) || 0,
        habitability_score: parseFloat(row["habitability_score"]) || 0, // ✅ Directly from dataset
        habitability_label: parseInt(row["habitability_label"]) || 0,
      });
    })
    .on("end", () => {
      console.log(`✅ Loaded ${planetCache.length} planets into cache`);
    });
} else {
  console.error("❌ CSV file not found at:", filePath);
}

// ======================================================
// @route   GET /api/habitability/planets
// @desc    Get list of all planets
// @access  Public
// ======================================================
router.get("/planets", (req, res) => {
  res.json(planetCache);
});

// ======================================================
// @route   POST /api/habitability/predict
// @desc    Get habitability score directly from dataset
// @access  Public
// ======================================================
router.post("/predict", (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Planet name is required" });
    }

    const planet = planetCache.find((p) => p.name === name);

    if (!planet) {
      return res.status(404).json({ error: "Planet not found" });
    }

    // ✅ Send score directly from dataset
    res.json({
      planet: planet.name,
      habitability_score: planet.habitability_score, // dataset score
      habitability_label: planet.habitability_label,
      prediction:
        planet.habitability_label === 1
          ? "Potentially Habitable"
          : "Non-Habitable",
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Prediction failed", details: error.message });
  }
});

module.exports = router;
