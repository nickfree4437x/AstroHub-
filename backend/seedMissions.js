// backend/seedMissions.js
require("dotenv").config();
const mongoose = require("mongoose");
const fetchLiveMissions = require("./src/utils/fetchMissions");
const Mission = require("./src/models/Mission");

(async () => {
  try {
    console.log("🚀 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");

    console.log("🌍 Fetching live mission data from SpaceDevs...");
    const missions = await fetchLiveMissions();
    console.log(`📡 Total missions fetched: ${missions.length}`);

    if (!missions.length) {
      console.log("⚠️ No missions fetched. Check API or network issue.");
      process.exit(0);
    }

    console.log("🗑️ Clearing old mission cache...");
    await Mission.deleteMany({});

    console.log("💾 Inserting new missions...");
    await Mission.insertMany(
      missions.map((m) => ({
        ...m,
        lastUpdated: new Date(),
      })),
      { ordered: false }
    );

    console.log(`✅ Successfully seeded ${missions.length} missions!`);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 MongoDB connection closed.");
    process.exit(0);
  }
})();
