const WatchHistory = require("../model/watchHistory.model");

// ─────────────────────────────────────────
// GET watch history — /api/history
// ─────────────────────────────────────────
const getHistory = async (req, res) => {
  try {
    const history = await WatchHistory.find({ user: req.user._id })
      .sort({ lastWatchedAt: -1 })  // sabse recently watched pehle
      .limit(20);                    // max 20 items
    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// POST add to history — /api/history
// Agar same movie hai toh watchCount++ aur lastWatchedAt update
// ─────────────────────────────────────────
const addToHistory = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, releaseDate, overview, rating } = req.body;

    if (!tmdbId) return res.status(400).json({ message: "tmdbId is required" });

    // Upsert — already hai toh update, nahi hai toh create
    const history = await WatchHistory.findOneAndUpdate(
      { user: req.user._id, tmdbId },
      {
        $set: {
          mediaType:     mediaType   || "movie",
          title:         title       || "",
          posterPath:    posterPath  || "",
          releaseDate:   releaseDate || "",
          overview:      overview    || "",
          rating:        rating      || 0,
          lastWatchedAt: Date.now(),
        },
        $inc: { watchCount: 1 },  // har baar +1
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Added to history", history });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// DELETE clear all history — /api/history
// ─────────────────────────────────────────
const clearHistory = async (req, res) => {
  try {
    await WatchHistory.deleteMany({ user: req.user._id });
    res.json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getHistory, addToHistory, clearHistory };