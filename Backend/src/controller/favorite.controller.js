const Favorite = require("../model/favorite.model");

// ─────────────────────────────────────────
// GET user favorites — /api/favorites
// ─────────────────────────────────────────
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ favorites });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// POST add to favorites — /api/favorites
// ─────────────────────────────────────────
const addFavorite = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, releaseDate, overview, rating } = req.body;

    if (!tmdbId) return res.status(400).json({ message: "tmdbId is required" });

    // Already favorite hai?
    const exists = await Favorite.findOne({ user: req.user._id, tmdbId });
    if (exists) return res.status(400).json({ message: "Already in favorites" });

    const favorite = await Favorite.create({
      user:        req.user._id,
      tmdbId,
      mediaType:   mediaType   || "movie",
      title:       title       || "",
      posterPath:  posterPath  || "",
      releaseDate: releaseDate || "",
      overview:    overview    || "",
      rating:      rating      || 0,
    });

    res.status(201).json({ message: "Added to favorites", favorite });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// DELETE remove from favorites — /api/favorites/:tmdbId
// ─────────────────────────────────────────
const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user:   req.user._id,
      tmdbId: req.params.tmdbId,
    });

    if (!favorite) return res.status(404).json({ message: "Not in favorites" });

    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };