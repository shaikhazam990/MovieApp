import { useState, useEffect } from "react";
import {
  getMovieDetails,
  getTVDetails,
  getMovieVideos,
  getTVVideos,
  getSimilarMovies,
  getRecommendations,
} from "../services/tmdb.api";

export function useMovieDetail(id, mediaType = "movie") {
  const [movie,           setMovie]           = useState(null);
  const [trailer,         setTrailer]         = useState(null); // YouTube key
  const [similar,         setSimilar]         = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchAll();
  }, [id, mediaType]);

  async function fetchAll() {
    setLoading(true);
    setError(null);

    try {
      // Details aur videos parallel mein fetch karo — faster
      const [detailRes, videoRes] = await Promise.all([
        mediaType === "movie" ? getMovieDetails(id) : getTVDetails(id),
        mediaType === "movie" ? getMovieVideos(id)  : getTVVideos(id),
      ]);

      setMovie(detailRes.data);

      // Trailer dhundo — YouTube pe "Trailer" type ka video
      const videos = videoRes.data.results || [];
      const trailerVideo = videos.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      setTrailer(trailerVideo ? trailerVideo.key : null);

      // Similar aur recommendations sirf movies ke liye
      if (mediaType === "movie") {
        const [simRes, recRes] = await Promise.all([
          getSimilarMovies(id),
          getRecommendations(id),
        ]);
        setSimilar(simRes.data.results       || []);
        setRecommendations(recRes.data.results || []);
      }

    } catch (err) {
      setError("Failed to load movie details");
    } finally {
      setLoading(false);
    }
  }

  return {
    movie,
    trailer,   // null matlab trailer nahi mili — UI handle karega
    similar,
    recommendations,
    loading,
    error,
  };
}