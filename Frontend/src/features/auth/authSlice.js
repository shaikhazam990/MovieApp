import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerApi, loginApi, logoutApi, getMeApi } from "./services/auth.api";

// ─────────────────────────────────────────
// Async Thunks — API calls
// ─────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerApi(data);
      return res.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Register failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      return res.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (err) {
      return rejectWithValue("Logout failed");
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMeApi();
      return res.user;
    } catch (err) {
      return rejectWithValue("Not authenticated");
    }
  }
);

// ─────────────────────────────────────────
// Slice
// ─────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:    null,
    loading: false,
    error:   null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder

      // Register
      .addCase(registerUser.pending,  (state) => { state.loading = true;  state.error = null; })
      .addCase(registerUser.fulfilled,(state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Login
      .addCase(loginUser.pending,  (state) => { state.loading = true;  state.error = null; })
      .addCase(loginUser.fulfilled,(state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Logout
      .addCase(logoutUser.fulfilled,(state) => { state.user = null; })

      // Get Me — app load pe check karo logged in hai ya nahi
      .addCase(getMe.fulfilled, (state, action) => { state.user = action.payload; })
      .addCase(getMe.rejected,  (state) => { state.user = null; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;