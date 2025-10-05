const mongoose = require("mongoose");

const simulationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // optional if guest
  planet: { type: String, required: true }, // e.g., "Kepler-22b"

  params: {
    tempC: { type: Number },            // Surface temperature
    water: { type: Number },            // Water availability %
    o2: { type: Number },               // Oxygen %
    co2: { type: Number },              // CO2 %
    nitrogen: { type: Number },         // Nitrogen %
    toxicGases: { type: Number },       // Toxic gases %
    radiation: { type: String, enum: ["low", "medium", "high"] },
    gravity: { type: Number },          // Relative to Earth (1x)
    pressure: { type: Number },         // Atmospheric pressure
    elements: [String]                  // e.g., ["C","H","O","N","P","S"]
  },

  mode: {
    type: String,
    enum: ["human", "microbial", "terraforming"],
    default: "human"
  },

  result: {
    score: { type: Number },
    status: { type: String },
    breakdown: { type: Object }, // atmosphere, water, temp, etc.
    recommendation: { type: String }
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Simulation", simulationSchema);
