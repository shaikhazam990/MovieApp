import { useState, useEffect } from "react";
import { getMovieGenres } from "../services/tmdb.api";
import "./GenreFilter.scss";

export default function GenreFilter({ onSelect, selected }) {
  const [genres,  setGenres]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovieGenres()
      .then((res) => setGenres(res.data.genres || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <div className="genre-filter">
      <button
        className={`genre-filter__btn ${!selected ? "active" : ""}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          className={`genre-filter__btn ${selected === g.id ? "active" : ""}`}
          onClick={() => onSelect(g.id)}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}