const Favorite = require("../model/favorite.model");

// GET /api/favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })  // ← _id → id
      .sort({ createdAt: -1 });
    res.json({ favorites });
  } catch (err) {
    console.error("getFavorites error:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/favorites
const addFavorite = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, releaseDate, overview, rating } = req.body;

    if (!tmdbId) return res.status(400).json({ message: "tmdbId is required" });

    const exists = await Favorite.findOne({ user: req.user.id, tmdbId }); // ← fix
    if (exists) return res.status(400).json({ message: "Already in favorites" });

    const favorite = await Favorite.create({
      user:        req.user.id,   // ← fix
      tmdbId:      String(tmdbId),
      mediaType:   mediaType   || "movie",
      title:       title       || "",
      posterPath:  posterPath  || "",
      releaseDate: releaseDate || "",
      overview:    overview    || "",
      rating:      rating      || 0,
    });

    res.status(201).json({ message: "Added to favorites", favorite });
  } catch (err) {
    console.error("addFavorite error:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/favorites/:tmdbId
const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user:   req.user.id,   // ← fix
      tmdbId: req.params.tmdbId,
    });

    if (!favorite) return res.status(404).json({ message: "Not in favorites" });

    res.json({ message: "Removed from favorites" });
  } catch (err) {
    console.error("removeFavorite error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };