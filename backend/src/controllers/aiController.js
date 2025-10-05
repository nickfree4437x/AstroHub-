const QueryHistory = require("../models/QueryHistory");
const { getGeminiResponse, getGeminiSummary } = require("../utils/geminiModel"); // ✅ add summary helper
const axios = require("axios"); // ✅ import axios
const xml2js = require("xml2js"); // ✅ import xml parser

// 🎯 Controller: Process AI Query
const processQuery = async (req, res) => {
  try {
    const { query, mode = "quick", language = "en", userId = null } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query text is required" });
    }

    // 🔥 Call Gemini API
    const { answer, structuredData, sources } = await getGeminiResponse(
      query,
      mode,
      language
    );

    // 🗄️ Save query history (text only for now)
    const newHistory = new QueryHistory({
      user: userId || null,
      query,
      response: answer,
      mode,
      sources,
      language,
    });
    await newHistory.save();

    // ✅ Send back response
    res.json({
      queryId: newHistory._id,
      query,
      answer,
      structuredData: structuredData || null,
      sources,
      mode,
      language,
      createdAt: newHistory.createdAt,
    });
  } catch (err) {
    console.error("❌ AI Query Error:", err.message);
    res.status(500).json({ error: "Failed to process AI query" });
  }
};

// 🎯 List Gemini Models
const listModels = async (req, res) => {
  try {
    const models = [
      { id: "quick", description: "Quick Facts Mode – Instant short answers" },
      { id: "deep", description: "Deep Research Mode – Detailed explanation with references" },
      { id: "data", description: "Data Mode – Tables, graphs, datasets" },
      { id: "prediction", description: "Prediction Mode – Future insights" },
      { id: "papers", description: "Research Papers Mode – Fetch papers + AI summary" }, // ✅ new mode
    ];
    res.json({ models });
  } catch (err) {
    console.error("❌ List Models Error:", err.message);
    res.status(500).json({ error: "Failed to list models" });
  }
};

// 🎯 Fetch research papers
const fetchResearchPapers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    // Call arXiv API
    const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
      query
    )}&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending`;

    const response = await axios.get(url);

    // arXiv API returns XML, parse it
    const parsed = await xml2js.parseStringPromise(response.data);
    const entries = parsed.feed.entry || [];

    const papers = await Promise.all(
      entries.map(async (entry) => {
        const title = entry.title?.[0]?.trim();
        const authors = entry.author?.map((a) => a.name[0]) || [];
        const summary = entry.summary?.[0]?.trim();
        const published = entry.published?.[0];
        const pdfUrl = entry.id?.[0]?.replace("abs", "pdf");

        // ✅ Gemini summarization (fallback to original abstract)
        const aiSummary = await getGeminiSummary(summary);

        return {
          title,
          authors,
          year: published ? new Date(published).getFullYear() : null,
          summary: aiSummary || summary,
          pdfUrl,
          source: "arXiv",
        };
      })
    );

    res.json({ query, count: papers.length, papers });
  } catch (err) {
    console.error("❌ Paper Fetch Error:", err.message);
    res.status(500).json({ error: "Failed to fetch research papers" });
  }
};

module.exports = { processQuery, listModels, fetchResearchPapers };
