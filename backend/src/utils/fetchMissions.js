// utils/fetchMissions.js
const axios = require("axios");

async function fetchLiveMissions(retryCount = 0) {
  console.log("🌐 fetchLiveMissions called");

  try {
    const url = "https://ll.thespacedevs.com/2.2.0/launch/?limit=50&ordering=net";
    console.log(`🔗 Fetching from: ${url}`);

    const response = await axios.get(url);
    console.log(`📦 Raw API response received`);

    const launches = response.data.results || [];
    console.log(`🚀 Total launches received: ${launches.length}`);

    if (!launches.length) {
      console.warn("⚠️ No launches found in API response");
      return [];
    }

    const missions = launches.map((launch) => {
      const missionObj = {
        missionId: launch.id || `mission_${Date.now()}`, // unique ID for DB
        name: launch.name || "Unnamed Mission",
        agency: launch.launch_service_provider?.name || "N/A",
        destination:
          launch.mission?.orbit?.name ||
          launch.mission?.orbit?.abbrev ||
          "N/A", // ✅ string only
        status: launch.status?.name || "Upcoming",
        launchDate: launch.net || null,
        crew: Array.isArray(launch.crew) ? launch.crew.length : 0,
        duration: launch.mission?.duration || "N/A",
        cost: launch.mission?.cost ? `$${launch.mission.cost}M` : "N/A",
        type: launch.mission?.type || "Uncrewed",
        image: launch.image || "", // Thumbnail
      };

      console.log(
        `🛰️ Parsed mission: ${missionObj.name} | Agency: ${missionObj.agency} | Destination: ${missionObj.destination} | Status: ${missionObj.status}`
      );

      return missionObj;
    });

    console.log(`✅ Missions parsed: ${missions.length}`);
    return missions;
  } catch (err) {
    // Handle 429 Rate Limit
    if (err.response?.status === 429 && retryCount < 3) {
      const waitTime = 30000; // 30 seconds
      console.warn(
        `🚨 429 Rate Limit hit. Retrying after ${waitTime / 1000} sec... (Attempt ${
          retryCount + 1
        })`
      );
      await new Promise((r) => setTimeout(r, waitTime));
      return fetchLiveMissions(retryCount + 1); // retry
    }

    console.error("❌ Error fetching live missions:", err.message);
    return [];
  }
}

module.exports = fetchLiveMissions;
