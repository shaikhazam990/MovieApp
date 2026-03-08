import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  async function fetchWatchlist() {
    setLoading(true);
    try {
      const res = await api.get("/api/watchlist");
      setWatchlist(res.data.watchlist || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  function isInWatchlist(tmdbId) {
    return watchlist.some((item) => item.tmdbId === String(tmdbId));
  }

  async function toggleWatchlist(movieData) {
    if (isInWatchlist(movieData.tmdbId)) {
      await removeFromWatchlist(movieData.tmdbId);
    } else {
      await addToWatchlist(movieData);
    }
  }

  async function addToWatchlist(movieData) {
    try {
      const payload = {
        ...movieData,
        tmdbId: String(movieData.tmdbId), // string convert karo
      };
      const res = await api.post("/api/watchlist", payload);
      setWatchlist((prev) => [res.data.item, ...prev]);
    } catch (err) {
      console.error("Add watchlist failed:", err);
    }
  }

  async function removeFromWatchlist(tmdbId) {
    try {
      await api.delete(`/api/watchlist/${tmdbId}`);
      setWatchlist((prev) => prev.filter((i) => i.tmdbId !== String(tmdbId)));
    } catch (err) {
      console.error("Remove watchlist failed:", err);
    }
  }

  return {
    watchlist,
    loading,
    isInWatchlist,
    toggleWatchlist,
    addToWatchlist,
    removeFromWatchlist,
  };
}
