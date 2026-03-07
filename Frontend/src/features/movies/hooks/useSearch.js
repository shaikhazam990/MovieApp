import { useState, useEffect, useRef } from "react";
import { searchMulti } from "../services/tmdb.api";

export function useSearch() {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [page,    setPage]    = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const debounceRef = useRef(null);

  useEffect(() => {
    // Query empty hai toh results clear karo
    if (!query.trim()) {
      setResults([]);
      setHasMore(false);
      return;
    }

    // Pehle wala timer cancel karo
    clearTimeout(debounceRef.current);

    // 500ms baad search — unnecessary API calls rokta hai (debouncing)
    debounceRef.current = setTimeout(() => {
      doSearch(query, 1);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  async function doSearch(q, pageNum = 1) {
    setLoading(true);
    setError(null);

    try {
      const res  = await searchMulti(q, pageNum);
      const data = res.data;

      if (pageNum === 1) {
        setResults(data.results || []);               // fresh search
      } else {
        setResults((prev) => [...prev, ...(data.results || [])]); // append
      }

      setHasMore(data.page < data.total_pages);
      setPage(data.page);

    } catch (err) {
      setError("Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // Load more — infinite scroll ke liye
  function loadMore() {
    if (!loading && hasMore) {
      doSearch(query, page + 1);
    }
  }

  return {
    query,
    setQuery,  // input se seedha bind karo: onChange={(e) => setQuery(e.target.value)}
    results,
    loading,
    error,
    hasMore,
    loadMore,
  };
}