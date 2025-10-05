const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Auto model selection via REST
let selectedModel = null;

const pickBestModel = async () => {
  try {
    if (!selectedModel) {
      const resp = await axios.get(
        `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
      );

      const modelNames = resp.data.models.map((m) => m.name);
      console.log("🔍 Gemini Models Available:", modelNames);

      if (modelNames.includes("models/gemini-1.5-flash-latest")) {
        selectedModel = "models/gemini-1.5-flash-latest";
      } else if (modelNames.includes("models/gemini-1.5-pro-latest")) {
        selectedModel = "models/gemini-1.5-pro-latest";
      } else {
        selectedModel = modelNames[0]; // fallback
      }

      console.log("✅ Selected Gemini Model:", selectedModel);
    }
    return selectedModel;
  } catch (err) {
    console.error("❌ Error selecting Gemini model:", err.response?.data || err.message);
    throw new Error("Failed to select Gemini model");
  }
};

// 🎯 Generic AI Response (chat + data viz)
const getGeminiResponse = async (query, mode = "quick", language = "en") => {
  try {
    let systemPrompt = "";
    switch (mode) {
      case "quick":
        systemPrompt = "Answer concisely about astronomy and space.";
        break;
      case "deep":
        systemPrompt =
          "Give a detailed research-style explanation with references if possible.";
        break;
      case "data":
        systemPrompt = `You are a data analysis assistant.
Return both:
1. A short human-readable explanation.
2. A valid JSON object ONLY ONCE in this format:
{
  "type": "bar" | "line" | "timeline" | "pie",
  "labels": ["..."],
  "datasets": [
    { "label": "NASA", "values": [ ... ] },
    { "label": "SpaceX", "values": [ ... ] }
  ]
}`;
        break;
      case "prediction":
        systemPrompt =
          "Provide forecasts or predictions based on astronomy knowledge.";
        break;
      default:
        systemPrompt = "You are a helpful space research assistant.";
    }

    let prompt = `${systemPrompt}\nUser Query: ${query}`;
    if (language === "hi") {
      prompt = `${systemPrompt}\nUser Query: ${query}\nAnswer in Hindi.`;
    }

    const modelName = await pickBestModel();
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    let structuredData = null;
    let cleanAnswer = rawText;

    // 🔍 Extract JSON block if available (for data mode)
    if (mode === "data") {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          structuredData = JSON.parse(jsonMatch[0]);
          cleanAnswer = rawText.replace(jsonMatch[0], "").trim();
        } catch (err) {
          console.warn("⚠️ Could not parse structured JSON from Gemini.");
        }
      }
    }

    return {
      answer: cleanAnswer,
      structuredData, // ✅ chart data for frontend
      sources: ["Google Gemini", modelName],
    };
  } catch (err) {
    console.error("❌ Gemini API Error:", err.response?.data || err.message);
    throw new Error("Failed to fetch Gemini AI response");
  }
};

// 🎯 Research Paper Abstract Summarizer
const getGeminiSummary = async (abstract) => {
  try {
    if (!abstract) return null;

    const modelName = await pickBestModel();
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Summarize this research paper abstract in 2-3 simple sentences for a general audience:\n\n${abstract}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("❌ Gemini Summary Error:", err.message);
    return abstract; // fallback to original abstract
  }
};

module.exports = { getGeminiResponse, getGeminiSummary };
