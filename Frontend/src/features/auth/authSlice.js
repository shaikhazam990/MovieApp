import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerApi,
  loginApi,
  logoutApi,
  getMeApi,
  guestLoginApi,
} from "./services/auth.api";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerApi(data);
      return res.data?.user || res.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Register failed");
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      return res.data?.user || res.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (err) {
      return rejectWithValue("Logout failed");
    }
  },
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMeApi();
      return res.data?.user || res.user;
    } catch (err) {
      return rejectWithValue(null);
    }
  },
);

export const guestLogin = createAsyncThunk(
  "auth/guestLogin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await guestLoginApi();
      return res.data.user;
    } catch (err) {
      return rejectWithValue("Guest login failed");
    }
  },
);

// ─────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    initializing: true,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // ← NEW: college WiFi / backend blocked fallback
    setDemoUser: (state) => {
      state.user = {
        _id: "demo",
        username: "Guest",
        email: "guest@demo.com",
        isGuest: true,
      };
      state.initializing = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Guest Login
      .addCase(guestLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(guestLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(guestLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })

      // getMe
      .addCase(getMe.pending, (state) => {
        state.initializing = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initializing = false;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.initializing = false;
      });
  },
});

// ← setDemoUser export add kiya
export const { clearError, setDemoUser } = authSlice.actions;
export default authSlice.reducer;