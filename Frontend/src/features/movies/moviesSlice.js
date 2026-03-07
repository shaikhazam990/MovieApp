import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTrending,
  getPopularMovies,
  getPopularTV,
  getNowPlaying,
  getUpcoming,
  getTopRatedMovies,
} from "./services/tmdb.api";

// ─────────────────────────────────────────
// Async Thunks
// ─────────────────────────────────────────

export const fetchTrending = createAsyncThunk(
  "movies/fetchTrending",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getTrending("all", "day");
      return res.data.results;
    } catch (err) {
      return rejectWithValue("Failed to fetch trending");
    }
  }
);

export const fetchPopularMovies = createAsyncThunk(
  "movies/fetchPopular",
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await getPopularMovies(page);
      return { results: res.data.results, page };
    } catch (err) {
      return rejectWithValue("Failed to fetch popular movies");
    }
  }
);

export const fetchPopularTV = createAsyncThunk(
  "movies/fetchPopularTV",
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await getPopularTV(page);
      return { results: res.data.results, page };
    } catch (err) {
      return rejectWithValue("Failed to fetch TV shows");
    }
  }
);

export const fetchNowPlaying = createAsyncThunk(
  "movies/fetchNowPlaying",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getNowPlaying();
      return res.data.results;
    } catch (err) {
      return rejectWithValue("Failed to fetch now playing");
    }
  }
);

export const fetchUpcoming = createAsyncThunk(
  "movies/fetchUpcoming",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUpcoming();
      return res.data.results;
    } catch (err) {
      return rejectWithValue("Failed to fetch upcoming");
    }
  }
);

export const fetchTopRated = createAsyncThunk(
  "movies/fetchTopRated",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getTopRatedMovies();
      return res.data.results;
    } catch (err) {
      return rejectWithValue("Failed to fetch top rated");
    }
  }
);

// ─────────────────────────────────────────
// Slice
// ─────────────────────────────────────────
const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    trending:   [],
    popular:    [],
    popularTV:  [],
    nowPlaying: [],
    upcoming:   [],
    topRated:   [],
    loading:    false,
    error:      null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Trending
      .addCase(fetchTrending.pending,   (state) => { state.loading = true; })
      .addCase(fetchTrending.fulfilled, (state, action) => { state.loading = false; state.trending = action.payload; })
      .addCase(fetchTrending.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // Popular Movies — infinite scroll ke liye append karo
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        const { results, page } = action.payload;
        if (page === 1) {
          state.popular = results;              // fresh load
        } else {
          state.popular = [...state.popular, ...results]; // append
        }
      })

      // Popular TV
      .addCase(fetchPopularTV.fulfilled, (state, action) => {
        const { results, page } = action.payload;
        if (page === 1) {
          state.popularTV = results;
        } else {
          state.popularTV = [...state.popularTV, ...results];
        }
      })

      // Now Playing
      .addCase(fetchNowPlaying.fulfilled, (state, action) => { state.nowPlaying = action.payload; })

      // Upcoming
      .addCase(fetchUpcoming.fulfilled, (state, action) => { state.upcoming = action.payload; })

      // Top Rated
      .addCase(fetchTopRated.fulfilled, (state, action) => { state.topRated = action.payload; });
  },
});

export default moviesSlice.reducer;