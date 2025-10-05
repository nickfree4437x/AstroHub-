// models/Atmosphere.js
const mongoose = require("mongoose");

const layerSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Troposphere, Stratosphere, etc.
  temperature: { type: Number },          // K
  pressure: { type: Number },             // atm
  density: { type: Number },              // kg/m3
  notableMolecules: [{ type: String }]    // ["O3", "CO2"]
});

const atmosphereSchema = new mongoose.Schema({
  planet: { type: mongoose.Schema.Types.ObjectId, ref: "Planet", required: true },

  // Gas composition in percentage
  gases: {
    O2: { type: Number, default: 0 },
    CO2: { type: Number, default: 0 },
    N2: { type: Number, default: 0 },
    CH4: { type: Number, default: 0 },
    H2: { type: Number, default: 0 },
    others: { type: Number, default: 0 }
  },

  layers: [layerSchema],

  // Climate indicators
  greenhouseIndex: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  radiationProtection: { type: String, enum: ["Good", "Weak", "None"], default: "Good" },
  breathabilityIndex: { type: String, enum: ["High", "Low", "Very Low"], default: "High" }
}, { timestamps: true });

module.exports = mongoose.model("Atmosphere", atmosphereSchema);
