const express = require("express");
const router = express.Router();
const { processQuery, listModels, fetchResearchPapers } = require("../controllers/aiController");

// @route   POST /api/ai/query
router.post("/query", processQuery);

// 🆕 @route   GET /api/ai/models
router.get("/models", listModels);

// @route   GET /api/ai/papers?query=mars
router.get("/papers", fetchResearchPapers);


module.exports = router;
