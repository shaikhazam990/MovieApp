const mongoose = require("mongoose");

const watchHistorySchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  tmdbId: {
    type: String,
    required: true,
  },

  mediaType: {
    type: String,
    enum: ["movie", "tv"],
    default: "movie",
  },

  // Basic info save karte hain
  title: { type: String, default: "" },
  posterPath: { type: String, default: "" },
  releaseDate: { type: String, default: "" },
  overview: { type: String, default: "" },
  rating: { type: Number, default: 0 },

  // Kitni baar dekha
  watchCount: {
    type: Number,
    default: 1,
  },

  // Last dekha kab
  lastWatchedAt: {
    type: Date,
    default: Date.now,
  },

}, { timestamps: true });

// Same user same movie — upsert karenge (nahi toh duplicates aayenge)
watchHistorySchema.index({ user: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model("WatchHistory", watchHistorySchema);