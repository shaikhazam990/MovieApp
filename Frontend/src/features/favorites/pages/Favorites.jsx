import { Link } from "react-router-dom";
import Navbar from "../../movies/components/Navbar";
import { useFavorites } from "../hooks/useFavorites";
import { getImageUrl }  from "../../movies/services/tmdb.api";
import "./Favorites.scss";

const PLACEHOLDER = "https://via.placeholder.com/300x450/1a1a1a/555?text=No+Poster";

export default function Favorites() {
  const { favorites, loading, handleRemoveFavorite } = useFavorites();

  return (
    <div className="favorites">
      <Navbar />

      <div className="favorites__inner">

        <div className="favorites__header">
          <h1>❤️ My Favorites</h1>
          <p className="favorites__count">
            {favorites.length > 0 ? `${favorites.length} saved` : ""}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="favorites__loading">
            <span className="spinner" />
          </div>
        )}

        {/* Empty state */}
        {!loading && favorites.length === 0 && (
          <div className="favorites__empty">
            <span>🎬</span>
            <p>No favorites yet!</p>
            <Link to="/" className="favorites__browse-btn">Browse Movies</Link>
          </div>
        )}

        {/* Grid */}
        {favorites.length > 0 && (
          <div className="fav-grid">
            {favorites.map((item) => (
              <div key={item.tmdbId} className="fav-card">

                {/* Poster */}
                <Link to={`/${item.mediaType}/${item.tmdbId}`}>
                  <div className="fav-card__poster">
                    <img
                      src={item.posterPath ? getImageUrl(item.posterPath) : PLACEHOLDER}
                      alt={item.title || "Movie"}
                      onError={(e) => { e.target.src = PLACEHOLDER; }}
                      loading="lazy"
                    />
                    <div className="fav-card__overlay">
                      <span>▶ View</span>
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <div className="fav-card__info">
                  <p className="fav-card__title">{item.title || "Unknown"}</p>
                  <div className="fav-card__meta">
                    <span>{item.releaseDate ? item.releaseDate.slice(0, 4) : "N/A"}</span>
                    <span>•</span>
                    <span>{item.mediaType?.toUpperCase()}</span>
                    {item.rating > 0 && (
                      <>
                        <span>•</span>
                        <span>⭐ {item.rating.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  className="fav-card__remove"
                  onClick={() => handleRemoveFavorite(item.tmdbId)}
                  title="Remove from favorites"
                >
                  ✕
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}