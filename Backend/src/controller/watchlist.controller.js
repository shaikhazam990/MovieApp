const Watchlist = require("../model/watchlist.model");

// GET /api/watchlist
const getWatchlist = async (req, res) => {
  try {
    const items = await Watchlist.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ watchlist: items });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, releaseDate, overview, rating } = req.body;
    if (!tmdbId) return res.status(400).json({ message: "tmdbId required" });

    const exists = await Watchlist.findOne({ user: req.user.id, tmdbId });
    if (exists) return res.status(400).json({ message: "Already in watchlist" });

    const item = await Watchlist.create({
      user: req.user.id,
      tmdbId, mediaType: mediaType || "movie",
      title: title || "", posterPath: posterPath || "",
      releaseDate: releaseDate || "", overview: overview || "",
      rating: rating || 0,
    });

    res.status(201).json({ message: "Added to watchlist", item });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/watchlist/:tmdbId
const removeFromWatchlist = async (req, res) => {
  try {
    const item = await Watchlist.findOneAndDelete({ user: req.user.id, tmdbId: req.params.tmdbId });
    if (!item) return res.status(404).json({ message: "Not in watchlist" });
    res.json({ message: "Removed from watchlist" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };