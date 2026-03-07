import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL:         import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export function useWatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  // ── Fetch history ──────────────────────
  async function fetchHistory() {
    setLoading(true);
    try {
      const res = await api.get("/api/history");
      setHistory(res.data.history || []);
    } catch (err) {
      setError("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  }

  // ── Add to history — movie page open hone pe call karo ──
  async function addToHistory(movieData) {
    try {
      await api.post("/api/history", movieData);

      // Local state update — bar bar fetch na karna pade
      setHistory((prev) => {
        const exists = prev.find((h) => h.tmdbId === String(movieData.tmdbId));
        if (exists) {
          // Already hai toh watchCount++ aur upar le jao
          return [
            { ...exists, watchCount: exists.watchCount + 1, lastWatchedAt: new Date() },
            ...prev.filter((h) => h.tmdbId !== String(movieData.tmdbId)),
          ];
        }
        return [{ ...movieData, watchCount: 1, lastWatchedAt: new Date() }, ...prev];
      });

    } catch (err) {
      // History error pe silently fail karo — UX break na ho
      console.error("History add failed:", err);
    }
  }

  // ── Clear all history ──────────────────
  async function clearHistory() {
    try {
      await api.delete("/api/history");
      setHistory([]);
    } catch (err) {
      setError("Failed to clear history");
    }
  }

  return {
    history,
    loading,
    error,
    addToHistory,
    clearHistory,
    refetch: fetchHistory,
  };
}