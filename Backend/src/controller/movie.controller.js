const Movie = require("../model/movie.model");

// ─────────────────────────────────────────
// GET all movies — /api/movies
// ─────────────────────────────────────────
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json({ movies });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// GET single movie — /api/movies/:id
// ─────────────────────────────────────────
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ movie });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// POST add movie — /api/movies (Admin only)
// ─────────────────────────────────────────
const addMovie = async (req, res) => {
  try {
    const {
      title, posterUrl, description,
      tmdbId, releaseDate, trailerUrl,
      genre, category
    } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const movie = await Movie.create({
      title,
      posterUrl:   posterUrl   || "",
      description: description || "Description not available",
      tmdbId:      tmdbId      || "",
      releaseDate: releaseDate || "",
      trailerUrl:  trailerUrl  || "",
      genre:       genre       || [],
      category:    category    || "movie",
      addedBy:     req.user._id,
    });

    res.status(201).json({ message: "Movie added", movie });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// PUT edit movie — /api/movies/:id (Admin only)
// ─────────────────────────────────────────
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }  // updated document return karo
    );
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie updated", movie });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// DELETE movie — /api/movies/:id (Admin only)
// ─────────────────────────────────────────
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllMovies, getMovieById, addMovie, updateMovie, deleteMovie };