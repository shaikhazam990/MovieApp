import { createBrowserRouter } from "react-router-dom";

import Protected      from "./features/auth/components/Protected";
import AdminProtected from "./features/auth/components/AdminProtected";

import Login          from "./features/auth/pages/Login";
import Register       from "./features/auth/pages/Register";

import Home           from "./features/movies/pages/Home";
import MovieDetail    from "./features/movies/pages/MovieDetail";
import SearchPage     from "./features/movies/pages/SearchPage";
import TVShows        from "./features/movies/pages/TVShows";

import Favorites      from "./features/favorites/pages/Favorites";
import WatchHistory   from "./features/watchHistory/pages/WatchHistory";
import AdminDashboard from "./features/admin/pages/AdminDashboard";

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

  // ── Admin only ────────────────────────────
  {
    path: "/admin",
    element: <AdminProtected><AdminDashboard /></AdminProtected>,
  },

]);