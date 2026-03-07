import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from "../favoritesSlice";

export function useFavorites() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.favorites);

  // Mount pe favorites fetch karo
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchFavorites());
    }
  }, [dispatch]);

  // Koi movie favorite hai ya nahi check karo
  function isFavorite(tmdbId) {
    return items.some((item) => item.tmdbId === String(tmdbId));
  }

  // Toggle — favorite hai toh remove, nahi hai toh add
  function toggleFavorite(movieData) {
    if (isFavorite(movieData.tmdbId)) {
      dispatch(removeFavorite(movieData.tmdbId));
    } else {
      dispatch(addFavorite(movieData));
    }
  }

  function handleAddFavorite(movieData) {
    dispatch(addFavorite(movieData));
  }

  function handleRemoveFavorite(tmdbId) {
    dispatch(removeFavorite(tmdbId));
  }

  return {
    favorites: items,
    loading,
    error,
    isFavorite,
    toggleFavorite,
    handleAddFavorite,
    handleRemoveFavorite,
  };
}