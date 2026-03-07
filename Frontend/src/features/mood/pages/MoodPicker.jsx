import { useState }   from "react";
import Navbar          from "../../movies/components/Navbar";
import MovieCard       from "../../movies/components/MovieCard";
import axios           from "axios";
import "./MoodPicker.scss";

const TMDB_KEY      = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

const MOODS = [
  { id: "happy",    emoji: "😄", label: "Happy",    desc: "Fun & light-hearted",    genres: [35, 10751], color: "#f5a623" },
  { id: "sad",      emoji: "😢", label: "Sad",      desc: "Emotional & deep",       genres: [18, 10749], color: "#5b8dee" },
  { id: "excited",  emoji: "🔥", label: "Excited",  desc: "Action-packed!",         genres: [28, 12, 878], color: "#e50914" },
  { id: "scared",   emoji: "😱", label: "Scared",   desc: "Thrilling & scary",      genres: [27, 53],    color: "#7c3aed" },
  { id: "romantic", emoji: "💕", label: "Romantic", desc: "Love stories",           genres: [10749, 18], color: "#ec4899" },
  { id: "inspired", emoji: "💪", label: "Inspired", desc: "Motivating true stories",genres: [36, 99],    color: "#10b981" },
  { id: "relaxed",  emoji: "😌", label: "Relaxed",  desc: "Easy & chill",           genres: [16, 10751], color: "#06b6d4" },
  { id: "curious",  emoji: "🤔", label: "Curious",  desc: "Mind-bending mysteries", genres: [9648, 878], color: "#8b5cf6" },
];

export default function MoodPicker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [movies,       setMovies]       = useState([]);
  const [loading,      setLoading]      = useState(false);

  async function handleMoodSelect(mood) {
    setSelectedMood(mood);
    setLoading(true);
    setMovies([]);

    try {
      const res = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key:          TMDB_KEY,
          with_genres:      mood.genres.join(","),
          sort_by:          "popularity.desc",
          "vote_count.gte": 100,
          page:             1,
        },
      });
      setMovies(res.data.results || []);
    } catch (err) {
      console.error("Mood fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mood-page">
      <Navbar />

      <div className="mood-page__inner">

        <div className="mood-page__header">
          <h1>🎭 What's Your Mood?</h1>
          <p>Pick a mood and we'll find the perfect movies for you</p>
        </div>

        {/* Mood cards */}
        {!selectedMood && (
          <div className="mood-grid">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                className="mood-card"
                style={{ "--mood-color": mood.color }}
                onClick={() => handleMoodSelect(mood)}
              >
                <span className="mood-card__emoji">{mood.emoji}</span>
                <span className="mood-card__label">{mood.label}</span>
                <span className="mood-card__desc">{mood.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {selectedMood && (
          <div className="mood-results">

            <div className="mood-results__header">
              <div className="mood-results__badge" style={{ background: selectedMood.color }}>
                {selectedMood.emoji} {selectedMood.label} Mood
              </div>
              <button className="mood-results__reset" onClick={() => { setSelectedMood(null); setMovies([]); }}>
                ← Change Mood
              </button>
            </div>

            {loading && (
              <div className="mood-results__loading">
                <div className="spinner" />
                <p>Finding movies for your mood...</p>
              </div>
            )}

            {!loading && movies.length > 0 && (
              <>
                <p className="mood-results__count">Found {movies.length} movies 🎬</p>
                <div className="mood-movies-grid">
                  {movies.map((m) => (
                    <MovieCard key={m.id} movie={m} mediaType="movie" />
                  ))}
                </div>
              </>
            )}

            {!loading && movies.length === 0 && (
              <div className="mood-results__empty">
                <p>No movies found. Try another mood!</p>
                <button onClick={() => setSelectedMood(null)}>← Go Back</button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}