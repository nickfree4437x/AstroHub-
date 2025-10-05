const mongoose = require("mongoose");

const AstrohubMissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  launchDate: { type: Date },
  durationHours: { type: Number, default: 0 },
  EVAcount: { type: Number, default: 0 },
  description: { type: String },
  agency: { type: String },
});

module.exports = mongoose.model("AstrohubMission", AstrohubMissionSchema);
