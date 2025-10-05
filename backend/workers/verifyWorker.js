// workers/verifyWorker.js
const Queue = require("bull");
const Contribution = require("../src/models/Contribution");
const User = require("../src/models/User");
const imageHash = require("image-hash"); // npm i image-hash

// ✅ Fix: node-fetch (dynamic import for CommonJS)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Queue setup
const verifyQueue = new Queue(
  "verify_contribution",
  process.env.REDIS_URL || "redis://127.0.0.1:6379"
);

// Simple helper to compute hash
function computeImageHash(url) {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch remote image (buffer)
      const res = await fetch(url);
      if (!res.ok) return reject(new Error(`Failed to fetch image: ${res.status}`));
      const buffer = await res.arrayBuffer();

      // image-hash expects file path or buffer
      imageHash({ data: Buffer.from(buffer) }, 16, true, (err, hash) => {
        if (err) return reject(err);
        resolve(hash);
      });
    } catch (err) {
      reject(err);
    }
  });
}

// Worker logic
verifyQueue.process(async (job) => {
  const { contributionId } = job.data;
  const c = await Contribution.findById(contributionId);
  if (!c) throw new Error("Contribution not found");

  try {
    const media = c.media && c.media[0];
    if (!media) {
      c.status = "flagged";
      await c.save();
      return;
    }

    // --- Basic AI/Hash check ---
    let aiScore = 0.5;
    let issues = [];

    if (media.url) {
      try {
        const hash = await computeImageHash(media.url);
        console.log("✅ Image hash computed:", hash);

        // Dummy check: if hash starts with "0000", mark as suspicious
        if (hash.startsWith("0000")) {
          aiScore = 0.3;
          issues.push("Possible duplicate or low-quality image");
        } else {
          aiScore = 0.85;
        }
      } catch (e) {
        console.error("⚠️ Image hash failed:", e.message);
        aiScore = 0.5;
        issues.push("Image could not be verified");
      }
    }

    c.aiReview = { score: aiScore, issues };
    c.status = aiScore >= 0.6 ? "approved" : "flagged";

    await c.save();

    // Award points if approved
    if (c.user && c.status === "approved") {
      const user = await User.findById(c.user);
      if (user) {
        user.points = (user.points || 0) + 10; // reward system
        await user.save();
      }
    }

    // Optional: notify via socket.io
    // io.to(c.user).emit("contribution:reviewed", { id: c._id, status: c.status });

    return true;
  } catch (e) {
    console.error("❌ verify worker error:", e);
    c.status = "flagged";
    await c.save();
    throw e;
  }
});

module.exports = verifyQueue;
