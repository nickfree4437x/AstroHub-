const Astronaut = require("../models/Astronaut");
const { fetchJson, parseISODurationToHours } = require("../services/externalApi");
const API_BASE = "https://ll.thespacedevs.com/2.2.0/";

// GET /api/astronauts/:id/missions
exports.getMissionsForAstronaut = async (req, res) => {
  try {
    const astronautId = req.params.id;

    // Find astronaut by externalId or Mongo _id
    const astronaut = await Astronaut.findOne({ externalId: astronautId }) || await Astronaut.findById(astronautId);
    if (!astronaut) return res.status(404).json({ message: "Astronaut not found" });

    // Return cached missions if available
    if (astronaut.missions && astronaut.missions.length > 0) {
      return res.json({ source: "cache", missions: astronaut.missions });
    }

    // Ensure externalId exists for API fetch
    const extId = astronaut.externalId;
    if (!extId) return res.status(400).json({ message: "No external id for astronaut" });

    let data;
    try {
      // Attempt to fetch astronaut flights directly
      data = await fetchJson(`${API_BASE}astronaut/${extId}/`);
    } catch (err) {
      // Fallback: search launches by astronaut name (less accurate)
      const launchesUrl = `${API_BASE}launch/?search=${encodeURIComponent(astronaut.name)}&limit=50`;
      const launches = await fetchJson(launchesUrl);
      data = { flights: [], launches };
    }

    // Map API response to consistent mission format
    let mappedMissions = [];
    if (data.flights && data.flights.length > 0) {
      mappedMissions = data.flights.map(f => ({
        externalId: String(f.id || f.launch),
        name: f.name || f.launch?.name || f.event || "Unknown",
        role: f.role || f.type || null,
        launchDate: f.launch?.net ? new Date(f.launch.net) : f.launchDate ? new Date(f.launchDate) : null,
        landingDate: f.launch?.window_end ? new Date(f.launch.window_end) : null,
        spacecraft: f.vehicle?.name || f.launch?.rocket?.configuration?.name || null,
        durationHours: f.durationHours || null,
        EVAcount: f.eva_count || null,
        EVADurationHours: f.eva_duration ? parseISODurationToHours(f.eva_duration) : null
      }));
    } else if (data.launches?.results) {
      mappedMissions = data.launches.results.map(l => ({
        externalId: String(l.id),
        name: l.name,
        role: null,
        launchDate: l.net ? new Date(l.net) : null,
        landingDate: null,
        spacecraft: l.rocket?.configuration?.name || null,
        durationHours: null,
        EVAcount: null,
        EVADurationHours: null
      }));
    }

    // Cache missions in astronaut document
    astronaut.missions = mappedMissions;
    await astronaut.save();

    res.json({ source: "remote", missions: mappedMissions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
