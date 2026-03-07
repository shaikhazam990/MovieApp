import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar          from "../../movies/components/Navbar";
import { getImageUrl } from "../../movies/services/tmdb.api";
import axios           from "axios";
import "./MovieRoulette.scss";

const TMDB_KEY      = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

// Wheel segments
const WHEEL_SEGMENTS = [
  { label: "Action",    genre: 28,    color: "#e50914", emoji: "💥" },
  { label: "Comedy",    genre: 35,    color: "#f5a623", emoji: "😂" },
  { label: "Horror",    genre: 27,    color: "#7c3aed", emoji: "😱" },
  { label: "Romance",   genre: 10749, color: "#ec4899", emoji: "💕" },
  { label: "Sci-Fi",    genre: 878,   color: "#06b6d4", emoji: "🚀" },
  { label: "Drama",     genre: 18,    color: "#5b8dee", emoji: "🎭" },
  { label: "Thriller",  genre: 53,    color: "#10b981", emoji: "🔪" },
  { label: "Animation", genre: 16,    color: "#f59e0b", emoji: "✨" },
];

const TOTAL = WHEEL_SEGMENTS.length;
const ARC   = (2 * Math.PI) / TOTAL;

export default function MovieRoulette() {
  const navigate  = useNavigate();
  const canvasRef = useRef(null);

  const [spinning,      setSpinning]      = useState(false);
  const [rotation,      setRotation]      = useState(0);
  const [result,        setResult]        = useState(null); // chosen segment
  const [movie,         setMovie]         = useState(null);
  const [loadingMovie,  setLoadingMovie]  = useState(false);
  const [spinCount,     setSpinCount]     = useState(0);

  const currentRotation = useRef(0);
  const animFrameRef    = useRef(null);

  // Draw wheel on canvas
  useEffect(() => {
    drawWheel(currentRotation.current);
  }, [spinCount]);

  function drawWheel(rot) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const cx  = canvas.width  / 2;
    const cy  = canvas.height / 2;
    const r   = cx - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    WHEEL_SEGMENTS.forEach((seg, i) => {
      const start = rot + i * ARC;
      const end   = start + ARC;

      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      // Border
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth   = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + ARC / 2);
      ctx.textAlign    = "right";
      ctx.fillStyle    = "#fff";
      ctx.font         = "bold 13px Inter, sans-serif";
      ctx.shadowColor  = "rgba(0,0,0,0.5)";
      ctx.shadowBlur   = 4;
      ctx.fillText(`${seg.emoji} ${seg.label}`, r - 12, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    ctx.fillStyle   = "#0d0d0d";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth   = 3;
    ctx.stroke();

    // Center text
    ctx.fillStyle  = "#fff";
    ctx.font       = "bold 16px Inter";
    ctx.textAlign  = "center";
    ctx.fillText("🎬", cx, cy + 6);
  }

  function spin() {
    if (spinning) return;

    setSpinning(true);
    setResult(null);
    setMovie(null);

    // Random full spins + extra rotation
    const extraSpins  = 5 + Math.floor(Math.random() * 5); // 5-10 full spins
    const stopAngle   = Math.random() * 2 * Math.PI;
    const totalAngle  = extraSpins * 2 * Math.PI + stopAngle;

    const duration    = 4000; // 4 seconds
    const startTime   = performance.now();
    const startRot    = currentRotation.current;

    function animate(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const rot   = startRot + totalAngle * eased;

      currentRotation.current = rot;
      drawWheel(rot);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Find winner
        const normalizedRot = ((rot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        // Pointer is at top (270deg = 3π/2), find which segment it points to
        const pointerAngle  = (2 * Math.PI - normalizedRot + (3 * Math.PI) / 2) % (2 * Math.PI);
        const winnerIndex   = Math.floor(pointerAngle / ARC) % TOTAL;
        const winner        = WHEEL_SEGMENTS[winnerIndex];

        setResult(winner);
        setSpinning(false);
        setSpinCount((c) => c + 1);
        fetchRandomMovie(winner.genre);
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }

  async function fetchRandomMovie(genreId) {
    setLoadingMovie(true);
    try {
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const res = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key:          TMDB_KEY,
          with_genres:      genreId,
          sort_by:          "popularity.desc",
          "vote_count.gte": 50,
          page:             randomPage,
        },
      });

      const movies = res.data.results || [];
      if (movies.length > 0) {
        const random = movies[Math.floor(Math.random() * movies.length)];
        setMovie(random);
      }
    } catch (err) {
      console.error("Movie fetch failed:", err);
    } finally {
      setLoadingMovie(false);
    }
  }

  const PLACEHOLDER = "https://via.placeholder.com/300x450/1a1a1a/555?text=No+Poster";

  return (
    <div className="roulette-page">
      <Navbar />

      <div className="roulette-page__inner">

        {/* Header */}
        <div className="roulette-page__header">
          <h1>🎰 Movie Roulette</h1>
          <p>Can't decide what to watch? Let the wheel decide!</p>
        </div>

        <div className="roulette-layout">

          {/* Wheel side */}
          <div className="roulette-wheel-side">

            {/* Pointer */}
            <div className="roulette-pointer">▼</div>

            {/* Canvas wheel */}
            <canvas
              ref={canvasRef}
              width={380}
              height={380}
              className="roulette-canvas"
            />

            {/* Spin button */}
            <button
              className={`roulette-spin-btn ${spinning ? "spinning" : ""}`}
              onClick={spin}
              disabled={spinning}
            >
              {spinning ? "🌀 Spinning..." : "🎰 Spin the Wheel!"}
            </button>

          </div>

          {/* Result side */}
          <div className="roulette-result-side">

            {!result && !spinning && (
              <div className="roulette-placeholder">
                <span>🎬</span>
                <p>Spin the wheel to get your movie pick!</p>
                <p className="sub">Perfect for movie nights with friends</p>
              </div>
            )}

            {spinning && (
              <div className="roulette-placeholder">
                <span className="roulette-spinner-emoji">🌀</span>
                <p>Finding your perfect movie...</p>
              </div>
            )}

            {result && !spinning && (
              <div className="roulette-result">

                {/* Genre result */}
                <div
                  className="roulette-result__genre"
                  style={{ background: result.color }}
                >
                  {result.emoji} {result.label} Night!
                </div>

                {/* Movie card */}
                {loadingMovie && (
                  <div className="roulette-result__loading">
                    <div className="spinner" />
                    <p>Picking a movie...</p>
                  </div>
                )}

                {!loadingMovie && movie && (
                  <div className="roulette-movie-card">
                    <img
                      src={movie.poster_path ? getImageUrl(movie.poster_path, "w342") : PLACEHOLDER}
                      alt={movie.title}
                      onError={(e) => { e.target.src = PLACEHOLDER; }}
                    />
                    <div className="roulette-movie-card__info">
                      <h2>{movie.title}</h2>
                      <div className="roulette-movie-card__meta">
                        <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                        <span>•</span>
                        <span>{movie.release_date?.slice(0, 4)}</span>
                      </div>
                      <p className="roulette-movie-card__overview">
                        {movie.overview
                          ? movie.overview.slice(0, 150) + "..."
                          : "Description not available"}
                      </p>
                      <div className="roulette-movie-card__actions">
                        <button
                          className="roulette-watch-btn"
                          onClick={() => navigate(`/movie/${movie.id}`)}
                        >
                          ▶ Watch Now
                        </button>
                        <button
                          className="roulette-again-btn"
                          onClick={spin}
                        >
                          🎰 Spin Again
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}