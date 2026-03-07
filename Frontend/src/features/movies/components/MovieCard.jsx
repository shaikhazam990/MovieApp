import { Link } from "react-router-dom";
import { getImageUrl } from "../services/tmdb.api";
import { useFavorites } from "../../favorites/hooks/useFavorites";
import "./MovieCard.scss";

// Placeholder jab poster na ho
const PLACEHOLDER = "https://via.placeholder.com/300x450/1a1a1a/555?text=No+Poster";

export default function MovieCard({ movie, mediaType = "movie" }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!movie) return null;

  // TMDB movies mein title, TV mein name hota hai
  const title       = movie.title || movie.name || "Unknown";
  const releaseDate = movie.release_date || movie.first_air_date || "";
  const year        = releaseDate ? releaseDate.slice(0, 4) : "N/A";
  const rating      = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const posterUrl   = getImageUrl(movie.poster_path) || PLACEHOLDER;
  const type        = movie.media_type || mediaType; // "movie" ya "tv"
  const linkPath    = `/${type === "tv" ? "tv" : "movie"}/${movie.id}`;

  // Favorite toggle ke liye movie data
  const movieData = {
    tmdbId:      String(movie.id),
    mediaType:   type,
    title,
    posterPath:  movie.poster_path || "",
    releaseDate,
    overview:    movie.overview    || "",
    rating:      movie.vote_average || 0,
  };

  function handleFavoriteClick(e) {
    e.preventDefault(); // Link navigate mat karo
    toggleFavorite(movieData);
  }

  return (
    <Link to={linkPath} className="movie-card">

      {/* Poster */}
      <div className="movie-card__poster">
        <img
          src={posterUrl}
          alt={title}
          onError={(e) => { e.target.src = PLACEHOLDER; }} // broken image fallback
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="movie-card__overlay">
          <span className="movie-card__play">▶ View Details</span>
        </div>

        {/* Favorite button */}
        <button
          className={`movie-card__fav ${isFavorite(movie.id) ? "active" : ""}`}
          onClick={handleFavoriteClick}
          title={isFavorite(movie.id) ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite(movie.id) ? "❤️" : "🤍"}
        </button>

        {/* Rating badge */}
        <div className="movie-card__rating">⭐ {rating}</div>
      </div>

      {/* Info */}
      <div className="movie-card__info">
        <h3 className="movie-card__title">{title}</h3>
        <span className="movie-card__year">{year}</span>
      </div>

    </Link>
  );
}