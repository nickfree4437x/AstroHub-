const mongoose = require("mongoose");

const SyncMetaSchema = new mongoose.Schema({
  source: { type: String, required: true, unique: true },
  lastSyncedAt: Date,
  lastCount: Number
}, { timestamps: true });

module.exports = mongoose.model("SyncMeta", SyncMetaSchema);
