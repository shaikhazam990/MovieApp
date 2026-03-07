const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tmdbId:      { type: String, required: true },
  mediaType:   { type: String, enum: ["movie", "tv"], default: "movie" },
  title:       { type: String, default: "" },
  posterPath:  { type: String, default: "" },
  releaseDate: { type: String, default: "" },
  overview:    { type: String, default: "" },
  rating:      { type: Number, default: 0 },
}, { timestamps: true });

watchlistSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);