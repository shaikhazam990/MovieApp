import { useState, useEffect } from "react";
import axios from "axios";

const TMDB_KEY      = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export function useGenreFilter() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies,        setMovies]        = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [page,          setPage]          = useState(1);
  const [hasMore,       setHasMore]       = useState(true);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    fetchByGenre(selectedGenre, 1);
  }, [selectedGenre]);

  async function fetchByGenre(genreId, pageNum = 1) {
    setLoading(true);
    try {
      const params = {
        api_key:  TMDB_KEY,
        sort_by:  "popularity.desc",
        page:     pageNum,
        ...(genreId && { with_genres: genreId }),
      };
      const res  = await axios.get(`${TMDB_BASE_URL}/discover/movie`, { params });
      const data = res.data;

      if (pageNum === 1) {
        setMovies(data.results || []);
      } else {
        setMovies((prev) => [...prev, ...(data.results || [])]);
      }

      setHasMore(data.page < data.total_pages);
      setPage(data.page);
    } catch (err) {
      console.error("Genre filter failed:", err);
    } finally {
      setLoading(false);
    }
  }

  function loadMore() {
    if (!loading && hasMore) fetchByGenre(selectedGenre, page + 1);
  }

  return {
    selectedGenre,
    setSelectedGenre,
    movies,
    loading,
    hasMore,
    loadMore,
  };
}