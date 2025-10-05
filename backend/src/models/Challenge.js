// models/Challenge.js
const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["quiz", "survival", "rocket", "orbit", "blackhole"], required: true },
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true }, // quiz questions, simulation data
  rewardXP: { type: Number, default: 50 },
  badges: [{ type: String }],
  daily: { type: Boolean, default: false },
  weeklyEvent: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Challenge", challengeSchema);
