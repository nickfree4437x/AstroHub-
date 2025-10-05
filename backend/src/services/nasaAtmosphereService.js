const axios = require("axios");
const Atmosphere = require("../models/Atmosphere");
const Planet = require("../models/Planet");

// NASA Exoplanet Archive Base URL
const NASA_API_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";

/**
 * Fetch atmosphere data for a planet from NASA Exoplanet Archive
 * @param {String} planetName
 * @returns atmosphere data object
 */
async function fetchAtmosphereFromNASA(planetName) {
  try {
    const query = `
      SELECT pl_name, pl_bmasse, pl_rade, pl_eqt, st_teff, st_mass, st_rad, pl_orbsmax
      FROM ps
      WHERE pl_name = '${planetName}'
    `;

    const response = await axios.get(NASA_API_URL, {
      params: { query, format: "json" },
    });

    const results = response.data;
    if (!results || results.length === 0) return null;

    const planetData = results[0];

    // Basic gas estimation based on temperature
    let gases = { O2: 0, CO2: 0, N2: 0, CH4: 0, H2: 0, others: 100 };
    if (planetData.pl_eqt && planetData.pl_eqt < 320) {
      gases = { O2: 21, N2: 78, CO2: 0.04, CH4: 0, H2: 0, others: 0.96 };
    } else if (planetData.pl_eqt && planetData.pl_eqt > 500) {
      gases = { O2: 0, N2: 3, CO2: 95, CH4: 0, H2: 0, others: 2 };
    }

    // ------------------ 5 Layers ------------------
    const baseTemp = planetData.pl_eqt || 288; // default Earth-like
    const layers = [
      {
        name: "Troposphere",
        temperature: baseTemp,
        pressure: 1,
        density: 1.2,
        notableMolecules: ["N2", "O2"],
      },
      {
        name: "Stratosphere",
        temperature: baseTemp - 50,
        pressure: 0.1,
        density: 0.2,
        notableMolecules: ["O3"],
      },
      {
        name: "Mesosphere",
        temperature: baseTemp - 100,
        pressure: 0.01,
        density: 0.01,
        notableMolecules: ["CO2", "O3"],
      },
      {
        name: "Thermosphere",
        temperature: baseTemp + 500,
        pressure: 0.0001,
        density: 0.00005,
        notableMolecules: ["O", "N2"],
      },
      {
        name: "Exosphere",
        temperature: baseTemp + 1000,
        pressure: 0,
        density: 0,
        notableMolecules: ["H", "He"],
      },
    ];

    return {
      planet: planetName,
      gases,
      layers,
      greenhouseIndex:
        baseTemp > 500 ? "High" : baseTemp > 300 ? "Medium" : "Low",
      radiationProtection: "Good",
      breathabilityIndex: gases.O2 > 10 ? "High" : "Very Low",
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("NASA API Fetch Error:", error.message);
    return null;
  }
}

/**
 * Get atmosphere data (NASA API + DB caching)
 * @param {String} planetId
 */
async function getAtmosphereData(planetId) {
  const planet = await Planet.findById(planetId);
  if (!planet) throw new Error("Planet not found");

  // Check cached data
  let cached = await Atmosphere.findOne({ planet: planet._id });
  if (cached && new Date() - cached.updatedAt < 24 * 60 * 60 * 1000) {
    return cached;
  }

  // Fetch from NASA
  const nasaData = await fetchAtmosphereFromNASA(planet.name);
  if (!nasaData) throw new Error("No atmosphere data found for this planet");

  // Update or insert into DB
  if (cached) {
    Object.assign(cached, nasaData);
    await cached.save();
    return cached;
  } else {
    const newAtmosphere = new Atmosphere({
      planet: planet._id,
      gases: nasaData.gases,
      layers: nasaData.layers,
      greenhouseIndex: nasaData.greenhouseIndex,
      radiationProtection: nasaData.radiationProtection,
      breathabilityIndex: nasaData.breathabilityIndex,
    });
    await newAtmosphere.save();
    return newAtmosphere;
  }
}

module.exports = { getAtmosphereData };
