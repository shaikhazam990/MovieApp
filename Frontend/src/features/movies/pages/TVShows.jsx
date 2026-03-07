import { useState } from "react";
import Navbar        from "../components/Navbar";
import MovieCard     from "../components/MovieCard";
import InfiniteScroll from "../components/InfiniteScroll";
import { useMovies } from "../hooks/useMovies";
import "./TVShows.scss";

export default function TVShows() {
  const { popularTV, loading, loadMoreTV } = useMovies();
  const [page, setPage] = useState(1);

  function handleLoadMore() {
    const next = page + 1;
    setPage(next);
    loadMoreTV(page);
  }

  return (
    <div className="tvshows">
      <Navbar />

      <div className="tvshows__inner">
        <h1 className="tvshows__heading">📺 TV Shows</h1>

        <InfiniteScroll
          onLoadMore={handleLoadMore}
          hasMore={true}
          loading={loading}
        >
          <div className="movies-grid">
            {loading && popularTV.length === 0
              ? Array(12).fill(0).map((_, i) => (
                  <div key={i} className="movie-card-skeleton">
                    <div className="poster-sk skeleton" />
                    <div className="title-sk skeleton" />
                    <div className="year-sk  skeleton" />
                  </div>
                ))
              : popularTV.map((show) => (
                  <MovieCard key={show.id} movie={show} mediaType="tv" />
                ))
            }
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}