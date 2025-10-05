const Planet = require("../models/Planet");

// ------------------ SIMULATION ENGINE ------------------
exports.runSimulation = (params, mode = "human") => {
  const {
    tempC,
    water,
    o2,
    co2,
    nitrogen,
    toxicGases,
    radiation,
    gravity,
    pressure,
    elements
  } = params;

  let score = 100; // Start from perfect
  const breakdown = {};

  // --------- Temperature Factor ---------
  let tempFactor = 100;
  if (mode === "human") {
    if (tempC < -50 || tempC > 60) tempFactor = 0; // deadly
    else if (tempC < -20 || tempC > 50) tempFactor = 30;
    else if (tempC < 0 || tempC > 40) tempFactor = 70;
    else tempFactor = 100;
  } else if (mode === "microbial") {
    if (tempC < -80 || tempC > 120) tempFactor = 0;
    else tempFactor = 80;
  } else if (mode === "terraforming") {
    tempFactor = Math.max(0, 100 - Math.abs(tempC - 22) * 3);
  }
  breakdown.temp = tempFactor;
  score -= (100 - tempFactor) * 0.25;

  // --------- Water Factor ---------
  let waterFactor = Math.min(100, water * 100);
  if (waterFactor < 10) waterFactor = 0; // no survival without water
  if (mode === "microbial" && waterFactor > 0) waterFactor = Math.min(100, water * 120);
  breakdown.water = waterFactor;
  score -= (100 - waterFactor) * 0.25;

  // --------- Atmosphere Factor ---------
  let atmFactor = 100;
  if (o2 < 10 || o2 > 30) atmFactor -= 50; // too low/high oxygen
  if (toxicGases > 2) atmFactor -= toxicGases * 20; // each % toxic = major penalty
  atmFactor = Math.max(0, atmFactor);
  breakdown.atmosphere = atmFactor;
  score -= (100 - atmFactor) * 0.2;

  // --------- Gravity Factor ---------
  let gravFactor = 100;
  if (gravity < 0.5 || gravity > 2) gravFactor = 30;
  else if (gravity < 0.8 || gravity > 1.2) gravFactor = 70;
  breakdown.gravity = gravFactor;
  score -= (100 - gravFactor) * 0.1;

  // --------- Radiation Factor ---------
  let radFactor = 100;
  if (radiation === "medium") radFactor = 60;
  else if (radiation === "high") radFactor = 20;
  if (mode === "microbial") radFactor += 10;
  breakdown.radiation = radFactor;
  score -= (100 - radFactor) * 0.1;

  // --------- Pressure Factor ---------
  let presFactor = 100;
  if (pressure < 0.2 || pressure > 5) presFactor = 20;
  else if (pressure < 0.5 || pressure > 2) presFactor = 60;
  breakdown.pressure = presFactor;
  score -= (100 - presFactor) * 0.1;

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine survivability status
  let status = "Extremely Hostile";
  if (score >= 75) status = "Suitable for Life";
  else if (score >= 40) status = "Challenging but Possible";

  // Recommendation
  let recommendation = "Life as we know it cannot survive here.";
  if (status === "Suitable for Life") recommendation = "Humans may survive with minimal protection.";
  else if (status === "Challenging but Possible") recommendation = "Humans may survive with protective suits & domes.";

  return { score: Math.round(score), status, breakdown, recommendation };
};

// ------------------ AI RECOMMENDATION ------------------
exports.getClosestSurvivablePlanet = async (minScore = 50) => {
  try {
    const planets = await Planet.find().lean();
    const candidates = planets.map(p => {
      const sim = exports.runSimulation({
        tempC: p.teqK ? p.teqK - 273 : 15,
        water: p.waterPresence ?? 0,
        o2: p.o2 ?? 21,
        co2: p.co2 ?? 0.04,
        nitrogen: p.nitrogen ?? 78,
        toxicGases: p.toxicGases ?? 0,
        radiation: p.radiation ?? "unknown",
        gravity: p.gravity ?? 1,
        pressure: p.pressure ?? 1,
        elements: p.elements ?? ["C","H","O","N","P","S"]
      });
      return { name: p.name, score: sim.score };
    }).filter(p => p.score >= minScore);
    candidates.sort((a,b) => b.score - a.score);
    return candidates[0]?.name ?? null;
  } catch (err) {
    console.error("Error in AI recommendation:", err.message);
    return null;
  }
};

// ------------------ HISTORICAL EARTH DATA ------------------
exports.getHistoricalEarth = () => {
  return {
    tempC: 15,
    water: 0.7,
    o2: 21,
    co2: 0.03,
    nitrogen: 78,
    toxicGases: 0,
    radiation: "low",
    gravity: 1,
    pressure: 1,
    elements: ["C","H","O","N","P","S"]
  };
};
