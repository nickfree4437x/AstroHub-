const express = require("express");
const {
  getAtmosphereByPlanetId,
  compareAtmospheres,
  upsertAtmosphere
} = require("../controllers/atmosphereController");

const router = express.Router();

// 🌍 Compare multiple planets (POST body: { planetIds: [] })
router.post("/compare", compareAtmospheres);

// 🌍 Create or update atmosphere (admin)
router.post("/upsert", upsertAtmosphere);

// 🌍 Get atmosphere by planet ID (keep last so it doesn’t override other routes)
router.get("/:planetId", getAtmosphereByPlanetId);

module.exports = router;
