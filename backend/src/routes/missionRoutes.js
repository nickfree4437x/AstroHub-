const express = require("express");
const router = express.Router();
const { getMissions, getMissionById } = require("../controllers/missionController");

router.get("/", getMissions);          // GET all missions
router.get("/:id", getMissionById);    // GET single mission

module.exports = router;
