import { Link }       from "react-router-dom";
import { useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "../../favorites/favoritesSlice";
import { useFavorites } from "../../favorites/hooks/useFavorites";
import { getImageUrl }  from "../services/tmdb.api";
import "./MovieCard.scss";

const PLACEHOLDER = "https://via.placeholder.com/300x450/1a1a1a/555?text=No+Poster";

export default function MovieCard({ movie, mediaType = "movie", isInWatchlist, toggleWatchlist }) {
  const dispatch = useDispatch();
  const { isFavorite } = useFavorites();

  const title       = movie.title        || movie.name           || "Unknown";
  const releaseDate = movie.release_date  || movie.first_air_date || "";
  const year        = releaseDate ? releaseDate.slice(0, 4) : "N/A";
  const rating      = movie.vote_average  || 0;
  const poster      = movie.poster_path   ? getImageUrl(movie.poster_path) : PLACEHOLDER;
  const type        = movie.media_type    || mediaType;
  const linkTo      = `/${type === "tv" ? "tv" : "movie"}/${movie.id}`;

  function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const movieData = {
      tmdbId:      String(movie.id),
      mediaType:   type === "tv" ? "tv" : "movie",
      title,
      posterPath:  movie.poster_path  || "",
      releaseDate: releaseDate        || "",
      overview:    movie.overview     || "",
      rating,
    };
    if (isFavorite(movie.id)) {
      dispatch(removeFavorite(String(movie.id)));
    } else {
      dispatch(addFavorite(movieData));
    }
  }

  function handleWatchlistClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!toggleWatchlist) return;
    const movieData = {
      tmdbId:      String(movie.id),
      mediaType:   type === "tv" ? "tv" : "movie",
      title,
      posterPath:  movie.poster_path  || "",
      releaseDate: releaseDate        || "",
      overview:    movie.overview     || "",
      rating,
    };
    toggleWatchlist(movieData);
  }

  const favorited   = isFavorite(movie.id);
  const inWatchlist = isInWatchlist ? isInWatchlist(movie.id) : false;

  return (
    <Link to={linkTo} className="movie-card">

      <div className="movie-card__poster">
        <img
          src={poster}
          alt={title}
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        {rating > 0 && (
          <div className="movie-card__rating">⭐ {rating.toFixed(1)}</div>
        )}
        <div className="movie-card__actions">
          <button
            className={`movie-card__action-btn ${favorited ? "active-fav" : ""}`}
            onClick={handleFavoriteClick}
            title={favorited ? "Remove from Favorites" : "Add to Favorites"}
          >
            {favorited ? "❤️" : "🤍"}
          </button>
          <button
            className={`movie-card__action-btn ${inWatchlist ? "active-wl" : ""}`}
            onClick={handleWatchlistClick}
            title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            {inWatchlist ? "🔖" : "🕐"}
          </button>
        </div>
      </div>

      <div className="movie-card__info">
        <p className="movie-card__title">{title}</p>
        <div className="movie-card__meta">
          <span>{year}</span>
          <span>•</span>
          <span>{type === "tv" ? "TV" : "Movie"}</span>
        </div>
      </div>

    </Link>
  );
}