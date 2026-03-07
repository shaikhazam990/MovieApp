import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar       from "../components/Navbar";
import MovieCard    from "../components/MovieCard";
import TrailerModal from "../components/TrailerModal";
import { useMovieDetail } from "../hooks/useMovieDetail";
import { useWatchHistory } from "../../watchHistory/hooks/useWatchHistory";
import { useFavorites }    from "../../favorites/hooks/useFavorites";
import { getImageUrl }     from "../services/tmdb.api";
import "./MovieDetail.scss";

const PLACEHOLDER_BG   = "https://via.placeholder.com/1280x720/1a1a1a/333?text=No+Image";
const PLACEHOLDER_POST = "https://via.placeholder.com/300x450/1a1a1a/555?text=No+Poster";

export default function MovieDetail() {
  const { id }       = useParams();
  const location     = useLocation();
  const mediaType    = location.pathname.startsWith("/tv") ? "tv" : "movie";

  const { movie, trailer, similar, recommendations, loading, error } =
    useMovieDetail(id, mediaType);

  const { addToHistory }              = useWatchHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showTrailer, setShowTrailer]  = useState(false);

  // Page open hone pe watch history mein add karo
  useEffect(() => {
    if (movie) {
      addToHistory({
        tmdbId:      String(movie.id),
        mediaType,
        title:       movie.title || movie.name || "",
        posterPath:  movie.poster_path   || "",
        releaseDate: movie.release_date  || movie.first_air_date || "",
        overview:    movie.overview      || "",
        rating:      movie.vote_average  || 0,
      });
    }
  }, [movie]);

  if (loading) return (
    <div className="detail">
      <Navbar />
      <div className="detail__loading">
        <span className="spinner" />
      </div>
    </div>
  );

  if (error || !movie) return (
    <div className="detail">
      <Navbar />
      <div className="detail__error">
        <p>⚠️ Failed to load movie details. Please try again.</p>
      </div>
    </div>
  );

  const title       = movie.title       || movie.name       || "Unknown";
  const releaseDate = movie.release_date || movie.first_air_date || "N/A";
  const overview    = movie.overview    || "Description not available";
  const rating      = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const genres      = movie.genres      || [];
  const runtime     = movie.runtime     ? `${movie.runtime} min` : null;
  const backdropUrl = getImageUrl(movie.backdrop_path, "original") || PLACEHOLDER_BG;
  const posterUrl   = getImageUrl(movie.poster_path)               || PLACEHOLDER_POST;

  const movieData = {
    tmdbId:      String(movie.id),
    mediaType,
    title,
    posterPath:  movie.poster_path  || "",
    releaseDate,
    overview,
    rating:      movie.vote_average || 0,
  };

  return (
    <div className="detail">
      <Navbar />

      {/* Backdrop */}
      <div
        className="detail__backdrop"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="detail__backdrop-overlay" />
      </div>

      {/* Main content */}
      <div className="detail__content">

        {/* Poster */}
        <img
          className="detail__poster"
          src={posterUrl}
          alt={title}
          onError={(e) => { e.target.src = PLACEHOLDER_POST; }}
        />

        {/* Info */}
        <div className="detail__info">

          <h1 className="detail__title">{title}</h1>

          <div className="detail__meta">
            <span className="detail__rating">⭐ {rating}</span>
            <span>{releaseDate.slice(0, 4)}</span>
            {runtime && <span>{runtime}</span>}
            <span className="detail__type">{mediaType.toUpperCase()}</span>
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div className="detail__genres">
              {genres.map((g) => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>
          )}

          <p className="detail__overview">{overview}</p>

          {/* Actions */}
          <div className="detail__actions">
            <button
              className="detail__btn detail__btn--primary"
              onClick={() => setShowTrailer(true)}
            >
              ▶ Watch Trailer
            </button>

            <button
              className={`detail__btn detail__btn--fav ${isFavorite(movie.id) ? "active" : ""}`}
              onClick={() => toggleFavorite(movieData)}
            >
              {isFavorite(movie.id) ? "❤️ Saved" : "🤍 Save"}
            </button>
          </div>

        </div>
      </div>

      {/* Similar Movies */}
      {similar.length > 0 && (
        <div className="detail__similar">
          <h2 className="section-title">Similar Movies</h2>
          <div className="movies-grid">
            {similar.slice(0, 10).map((m) => (
              <MovieCard key={m.id} movie={m} mediaType="movie" />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="detail__similar">
          <h2 className="section-title">Recommended For You</h2>
          <div className="movies-grid">
            {recommendations.slice(0, 10).map((m) => (
              <MovieCard key={m.id} movie={m} mediaType="movie" />
            ))}
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && (
        <TrailerModal
          trailerKey={trailer}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}