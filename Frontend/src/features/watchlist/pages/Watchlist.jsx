import { Link }         from "react-router-dom";
import Navbar            from "../../movies/components/Navbar";
import { useWatchlist }  from "../hooks/useWatchlist";
import { getImageUrl }   from "../../movies/services/tmdb.api";
import "./Watchlist.scss";

const PLACEHOLDER = "https://via.placeholder.com/300x450/1a1a1a/555?text=No+Poster";

export default function Watchlist() {
  const { watchlist, loading, removeFromWatchlist } = useWatchlist();

  return (
    <div className="watchlist">
      <Navbar />

      <div className="watchlist__inner">

        <div className="watchlist__header">
          <h1>🕐 My Watchlist</h1>
          {watchlist.length > 0 && (
            <span className="watchlist__count">{watchlist.length} movies to watch</span>
          )}
        </div>

        {loading && (
          <div className="watchlist__loading"><span className="spinner" /></div>
        )}

        {!loading && watchlist.length === 0 && (
          <div className="watchlist__empty">
            <span>🎬</span>
            <p>Your watchlist is empty!</p>
            <p className="sub">Save movies to watch later</p>
            <Link to="/" className="browse-btn">Browse Movies</Link>
          </div>
        )}

        {watchlist.length > 0 && (
          <div className="watchlist-grid">
            {watchlist.map((item) => (
              <div key={item.tmdbId} className="wl-card">

                <Link to={`/${item.mediaType}/${item.tmdbId}`}>
                  <div className="wl-card__poster">
                    <img
                      src={item.posterPath ? getImageUrl(item.posterPath) : PLACEHOLDER}
                      alt={item.title}
                      onError={(e) => { e.target.src = PLACEHOLDER; }}
                      loading="lazy"
                    />
                    <div className="wl-card__overlay"><span>▶ View</span></div>
                  </div>
                </Link>

                <div className="wl-card__info">
                  <p className="wl-card__title">{item.title || "Unknown"}</p>
                  <div className="wl-card__meta">
                    <span>{item.releaseDate?.slice(0, 4) || "N/A"}</span>
                    <span>•</span>
                    <span>{item.mediaType?.toUpperCase()}</span>
                    {item.rating > 0 && <><span>•</span><span>⭐ {item.rating.toFixed(1)}</span></>}
                  </div>
                </div>

                <button
                  className="wl-card__remove"
                  onClick={() => removeFromWatchlist(item.tmdbId)}
                  title="Remove"
                >✕</button>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}