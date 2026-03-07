import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL:         import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// ─────────────────────────────────────────
// Async Thunks
// ─────────────────────────────────────────

export const fetchFavorites = createAsyncThunk(
  "favorites/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/favorites");
      return res.data.favorites;
    } catch (err) {
      return rejectWithValue("Failed to fetch favorites");
    }
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/add",
  async (movieData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/favorites", movieData);
      return res.data.favorite;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add");
    }
  }
);

export const removeFavorite = createAsyncThunk(
  "favorites/remove",
  async (tmdbId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/favorites/${tmdbId}`);
      return tmdbId; // remove ke liye tmdbId return karo
    } catch (err) {
      return rejectWithValue("Failed to remove");
    }
  }
);

// ─────────────────────────────────────────
// Slice
// ─────────────────────────────────────────
const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items:   [],
    loading: false,
    error:   null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchFavorites.pending,   (state) => { state.loading = true; })
      .addCase(fetchFavorites.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchFavorites.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // Add — optimistic: seedha list mein daalo
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // Remove — optimistic: seedha list se hatao
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.tmdbId !== String(action.payload));
      });
  },
});

export default favoritesSlice.reducer;