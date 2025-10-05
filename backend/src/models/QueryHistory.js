const mongoose = require("mongoose");

const queryHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // future mein auth add karenge
      required: false, // abhi ke liye optional
    },
    query: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["quick", "deep", "data", "prediction"],
      default: "quick",
    },
    sources: {
      type: [String], // e.g. ["NASA API", "SpaceX", "OpenAI"]
      default: [],
    },
    language: {
      type: String,
      default: "en",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QueryHistory", queryHistorySchema);
