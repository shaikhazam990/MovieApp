import { configureStore } from "@reduxjs/toolkit";
import authReducer      from "../features/auth/authSlice";
import moviesReducer    from "../features/movies/moviesSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";

const store = configureStore({
  reducer: {
    auth:      authReducer,
    movies:    moviesReducer,
    favorites: favoritesReducer,
  },
});

export default store;