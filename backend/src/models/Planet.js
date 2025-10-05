const mongoose = require("mongoose");

const planetSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  hostStar: { type: String },
  discoveryMethod: { type: String },
  discoveryYear: { type: Number },
  distance: { type: Number, min: 0 },
  radius: { type: Number, min: 0 },
  mass: { type: Number, min: 0 },
  orbitalPeriod: { type: Number, min: 0 },
  semiMajorAxis: { type: Number, min: 0 },
  eccentricity: { type: Number, min: 0, max: 1 },
  starType: { type: String },

  teqK: { type: Number, min: 0 },
  waterPresence: { type: Number, default: null, min: 0, max: 1 },
  atmosphere: { type: Boolean, default: null },
  habitableZone: { type: Boolean, default: null },
  flareActivity: { type: Number, default: 0, min: 0, max: 1 },

  imageURL: { type: String, default: null },

  // NEW: cache timestamp for NASA API data
  cachedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Planet", planetSchema);
