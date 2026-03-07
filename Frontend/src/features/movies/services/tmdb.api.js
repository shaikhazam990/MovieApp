import axios from "axios";

const tmdb = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL, // https://api.themoviedb.org/3
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

// ── Image URL helper ──────────────────────────────────────
export const getImageUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

// ── Trending ─────────────────────────────────────────────
export const getTrending = (mediaType = "all", timeWindow = "day") =>
  tmdb.get(`/trending/${mediaType}/${timeWindow}`);

// ── Popular ──────────────────────────────────────────────
export const getPopularMovies  = (page = 1) => tmdb.get("/movie/popular",   { params: { page } });
export const getPopularTV      = (page = 1) => tmdb.get("/tv/popular",      { params: { page } });

// ── Top Rated ────────────────────────────────────────────
export const getTopRatedMovies = (page = 1) => tmdb.get("/movie/top_rated", { params: { page } });
export const getTopRatedTV     = (page = 1) => tmdb.get("/tv/top_rated",    { params: { page } });

// ── Now Playing / Upcoming ───────────────────────────────
export const getNowPlaying     = (page = 1) => tmdb.get("/movie/now_playing",{ params: { page } });
export const getUpcoming       = (page = 1) => tmdb.get("/movie/upcoming",   { params: { page } });

// ── Movie Details ─────────────────────────────────────────
export const getMovieDetails   = (id) => tmdb.get(`/movie/${id}`);
export const getTVDetails      = (id) => tmdb.get(`/tv/${id}`);

// ── Trailer / Videos ─────────────────────────────────────
export const getMovieVideos    = (id) => tmdb.get(`/movie/${id}/videos`);
export const getTVVideos       = (id) => tmdb.get(`/tv/${id}/videos`);

// ── Search ───────────────────────────────────────────────
export const searchMulti       = (query, page = 1) =>
  tmdb.get("/search/multi", { params: { query, page } });

export const searchMovies      = (query, page = 1) =>
  tmdb.get("/search/movie", { params: { query, page } });

export const searchTV          = (query, page = 1) =>
  tmdb.get("/search/tv",    { params: { query, page } });

export const searchPerson      = (query, page = 1) =>
  tmdb.get("/search/person",{ params: { query, page } });

// ── People ───────────────────────────────────────────────
export const getPopularPeople  = (page = 1) => tmdb.get("/person/popular", { params: { page } });
export const getPersonDetails  = (id)       => tmdb.get(`/person/${id}`);

// ── Genres ───────────────────────────────────────────────
export const getMovieGenres    = () => tmdb.get("/genre/movie/list");
export const getTVGenres       = () => tmdb.get("/genre/tv/list");

// ── Similar / Recommendations ────────────────────────────
export const getSimilarMovies  = (id) => tmdb.get(`/movie/${id}/similar`);
export const getRecommendations= (id) => tmdb.get(`/movie/${id}/recommendations`);