import Navbar    from "../components/Navbar";
import MovieCard  from "../components/MovieCard";
import { useSearch } from "../hooks/useSearch";
import "./SearchPage.scss";

export default function SearchPage() {
  const { query, setQuery, results, loading, error, hasMore, loadMore } = useSearch();

  return (
    <div className="search-page">
      <Navbar />

      <div className="search-page__inner">

        <h1 className="search-page__heading">🔍 Search</h1>

        {/* Search Input */}
        <div className="search-page__bar">
          <input
            type="text"
            placeholder="Search movies, TV shows, actors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")}>✕</button>
          )}
        </div>

        {/* Error */}
        {error && <p className="search-page__error">⚠️ {error}</p>}

        {/* Empty state */}
        {!query && !loading && (
          <div className="search-page__empty">
            <span>🎬</span>
            <p>Start typing to search movies, TV shows & people</p>
          </div>
        )}

        {/* No results */}
        {query && !loading && results.length === 0 && (
          <div className="search-page__empty">
            <span>😕</span>
            <p>No results found for "{query}"</p>
          </div>
        )}

        {/* Results grid */}
        {results.length > 0 && (
          <>
            <p className="search-page__count">
              Showing results for <strong>"{query}"</strong>
            </p>
            <div className="movies-grid">
              {results
                .filter((r) => r.media_type !== "person") // people filter out
                .map((item) => (
                  <MovieCard
                    key={item.id}
                    movie={item}
                    mediaType={item.media_type || "movie"}
                  />
                ))
              }
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="search-page__loadmore">
                <button onClick={loadMore} disabled={loading}>
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Loading spinner */}
        {loading && results.length === 0 && (
          <div className="search-page__spinner">
            <span className="spinner" />
          </div>
        )}

      </div>
    </div>
  );
}