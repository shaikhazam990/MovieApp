const express         = require("express");
const cookieParser    = require("cookie-parser");
const cors            = require("cors");

// ── Routes — pehle require karo ───────────────
const authRoutes      = require("./routes/auth.routes");
const movieRoutes     = require("./routes/movie.routes");
const favoriteRoutes  = require("./routes/favorite.routes");
const historyRoutes = require("./routes/watchhistory.routes");
const adminRoutes     = require("./routes/admin.routes");
const watchlistRoutes = require("./routes/watchlist.routes");
const settingsRoutes  = require("./routes/settings.routes");

const app = express();

// ── CORS — local + Vercel dono allow ──────────
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowed = [
      "http://localhost:5173",
      "http://localhost:5174",
    ];

    // Exact match ya vercel.app subdomain
    if (allowed.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ── Routes ────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/movies",    movieRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/history",   historyRoutes);
app.use("/api/admin",     adminRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/settings",  settingsRoutes);

// ── Health check ──────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "MovieApp Backend Running 🎬" });
});

module.exports = app;