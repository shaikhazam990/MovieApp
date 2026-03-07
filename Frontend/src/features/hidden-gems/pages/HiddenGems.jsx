import { useState } from "react";
import Navbar      from "../../movies/components/Navbar";
import MovieCard   from "../../movies/components/MovieCard";
import axios       from "axios";
import "./HiddenGems.scss";

const TMDB_KEY      = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

const GENRES = [
  { id: "",    label: "All Genres" },
  { id: 28,   label: "Action" },
  { id: 35,   label: "Comedy" },
  { id: 18,   label: "Drama" },
  { id: 27,   label: "Horror" },
  { id: 878,  label: "Sci-Fi" },
  { id: 10749,label: "Romance" },
  { id: 9648, label: "Mystery" },
  { id: 12,   label: "Adventure" },
  { id: 99,   label: "Documentary" },
  { id: 16,   label: "Animation" },
];

const DECADES = [
  { label: "Any Year",   min: "",     max: ""     },
  { label: "2020s",      min: "2020", max: "2029" },
  { label: "2010s",      min: "2010", max: "2019" },
  { label: "2000s",      min: "2000", max: "2009" },
  { label: "90s",        min: "1990", max: "1999" },
  { label: "80s",        min: "1980", max: "1989" },
];

export default function HiddenGems() {
  const [gems,       setGems]       = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [searched,   setSearched]   = useState(false);
  const [genre,      setGenre]      = useState("");
  const [decade,     setDecade]     = useState(DECADES[0]);
  const [minRating,  setMinRating]  = useState(7.5);
  const [maxPop,     setMaxPop]     = useState(20); // popularity threshold

  async function findGems() {
    setLoading(true);
    setSearched(true);
    setGems([]);

    try {
      const params = {
        api_key:              TMDB_KEY,
        sort_by:              "vote_average.desc",
        "vote_count.gte":     100,         // enough votes to be reliable
        "vote_average.gte":   minRating,
        "popularity.lte":     maxPop,      // low popularity = hidden gem
        page:                 Math.floor(Math.random() * 5) + 1, // random page
        ...(genre && { with_genres: genre }),
        ...(decade.min && { "primary_release_date.gte": `${decade.min}-01-01` }),
        ...(decade.max && { "primary_release_date.lte": `${decade.max}-12-31` }),
      };

      const res = await axios.get(`${TMDB_BASE_URL}/discover/movie`, { params });
      setGems(res.data.results || []);
    } catch (err) {
      console.error("Hidden gems fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gems-page">
      <Navbar />

      <div className="gems-page__inner">

        {/* Header */}
        <div className="gems-page__header">
          <div className="gems-page__icon">💎</div>
          <h1>Hidden Gem Finder</h1>
          <p>Discover amazing movies that most people have never heard of</p>
        </div>

        {/* Filters */}
        <div className="gems-filters">

          <div className="gems-filters__group">
            <label>Genre</label>
            <div className="gems-filters__pills">
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  className={`pill ${genre === g.id ? "active" : ""}`}
                  onClick={() => setGenre(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="gems-filters__row">
            <div className="gems-filters__group">
              <label>Decade</label>
              <div className="gems-filters__pills">
                {DECADES.map((d) => (
                  <button
                    key={d.label}
                    className={`pill ${decade.label === d.label ? "active" : ""}`}
                    onClick={() => setDecade(d)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="gems-filters__group">
              <label>Min Rating: ⭐ {minRating}</label>
              <input
                type="range"
                min="6"
                max="9"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="gems-slider"
              />
              <div className="gems-slider__labels">
                <span>6.0</span><span>9.0</span>
              </div>
            </div>
          </div>

          {/* Find button */}
          <button
            className="gems-btn"
            onClick={findGems}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-sm" /> Searching...</>
            ) : (
              <>💎 Find Hidden Gems</>
            )}
          </button>
        </div>

        {/* Results */}
        {loading && (
          <div className="gems-loading">
            <div className="gems-loading__diamonds">
              {["💎","💎","💎"].map((d, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.2}s` }}>{d}</span>
              ))}
            </div>
            <p>Mining for hidden gems...</p>
          </div>
        )}

        {!loading && searched && gems.length === 0 && (
          <div className="gems-empty">
            <span>🔍</span>
            <p>No gems found with these filters</p>
            <p className="sub">Try relaxing the filters</p>
          </div>
        )}

        {!loading && gems.length > 0 && (
          <div className="gems-results">
            <p className="gems-results__count">
              💎 Found <strong>{gems.length}</strong> hidden gems!
            </p>
            <div className="gems-grid">
              {gems.map((m) => (
                <MovieCard key={m.id} movie={m} mediaType="movie" />
              ))}
            </div>
          </div>
        )}

        {/* Landing state */}
        {!searched && !loading && (
          <div className="gems-landing">
            <div className="gems-landing__cards">
              {["💎", "🎬", "⭐", "🔍", "🎭"].map((e, i) => (
                <div key={i} className="gems-landing__card" style={{ animationDelay: `${i * 0.15}s` }}>
                  <span>{e}</span>
                </div>
              ))}
            </div>
            <p>Set your filters and discover movies you never knew existed!</p>
          </div>
        )}

      </div>
    </div>
  );
}