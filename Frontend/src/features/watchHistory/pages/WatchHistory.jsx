import { Link } from "react-router-dom";
import Navbar from "../../movies/components/Navbar";
import { useWatchHistory } from "../hooks/useWatchHistory";
import { getImageUrl }     from "../../movies/services/tmdb.api";
import "./WatchHistory.scss";

const PLACEHOLDER = "https://via.placeholder.com/300x450/1a1a1a/555?text=No+Poster";

export default function WatchHistory() {
  const { history, loading, clearHistory } = useWatchHistory();

  return (
    <div className="history-page">
      <Navbar />

      <div className="history-page__inner">

        <div className="history-page__header">
          <h1>🕐 Watch History</h1>
          {history.length > 0 && (
            <button
              className="history-page__clear"
              onClick={clearHistory}
            >
              Clear All
            </button>
          )}
        </div>

        {loading && (
          <div className="history-page__loading">
            <span className="spinner" />
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="history-page__empty">
            <span>🎬</span>
            <p>No watch history yet!</p>
            <Link to="/" className="history-page__link">Browse Movies</Link>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-list">
            {history.map((item) => (
              <Link
                key={item.tmdbId}
                to={`/${item.mediaType}/${item.tmdbId}`}
                className="history-item"
              >
                <img
                  src={item.posterPath ? getImageUrl(item.posterPath, "w92") : PLACEHOLDER}
                  alt={item.title}
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
                <div className="history-item__info">
                  <h3>{item.title || "Unknown"}</h3>
                  <p className="history-item__meta">
                    <span>{item.releaseDate ? item.releaseDate.slice(0, 4) : "N/A"}</span>
                    <span>•</span>
                    <span>{item.mediaType?.toUpperCase()}</span>
                    <span>•</span>
                    <span>⭐ {item.rating ? item.rating.toFixed(1) : "N/A"}</span>
                  </p>
                  <p className="history-item__overview">
                    {item.overview
                      ? item.overview.slice(0, 120) + "..."
                      : "Description not available"}
                  </p>
                </div>
                <div className="history-item__count">
                  <span>{item.watchCount}x</span>
                  <p>watched</p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}