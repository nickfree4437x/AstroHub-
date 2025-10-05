const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema({
  missionId: { type: String, required: true, unique: true },   // API mission ID (unique identifier)
  name: { type: String, required: true },
  agency: { type: String, default: "N/A" },
  destination: { type: String, default: "N/A" },               // Orbit name as string
  status: { type: String, default: "Upcoming" },               // Completed / Ongoing / Upcoming
  launchDate: { type: Date },
  crew: { type: Number, default: 0 },
  duration: { type: String, default: "N/A" },
  cost: { type: String, default: "N/A" },
  type: { type: String, default: "Uncrewed" },
  image: { type: String, default: "" },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Mission", MissionSchema);
