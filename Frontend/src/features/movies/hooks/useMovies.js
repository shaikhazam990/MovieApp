import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTrending,
  fetchPopularMovies,
  fetchPopularTV,
  fetchNowPlaying,
  fetchUpcoming,
  fetchTopRated,
} from "../moviesSlice";

export function useMovies() {
  const dispatch = useDispatch();
  const {
    trending, popular, popularTV,
    nowPlaying, upcoming, topRated,
    loading, error,
  } = useSelector((state) => state.movies);

  // Sirf ek baar fetch karo — already data hai toh skip
  useEffect(() => {
    if (trending.length   === 0) dispatch(fetchTrending());
    if (popular.length    === 0) dispatch(fetchPopularMovies(1));
    if (popularTV.length  === 0) dispatch(fetchPopularTV(1));
    if (nowPlaying.length === 0) dispatch(fetchNowPlaying());
    if (upcoming.length   === 0) dispatch(fetchUpcoming());
    if (topRated.length   === 0) dispatch(fetchTopRated());
  }, [dispatch]);

  // Infinite scroll ke liye next page load karo
  function loadMoreMovies(currentPage) {
    dispatch(fetchPopularMovies(currentPage + 1));
  }

  function loadMoreTV(currentPage) {
    dispatch(fetchPopularTV(currentPage + 1));
  }

  return {
    trending,
    popular,
    popularTV,
    nowPlaying,
    upcoming,
    topRated,
    loading,
    error,
    loadMoreMovies,
    loadMoreTV,
  };
}