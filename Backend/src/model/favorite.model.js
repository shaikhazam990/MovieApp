const mongoose = require("mongoose");

// Ek user ka ek movie sirf ek baar favorite ho sakta hai
// tmdbId store karte hain kyunki TMDB movies DB mein nahi hoti

const favoriteSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // TMDB ka movie/show ID
  tmdbId: {
    type: String,
    required: true,
  },

  // movie ya tv
  mediaType: {
    type: String,
    enum: ["movie", "tv"],
    default: "movie",
  },

  // Basic info save karte hain taaki bar bar TMDB call na karni pade
  title: { type: String, default: "" },
  posterPath: { type: String, default: "" },
  releaseDate: { type: String, default: "" },
  overview: { type: String, default: "" },
  rating: { type: Number, default: 0 },

}, { timestamps: true });

// Same user same movie dobara favorite na kar sake
favoriteSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);