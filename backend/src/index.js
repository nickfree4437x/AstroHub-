// Load environment variables
require("dotenv").config(); // 🔥 must be at the top

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");

const connectDB = require("./config/db");

// Existing routes
const planetRoutes = require("./routes/planetRoutes");
const spaceRoutes = require("./routes/spaceWeather");
const simulationRoutes = require("./routes/simulationRoutes");
const atmosphereRoutes = require("./routes/atmosphereRoutes");
const astronautRoutes = require("./routes/astronautRoutes");
const missionRoutes = require("./routes/missionRoutes");
const habitabilityRoutes = require("./routes/habitabilityRoutes");

// 🆕 AI Research Assistant Route
const aiRoutes = require("./routes/aiRoutes");

// Sync Service
const { syncAstronauts } = require("./services/astronautSyncService");

const app = express();

// Debug: Check if ENV keys loaded
console.log(
  "DEBUG: NASA_API_KEY =",
  process.env.NASA_API_KEY ? "✅ Loaded" : "❌ Missing"
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// DB Connection
connectDB();

// Routes
app.use("/api/v1/planets", planetRoutes);
app.use("/api/v1/space", spaceRoutes); // single route for space weather tracker
app.use("/api/v1/simulations", simulationRoutes);
app.use("/api/atmosphere", atmosphereRoutes);
app.use("/api/v1/astronauts", astronautRoutes);
app.use("/api/v1/missions", missionRoutes);
app.use("/api/habitability", habitabilityRoutes);

// 🆕 AI Assistant Routes
app.use("/api/ai", aiRoutes);

// Health check
app.get("/api/v1/health", (req, res) =>
  res.json({ ok: true, service: "habx-api", ts: Date.now() })
);

// Test route (for debugging only)
app.get("/api/v1/test", (req, res) => {
  res.json({ message: "API running fine with DB connection ✅" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server with Socket.io for live alerts
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 🔄 NASA Space Weather Live Alerts via Socket.io (every 60 sec)
const fetchAPI = require("./utils/apiFetch");
setInterval(async () => {
  try {
    const alerts = await fetchAPI(
      `https://api.nasa.gov/DONKI/FLR?api_key=${process.env.NASA_API_KEY}`
    );
    io.emit("newAlert", alerts);
  } catch (err) {
    console.error("🔥 Socket.io Alert Error:", err.message);
  }
}, 60000);

io.on("connection", (socket) => {
  console.log("Client connected to Socket.io:", socket.id);
});

// 🚀 Schedule Astronaut Data Sync from Launch Library 2
cron.schedule("0 0 * * *", async () => {
  console.log("🔄 Running daily astronaut sync...");
  try {
    await syncAstronauts();
    console.log("✅ Astronaut sync completed successfully");
  } catch (err) {
    console.error("❌ Astronaut sync failed:", err.message);
  }
});

// Also run sync once on server start
(async () => {
  try {
    console.log("🚀 Initial astronaut sync starting...");
    await syncAstronauts();
    console.log("✅ Initial astronaut sync done");
  } catch (err) {
    console.error("❌ Initial sync failed:", err.message);
  }
})();

// Server listen
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`🚀 API running on http://localhost:${PORT}`)
);
