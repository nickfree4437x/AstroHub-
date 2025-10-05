const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const seedMissionsData = require("./src/seed/missionsSeed");

async function runSeeder() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🚀 MongoDB connected");

    await seedMissionsData();

    console.log("🌱 Seeding finished");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Connection closed");
  }
}

runSeeder();
