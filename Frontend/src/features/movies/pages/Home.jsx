import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar         from "../components/Navbar";
import MovieCard      from "../components/MovieCard";
import TrailerModal   from "../components/TrailerModal";
import InfiniteScroll from "../components/InfiniteScroll";
import { useMovies }  from "../hooks/useMovies";
import { getImageUrl, getMovieVideos } from "../services/tmdb.api";
import "./Home.scss";

const PLACEHOLDER = "https://via.placeholder.com/1280x720/1a1a1a/555?text=No+Image";

// Skeleton card — data load hone tak dikhao
function SkeletonCard() {
  return (
    <div className="movie-card-skeleton">
      <div className="poster-sk skeleton" />
      <div className="title-sk skeleton" />
      <div className="year-sk skeleton" />
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const {
    trending, popular, popularTV,
    nowPlaying, upcoming, topRated,
    loading, loadMoreMovies, loadMoreTV,
  } = useMovies();

  const [trailerKey,   setTrailerKey]   = useState(null);
  const [showTrailer,  setShowTrailer]  = useState(false);
  const [popularPage,  setPopularPage]  = useState(1);
  const [tvPage,       setTvPage]       = useState(1);

  // Debug — console mein dekho kya aa raha hai
  useEffect(() => {
    console.log("trending:", trending);
    console.log("loading:", loading);
    console.log("TMDB KEY:", import.meta.env.VITE_TMDB_API_KEY);
  }, [trending, loading]);

  // Hero — trending ka pehla item
  const hero = trending[0] || null;

  // Trailer fetch karo
  async function handleWatchTrailer(movieId) {
    try {
      const res     = await getMovieVideos(movieId);
      const videos  = res.data.results || [];
      const trailer = videos.find((v) => v.type === "Trailer" && v.site === "YouTube");
      setTrailerKey(trailer ? trailer.key : null);
    } catch {
      setTrailerKey(null);
    }
    setShowTrailer(true);
  }

  function handleLoadMoreMovies() {
    const next = popularPage + 1;
    setPopularPage(next);
    loadMoreMovies(popularPage);
  }

  function handleLoadMoreTV() {
    const next = tvPage + 1;
    setTvPage(next);
    loadMoreTV(tvPage);
  }

  return (
    <div className="home">
      <Navbar />

      {/* ── Hero Banner ─────────────────────── */}
      {hero ? (
        <div
          className="hero"
          style={{
            backgroundImage: `url(${getImageUrl(hero.backdrop_path, "original") || PLACEHOLDER})`,
          }}
        >
          <div className="hero__overlay" />
          <div className="hero__content">
            <h1 className="hero__title">{hero.title || hero.name}</h1>
            <p className="hero__overview">
              {hero.overview
                ? hero.overview.slice(0, 180) + "..."
                : "Description not available"}
            </p>
            <div className="hero__actions">
              <button
                className="hero__btn hero__btn--primary"
                onClick={() => handleWatchTrailer(hero.id)}
              >
                ▶ Watch Trailer
              </button>
              <button
                className="hero__btn hero__btn--secondary"
                onClick={() =>
                  navigate(`/${hero.media_type === "tv" ? "tv" : "movie"}/${hero.id}`)
                }
              >
                ℹ More Info
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Hero loading skeleton
        <div className="hero hero--skeleton">
          <div className="skeleton" style={{ width: "100%", height: "100%" }} />
        </div>
      )}

      {/* ── Sections ────────────────────────── */}
      <div className="home__sections">

        {/* Trending */}
        <section className="movie-section">
          <h2 className="section-title">🔥 Trending Today</h2>
          <div className="movies-grid">
            {loading && trending.length === 0
              ? Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : trending.slice(0, 10).map((m) => (
                  <MovieCard key={m.id} movie={m} mediaType={m.media_type || "movie"} />
                ))
            }
          </div>
        </section>

        {/* Now Playing */}
        <section className="movie-section">
          <h2 className="section-title">🎭 Now Playing</h2>
          <div className="movies-grid">
            {loading && nowPlaying.length === 0
              ? Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : nowPlaying.slice(0, 10).map((m) => (
                  <MovieCard key={m.id} movie={m} mediaType="movie" />
                ))
            }
          </div>
        </section>

        {/* Top Rated */}
        <section className="movie-section">
          <h2 className="section-title">⭐ Top Rated</h2>
          <div className="movies-grid">
            {loading && topRated.length === 0
              ? Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : topRated.slice(0, 10).map((m) => (
                  <MovieCard key={m.id} movie={m} mediaType="movie" />
                ))
            }
          </div>
        </section>

        {/* Upcoming */}
        <section className="movie-section">
          <h2 className="section-title">📅 Upcoming</h2>
          <div className="movies-grid">
            {loading && upcoming.length === 0
              ? Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : upcoming.slice(0, 10).map((m) => (
                  <MovieCard key={m.id} movie={m} mediaType="movie" />
                ))
            }
          </div>
        </section>

        {/* Popular Movies — Infinite Scroll */}
        <section className="movie-section">
          <h2 className="section-title">🎬 Popular Movies</h2>
          <InfiniteScroll
            onLoadMore={handleLoadMoreMovies}
            hasMore={true}
            loading={loading}
          >
            <div className="movies-grid">
              {popular.map((m) => (
                <MovieCard key={m.id} movie={m} mediaType="movie" />
              ))}
            </div>
          </InfiniteScroll>
        </section>

        {/* Popular TV — Infinite Scroll */}
        <section className="movie-section">
          <h2 className="section-title">📺 Popular TV Shows</h2>
          <InfiniteScroll
            onLoadMore={handleLoadMoreTV}
            hasMore={true}
            loading={loading}
          >
            <div className="movies-grid">
              {popularTV.map((m) => (
                <MovieCard key={m.id} movie={m} mediaType="tv" />
              ))}
            </div>
          </InfiniteScroll>
        </section>

      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <TrailerModal
          trailerKey={trailerKey}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}