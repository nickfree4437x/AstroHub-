const cron = require("node-cron");
const { syncAstronauts } = require("../services/astronautSyncService");

function startScheduler() {
  // schedule from env or default to every 12 hours
  const cronExp = process.env.SYNC_SCHEDULE || "0 */12 * * *";
  console.log("Scheduler: sync cron expression:", cronExp);

  cron.schedule(cronExp, async () => {
    try {
      console.log(`[${new Date().toISOString()}] Starting scheduled astronaut sync...`);
      const result = await syncAstronauts({ source: "launchlib2_scheduled" });
      console.log("Scheduled sync result:", result);
    } catch (err) {
      console.error("Scheduled sync error:", err.message);
    }
  });
}

module.exports = { startScheduler };
