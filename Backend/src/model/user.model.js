const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  username: {
    type:     String,
    required: true,
    unique:   true,
    trim:     true,
  },

  email: {
    type:     String,
    required: true,
    unique:   true,
    trim:     true,
    lowercase: true,
  },

  password: {
    type:     String,
    required: true,
    select:   false,
  },

  isAdmin: {
    type:    Boolean,
    default: false,
  },

  isBanned: {
    type:    Boolean,
    default: false,
  },

  // ── Settings fields ───────────────────
  avatar: {
    type:    String,
    default: "", // image URL
  },

  language: {
    type:    String,
    default: "en",
  },

  region: {
    type:    String,
    default: "US",
  },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);