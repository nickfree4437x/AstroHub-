const express = require("express");
const router = express.Router();
const astronautCtrl = require("../controllers/astronautController");
const missionCtrl = require("../controllers/AstronaultMissionController");

// core CRUD + listing
router.get("/", astronautCtrl.getAllAstronauts);
router.get("/compare", astronautCtrl.compareAstronauts);
router.get("/stats", astronautCtrl.getStats);
router.get("/random-spotlight", astronautCtrl.getRandomSpotlight);

// force sync (admin)
router.post("/force-sync", astronautCtrl.forceSync);

// individual
router.get("/:id", astronautCtrl.getAstronautById);
router.post("/", astronautCtrl.createAstronaut);
router.put("/:id", astronautCtrl.updateAstronaut);
router.delete("/:id", astronautCtrl.deleteAstronaut);

// missions lazy fetch & cache
router.get("/:id/missions", missionCtrl.getMissionsForAstronaut);

module.exports = router;
