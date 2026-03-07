const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ── Routes ─────────────────────────────────────
const authRoutes     = require("./routes/auth.routes");
const movieRoutes    = require("./routes/movie.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const historyRoutes  = require("./routes/watchHistory.routes");
const adminRoutes    = require("./routes/admin.routes");
const watchlistRoutes = require("./routes/watchlist.routes");

app.use("/api/watchlist", watchlistRoutes);
app.use("/api/auth",      authRoutes);
app.use("/api/movies",    movieRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/history",   historyRoutes);
app.use("/api/admin",     adminRoutes);

module.exports = app;