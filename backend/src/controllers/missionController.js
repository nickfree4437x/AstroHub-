// controllers/missionController.js
const Mission = require("../models/Mission");
const fetchLiveMissions = require("../utils/fetchMissions");

// Get all missions - DEBUG READY + duplicate-safe + object-safe
exports.getMissions = async (req, res) => {
  console.log("🚀 getMissions called");

  try {
    // Step 1: Fetch missions from DB
    let missions = await Mission.find({});
    console.log(`📂 Missions in DB: ${missions.length}`);

    const now = new Date();
    const isCacheOld =
      missions.length === 0 ||
      !missions[0].lastUpdated ||
      now - missions[0].lastUpdated > 3600000; // 1 hour cache
    console.log(`⏱️ Cache old? ${isCacheOld}`);

    // Step 2: Fetch from live API if cache missing / old
    if (isCacheOld) {
      console.log("🌐 Fetching missions from SpaceDevs API...");
      const liveMissions = await fetchLiveMissions();

      if (!liveMissions.length) {
        console.warn("⚠️ No missions returned from live API");
      } else {
        console.log(`✅ Fetched ${liveMissions.length} missions from API`);

        // Step 3: Clear old cache safely
        await Mission.deleteMany({});
        console.log("🗑️ Old missions cleared from DB");

        // Step 4: Save new missions safely, avoid duplicates
        const missionsToSave = liveMissions.map((m) => ({
          missionId: m.missionId || `mission_${Date.now()}_${Math.random()}`,
          name: m.name || "Unnamed Mission",
          agency: m.agency || "N/A",
          destination: m.destination || "N/A", // must be string
          status: m.status || "Upcoming",
          launchDate: m.launchDate || null,
          crew: m.crew || 0,
          duration: m.duration || "N/A",
          cost: m.cost || "N/A",
          type: m.type || "Uncrewed",
          image: m.image || "",
          lastUpdated: new Date(),
        }));

        try {
          await Mission.insertMany(missionsToSave, { ordered: false });
          console.log("💾 Missions saved to DB with lastUpdated");
        } catch (insertErr) {
          console.warn(
            "⚠️ Some missions may not have been saved due to duplicates or errors",
            insertErr.message
          );
        }

        missions = missionsToSave;
      }
    }

    // Step 5: Send missions
    res.json(missions);
    console.log(`📤 Sent ${missions.length} missions to client`);
  } catch (err) {
    console.error("❌ Error in getMissions:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get single mission
exports.getMissionById = async (req, res) => {
  const { id } = req.params;
  console.log(`🔍 getMissionById called for ID: ${id}`);

  try {
    const mission = await Mission.findOne({ missionId: id });
    if (!mission) {
      console.warn(`⚠️ Mission not found: ${id}`);
      return res.status(404).json({ message: "Mission not found" });
    }
    res.json(mission);
    console.log(`📤 Sent mission: ${mission.name}`);
  } catch (err) {
    console.error("❌ Error in getMissionById:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
