const mongoose = require("mongoose");

// Yeh model sirf Admin ke add kiye movies ke liye hai
// TMDB ki movies directly API se aayengi - DB mein nahi save hongi

const movieSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true,
  },

  posterUrl: {
    type: String,
    default: "",  // agar missing ho toh frontend placeholder dikhayega
  },

  description: {
    type: String,
    default: "Description not available",
  },

  // TMDB movie ID — search aur linking ke liye
  tmdbId: {
    type: String,
    default: "",
  },

  releaseDate: {
    type: String,
    default: "",
  },

  // YouTube trailer link
  trailerUrl: {
    type: String,
    default: "",  // agar missing ho toh frontend message dikhayega
  },

  genre: {
    type: [String],  // ["Action", "Drama"] — array of genres
    default: [],
  },

  // Movie ya TV Show
  category: {
    type: String,
    enum: ["movie", "tv", "other"],
    default: "movie",
  },

  // Admin ne add kiya
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);