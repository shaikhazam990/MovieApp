import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Protected      from "./src/features/auth/components/Protected";
import AdminProtected from "./src/features/auth/components/AdminProtected";

import Login          from "./src/features/auth/pages/Login";
import Register       from "./src/features/auth/pages/Register";

import Home           from "./src/features/movies/pages/Home";
import MovieDetail    from "./src/features/movies/pages/MovieDetail";
import SearchPage     from "./src/features/movies/pages/SearchPage";
import TVShows        from "./src/features/movies/pages/TVShows";

import Favorites      from "./src/features/favorites/pages/Favorites";
import WatchHistory   from "./src/features/watchHistory/pages/WatchHistory";
import AdminDashboard from "./src/features/admin/pages/AdminDashboard";

import Watchlist  from "./src/features/watchlist/pages/Watchlist";
import MoodPicker from "./src/features/mood/pages/MoodPicker";

import Settings from "./src/features/settings/pages/Settings";

export const router = createBrowserRouter([

  // ── Public routes ─────────────────────────
  { path: "/login",    element: <Login /> },
  { path: "/register", element: <Register /> },

  // ── Protected routes — login zaroori ──────

  {
    path: "/",
    element: <Protected><Home /></Protected>,
  },
  {
    path: "/movie/:id",
    element: <Protected><MovieDetail /></Protected>,
  },
  {
    path: "/tv/:id",
    element: <Protected><MovieDetail /></Protected>,
  },
  {
    path: "/search",
    element: <Protected><SearchPage /></Protected>,
  },
  {
    path: "/tv-shows",
    element: <Protected><TVShows /></Protected>,
  },
  {
    path: "/favorites",
    element: <Protected><Favorites /></Protected>,
  },
  {
    path: "/history",
    element: <Protected><WatchHistory /></Protected>,
  },
  { path: "/watchlist", element: <Protected><Watchlist /></Protected> },
  { path: "/mood",      element: <Protected><MoodPicker /></Protected> },

  // ── Admin only ────────────────────────────
  {
    path: "/admin",
    element: <AdminProtected><AdminDashboard /></AdminProtected>,
  },
  { path: "/settings", element: <Protected><Settings /></Protected> },

]);