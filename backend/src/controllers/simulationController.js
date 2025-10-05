const Simulation = require("../models/Simulation");
const Planet = require("../models/Planet");
const {
  runSimulation,
  getClosestSurvivablePlanet,
  getHistoricalEarth,
} = require("../utils/simulationLogic");

// ------------------ SAVE NEW SIMULATION ------------------
exports.saveSimulation = async (req, res) => {
  try {
    const { userId, planet, params, mode } = req.body;

    if (!planet || !params)
      return res.status(400).json({ message: "Missing required fields" });

    // Fetch planet data if exists
    let planetData = await Planet.findOne({ name: planet }).lean();
    if (!planetData) planetData = {}; // custom planet

    // Merge user params with planet defaults
    const planetParams = {
      tempC: params.tempC ?? planetData.tempC ?? 15,
      water: params.water ?? planetData.waterPresence ?? 0.5,
      o2: params.o2 ?? 21,
      co2: params.co2 ?? 0.04,
      nitrogen: params.nitrogen ?? 78,
      toxicGases: params.toxicGases ?? 0,
      radiation: params.radiation ?? "low",
      gravity: params.gravity ?? 1,
      pressure: params.pressure ?? 1,
      elements: params.elements ?? ["C", "H", "O", "N", "P", "S"],
    };

    // Run simulation engine
    const result = runSimulation(planetParams, mode);

    // AI Recommendation
    const recommendedPlanet = await getClosestSurvivablePlanet(result.score);

    // Historical Earth Comparison
    const earlyEarth = getHistoricalEarth();

    // Colonization Difficulty Index
    const colonizationDifficulty = Math.max(
      0,
      100 - result.score + (planetParams.gravity > 1.5 ? 10 : 0)
    );

    const simulation = new Simulation({
      userId,
      planet,
      params: planetParams,
      mode,
      result: {
        ...result,
        recommendedPlanet,
        historicalEarth: earlyEarth,
        colonizationDifficulty,
      },
    });

    const savedSim = await simulation.save();
    res.status(201).json(savedSim);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving simulation", error: err.message });
  }
};

// ------------------ GET SINGLE SIMULATION BY ID ------------------
exports.getSimulationById = async (req, res) => {
  try {
    const sim = await Simulation.findById(req.params.id);
    if (!sim) return res.status(404).json({ message: "Simulation not found" });
    res.json(sim);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching simulation", error: err.message });
  }
};

// ------------------ GET ALL SIMULATIONS OF A USER ------------------
exports.getUserSimulations = async (req, res) => {
  try {
    const { userId } = req.params;
    const sims = await Simulation.find({ userId }).sort({ createdAt: -1 });
    res.json(sims);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user simulations", error: err.message });
  }
};

// ------------------ DELETE SIMULATION ------------------
exports.deleteSimulation = async (req, res) => {
  try {
    const sim = await Simulation.findByIdAndDelete(req.params.id);
    if (!sim) return res.status(404).json({ message: "Simulation not found" });
    res.json({ message: "Simulation deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting simulation", error: err.message });
  }
};

// ------------------ GET ALL SIMULATIONS (ADMIN) ------------------
exports.getAllSimulations = async (req, res) => {
  try {
    const sims = await Simulation.find().sort({ createdAt: -1 });
    res.json(sims);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching simulations", error: err.message });
  }
};

// ------------------ REAL-TIME SURVIVABILITY SCORE (BY PLANET NAME) ------------------
exports.getPlanetSurvivabilityScore = async (req, res) => {
  try {
    const { planetName } = req.params;

    // Fetch planet data from DB
    let planetData = await Planet.findOne({ name: planetName }).lean();
    if (!planetData) {
      return res.status(404).json({ message: "Planet not found" });
    }

    // Create params for simulation
    const planetParams = {
      tempC: planetData.tempC ?? 15,
      water: planetData.waterPresence ?? 0.5,
      o2: planetData.o2 ?? 21,
      co2: planetData.co2 ?? 0.04,
      nitrogen: planetData.nitrogen ?? 78,
      toxicGases: planetData.toxicGases ?? 0,
      radiation: planetData.radiation ?? "low",
      gravity: planetData.gravity ?? 1,
      pressure: planetData.pressure ?? 1,
      elements: planetData.elements ?? ["C", "H", "O", "N", "P", "S"],
    };

    // Run real-time survivability calculation
    const result = runSimulation(planetParams, "real-time");

    // Extra info
    const recommendedPlanet = await getClosestSurvivablePlanet(result.score);
    const historicalEarth = getHistoricalEarth();

    res.json({
      planet: planetName,
      survivabilityScore: result.score,
      details: result,
      recommendedPlanet,
      historicalEarth,
      updatedAt: new Date(),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error calculating survivability score",
      error: err.message,
    });
  }
};

// ------------------ RUN SIMULATION (REAL-TIME, NO SAVE) ------------------
exports.runSimulationRealtime = async (req, res) => {
  try {
    const { planet, params, mode } = req.body;

    if (!planet || !params) {
      return res.status(400).json({ message: "Planet and params are required" });
    }

    // Fetch DB data if planet exists
    let planetData = await Planet.findOne({ name: planet }).lean();
    if (!planetData) planetData = {}; // custom planet

    // Merge user params with DB defaults
    const planetParams = {
      tempC: params.tempC ?? planetData.tempC ?? 15,
      water: params.water ?? planetData.waterPresence ?? 0.5,
      o2: params.o2 ?? planetData.o2 ?? 21,
      co2: params.co2 ?? planetData.co2 ?? 0.04,
      nitrogen: params.nitrogen ?? planetData.nitrogen ?? 78,
      toxicGases: params.toxicGases ?? planetData.toxicGases ?? 0,
      radiation: params.radiation ?? planetData.radiation ?? "low",
      gravity: params.gravity ?? planetData.gravity ?? 1,
      pressure: params.pressure ?? planetData.pressure ?? 1,
      elements: params.elements ?? planetData.elements ?? ["C", "H", "O", "N", "P", "S"],
    };

    // Run simulation logic
    const result = runSimulation(planetParams, mode || "human");

    // Extra info
    const recommendedPlanet = await getClosestSurvivablePlanet(result.score);
    const historicalEarth = getHistoricalEarth();

    res.json({
      planet,
      params: planetParams,
      score: result.score,
      status: result.status,
      breakdown: result.breakdown,
      recommendation: result.recommendation,
      recommendedPlanet,
      historicalEarth,
      colonizationDifficulty: Math.max(0, 100 - result.score + (planetParams.gravity > 1.5 ? 10 : 0)),
      updatedAt: new Date(),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error running real-time simulation",
      error: err.message,
    });
  }
};
