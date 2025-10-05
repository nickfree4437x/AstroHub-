const Astronaut = require("../models/Astronaut");
const SyncMeta = require("../models/SyncMeta");
const { syncAstronauts } = require("../services/astronautSyncService");

// Helper: compute badges & totals for an astronaut
const computeAstronautDerivedFields = (astronaut) => {
  // Ensure missions array exists
  astronaut.missions = astronaut.missions || [];

  // Calculate derived fields
  astronaut.totalSpaceHours = astronaut.missions.reduce((sum, m) => sum + (m.durationHours || 0), 0);
  astronaut.EVAcount = astronaut.missions.reduce((sum, m) => sum + (m.EVAcount || 0), 0);

  astronaut.firstFlightYear = astronaut.missions.reduce((min, m) => {
    if (!m.launchDate) return min;
    const year = new Date(m.launchDate).getFullYear();
    return min === null || year < min ? year : min;
  }, null);

  // Compute badges
  const badges = [];
  if (astronaut.gender === "Female" && astronaut.firstFlightYear) badges.push("First Woman");
  if (astronaut.missions.some(m => m.name?.toLowerCase().includes("iss"))) badges.push("ISS Veteran");
  if (astronaut.missions.some(m => m.name?.toLowerCase().includes("apollo"))) badges.push("Apollo Hero");
  astronaut.badges = badges;
};

// ------------------------- CRUD & API Methods -------------------------

// GET /api/astronauts
exports.getAllAstronauts = async (req, res) => {
  try {
    const {
      name, nickname, nationality, agency, status, gender,
      firstFlightYearMin, firstFlightYearMax,
      totalSpaceHoursMin, totalSpaceHoursMax,
      page = 1, limit = 20, sortBy = "name", sortOrder = "asc"
    } = req.query;

    const filter = {};
    if (name) filter.$or = [{ name: { $regex: name, $options: "i" } }];
    if (nickname) {
      filter.$or = filter.$or || [];
      filter.$or.push({ fuzzySearchKeys: { $regex: nickname, $options: "i" } });
    }
    if (nationality) filter.nationality = nationality;
    if (agency) filter["agency.name"] = agency;
    if (status) filter.status = status;
    if (gender) filter.gender = gender;
    if (firstFlightYearMin || firstFlightYearMax) {
      filter.firstFlightYear = {};
      if (firstFlightYearMin) filter.firstFlightYear.$gte = Number(firstFlightYearMin);
      if (firstFlightYearMax) filter.firstFlightYear.$lte = Number(firstFlightYearMax);
    }
    if (totalSpaceHoursMin || totalSpaceHoursMax) {
      filter.totalSpaceHours = {};
      if (totalSpaceHoursMin) filter.totalSpaceHours.$gte = Number(totalSpaceHoursMin);
      if (totalSpaceHoursMax) filter.totalSpaceHours.$lte = Number(totalSpaceHoursMax);
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;
    const skip = (Number(page) - 1) * Number(limit);

    const [astronauts, total] = await Promise.all([
      Astronaut.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
      Astronaut.countDocuments(filter)
    ]);

    astronauts.forEach(a => computeAstronautDerivedFields(a));
    res.json({ total, page: Number(page), limit: Number(limit), astronauts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/astronauts/:id
exports.getAstronautById = async (req, res) => {
  try {
    const astronaut = await Astronaut.findOne({ externalId: req.params.id }) || await Astronaut.findById(req.params.id);
    if (!astronaut) return res.status(404).json({ message: "Astronaut not found" });

    computeAstronautDerivedFields(astronaut);
    res.json(astronaut);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/astronauts
exports.createAstronaut = async (req, res) => {
  try {
    const astronaut = new Astronaut(req.body);
    computeAstronautDerivedFields(astronaut);
    await astronaut.save();
    res.status(201).json(astronaut);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/astronauts/:id
exports.updateAstronaut = async (req, res) => {
  try {
    const astronaut = await Astronaut.findOneAndUpdate(
      { externalId: req.params.id },
      { $set: req.body },
      { new: true }
    ) || await Astronaut.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!astronaut) return res.status(404).json({ message: "Astronaut not found" });

    computeAstronautDerivedFields(astronaut);
    await astronaut.save();
    res.json(astronaut);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/astronauts/:id
exports.deleteAstronaut = async (req, res) => {
  try {
    const astronaut = await Astronaut.findOneAndDelete({ externalId: req.params.id }) || await Astronaut.findByIdAndDelete(req.params.id);
    if (!astronaut) return res.status(404).json({ message: "Astronaut not found" });
    res.json({ message: "Astronaut deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/astronauts/compare
exports.compareAstronauts = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.status(400).json({ message: "No ids provided" });
    const idArray = ids.split(",");
    const astronauts = await Astronaut.find({
      $or: [
        { externalId: { $in: idArray } },
        { _id: { $in: idArray.filter(id => id.length === 24) } }
      ]
    });

    const comparison = astronauts.map(a => ({
      id: a._id,
      externalId: a.externalId,
      name: a.name,
      agency: a.agency?.name,
      flights_count: a.flights_count,
      totalSpaceHours: a.totalSpaceHours,
      EVAcount: a.EVAcount,
      spacewalks_count: a.spacewalks_count,
      first_flight: a.first_flight,
      last_flight: a.last_flight
    }));
    res.json(comparison);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/astronauts/stats
exports.getStats = async (req, res) => {
  try {
    const perCountry = await Astronaut.aggregate([
      { $group: { _id: "$nationality", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const statusBreakdown = await Astronaut.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const missionsPerYear = await Astronaut.aggregate([
      { $project: { firstFlightYear: 1, flights_count: 1 } },
      { $group: { _id: "$firstFlightYear", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const totalHours = await Astronaut.aggregate([
      { $group: { _id: null, totalSpaceHours: { $sum: "$totalSpaceHours" }, totalEVA: { $sum: "$EVAcount" } } }
    ]);

    res.json({ perCountry, statusBreakdown, missionsPerYear, totalHours: totalHours[0] || {} });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/astronauts/random-spotlight?count=3
exports.getRandomSpotlight = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 1;
    const astronauts = await Astronaut.aggregate([{ $sample: { size: count } }]);
    astronauts.forEach(a => computeAstronautDerivedFields(a));
    res.json(astronauts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/astronauts/force-sync
exports.forceSync = async (req, res) => {
  try {
    const adminKey = req.headers["x-admin-sync-key"] || req.query.adminKey;
    if (!adminKey || adminKey !== process.env.ADMIN_SYNC_KEY) {
      return res.status(401).json({ message: "Unauthorized - missing admin sync key" });
    }
    const result = await syncAstronauts({ source: "launchlib2_manual" });
    res.json({ message: "Force sync completed", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
