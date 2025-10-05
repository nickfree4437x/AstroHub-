const express = require("express");
const {
  getPlanets,        // GET all planets with filters, pagination, habitability, images
  getPlanetById,     // GET single planet by ID with habitability + image
  getPlanetNames,    // GET only planet names for dropdown/search
  getPlanetByName,   // GET single planet by name
  comparePlanets,    // POST compare multiple planets
  exportPlanetsCSV,  // ✅ New: Export filtered planets to CSV/Excel
} = require("../controllers/planetController");

const router = express.Router();

// 🌍 Planet API Routes

// Fetch planets with optional filters, minScore, starType, distance, pagination
router.get("/", getPlanets);

// Fetch only planet names (for dropdowns, search)
router.get("/names", getPlanetNames);

// Fetch a single planet by name (case-insensitive)
router.get("/names/:name", getPlanetByName);

// Fetch a single planet by Mongo ID
router.get("/:id", getPlanetById);

// Compare two or more planets (by ID or name)
router.post("/compare", comparePlanets);

// ✅ Export filtered planets to CSV/Excel (optional query params same as getPlanets)
router.get("/export/csv", exportPlanetsCSV);

module.exports = router;
