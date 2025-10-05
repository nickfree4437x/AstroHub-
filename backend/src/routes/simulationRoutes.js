const express = require("express");
const router = express.Router();
const {
  saveSimulation,
  getSimulationById,
  getUserSimulations,
  deleteSimulation,
  getAllSimulations,
  getPlanetSurvivabilityScore, // ✅ new controller
} = require("../controllers/simulationController");

// Save new simulation
router.post("/", saveSimulation);

// Get one simulation
router.get("/:id", getSimulationById);

// Get all simulations of a user
router.get("/user/:userId", getUserSimulations);

// Delete a simulation
router.delete("/:id", deleteSimulation);

// Admin: Get all simulations
router.get("/", getAllSimulations);

// ✅ Real-time survivability score for a planet
router.get("/planet/:planetName/survivability", getPlanetSurvivabilityScore);

module.exports = router;
