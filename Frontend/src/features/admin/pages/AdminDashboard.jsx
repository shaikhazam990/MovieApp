import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../movies/components/Navbar";
import "./AdminDashboard.scss";

const api = axios.create({
  baseURL:         import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

const EMPTY_FORM = {
  title:       "",
  posterUrl:   "",
  description: "",
  tmdbId:      "",
  releaseDate: "",
  trailerUrl:  "",
  genre:       "",
  category:    "movie",
};

export default function AdminDashboard() {
  const [activeTab,  setActiveTab]  = useState("movies"); // "movies" | "users"
  const [movies,     setMovies]     = useState([]);
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [formData,   setFormData]   = useState(EMPTY_FORM);
  const [editId,     setEditId]     = useState(null);   // null = add mode
  const [message,    setMessage]    = useState("");

  useEffect(() => {
    if (activeTab === "movies") fetchMovies();
    if (activeTab === "users")  fetchUsers();
  }, [activeTab]);

  // ── Fetch ─────────────────────────────────
  async function fetchMovies() {
    setLoading(true);
    try {
      const res = await api.get("/api/movies");
      setMovies(res.data.movies || []);
    } catch { setMessage("Failed to fetch movies"); }
    finally  { setLoading(false); }
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data.users || []);
    } catch { setMessage("Failed to fetch users"); }
    finally  { setLoading(false); }
  }

  // ── Form handlers ──────────────────────────
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        genre: formData.genre.split(",").map((g) => g.trim()).filter(Boolean),
      };

      if (editId) {
        await api.put(`/api/movies/${editId}`, payload);
        setMessage("Movie updated ✅");
      } else {
        await api.post("/api/movies", payload);
        setMessage("Movie added ✅");
      }

      setFormData(EMPTY_FORM);
      setEditId(null);
      fetchMovies();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save");
    } finally { setLoading(false); }
  }

  function handleEdit(movie) {
    setEditId(movie._id);
    setFormData({
      title:       movie.title       || "",
      posterUrl:   movie.posterUrl   || "",
      description: movie.description || "",
      tmdbId:      movie.tmdbId      || "",
      releaseDate: movie.releaseDate || "",
      trailerUrl:  movie.trailerUrl  || "",
      genre:       (movie.genre || []).join(", "),
      category:    movie.category    || "movie",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this movie?")) return;
    try {
      await api.delete(`/api/movies/${id}`);
      setMovies((prev) => prev.filter((m) => m._id !== id));
      setMessage("Movie deleted ✅");
    } catch { setMessage("Failed to delete"); }
  }

  async function handleBanUser(id, isBanned) {
    try {
      await api.put(`/api/admin/users/${id}/${isBanned ? "unban" : "ban"}`);
      setMessage(isBanned ? "User unbanned ✅" : "User banned ✅");
      fetchUsers();
    } catch { setMessage("Failed to update user"); }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setMessage("User deleted ✅");
    } catch { setMessage("Failed to delete user"); }
  }

  return (
    <div className="admin">
      <Navbar />

      <div className="admin__inner">
        <h1 className="admin__heading">⚙️ Admin Dashboard</h1>

        {/* Tabs */}
        <div className="admin__tabs">
          <button
            className={activeTab === "movies" ? "active" : ""}
            onClick={() => setActiveTab("movies")}
          >
            🎬 Movies
          </button>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            👥 Users
          </button>
        </div>

        {message && (
          <div className="admin__message" onClick={() => setMessage("")}>
            {message} <span>(click to dismiss)</span>
          </div>
        )}

        {/* ── Movies Tab ─── */}
        {activeTab === "movies" && (
          <div className="admin__movies">

            {/* Add / Edit Form */}
            <div className="admin__form-card">
              <h2>{editId ? "✏️ Edit Movie" : "➕ Add Movie"}</h2>

              <form onSubmit={handleSubmit} className="admin__form">
                {[
                  ["title",       "Title *",          "text",   true],
                  ["posterUrl",   "Poster Image URL",  "text",   false],
                  ["description", "Description",       "text",   false],
                  ["tmdbId",      "TMDB ID",           "text",   false],
                  ["releaseDate", "Release Date",      "text",   false],
                  ["trailerUrl",  "YouTube Trailer Link", "text", false],
                  ["genre",       "Genres (comma separated)", "text", false],
                ].map(([name, label, type, required]) => (
                  <div key={name} className="admin__field">
                    <label>{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      required={required}
                    />
                  </div>
                ))}

                <div className="admin__field">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="movie">Movie</option>
                    <option value="tv">TV Show</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="admin__form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Saving..." : editId ? "Update Movie" : "Add Movie"}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => { setEditId(null); setFormData(EMPTY_FORM); }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Movies List */}
            <div className="admin__list">
              <h2>All Admin Movies ({movies.length})</h2>
              {loading ? (
                <div className="admin__loading"><span className="spinner" /></div>
              ) : movies.length === 0 ? (
                <p className="admin__empty">No movies added yet</p>
              ) : (
                <div className="admin__table">
                  {movies.map((movie) => (
                    <div key={movie._id} className="admin__row">
                      <div className="admin__row-info">
                        <strong>{movie.title}</strong>
                        <span>{movie.category} • {movie.releaseDate || "N/A"}</span>
                      </div>
                      <div className="admin__row-actions">
                        <button className="edit-btn"   onClick={() => handleEdit(movie)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(movie._id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Users Tab ─── */}
        {activeTab === "users" && (
          <div className="admin__users">
            <h2>All Users ({users.length})</h2>
            {loading ? (
              <div className="admin__loading"><span className="spinner" /></div>
            ) : (
              <div className="admin__table">
                {users.map((user) => (
                  <div key={user._id} className={`admin__row ${user.isBanned ? "banned" : ""}`}>
                    <div className="admin__row-info">
                      <strong>{user.username}</strong>
                      <span>{user.email}</span>
                      <span>
                        {user.isAdmin  && <span className="badge admin-badge">Admin</span>}
                        {user.isBanned && <span className="badge banned-badge">Banned</span>}
                      </span>
                    </div>
                    {!user.isAdmin && (
                      <div className="admin__row-actions">
                        <button
                          className={user.isBanned ? "edit-btn" : "warn-btn"}
                          onClick={() => handleBanUser(user._id, user.isBanned)}
                        >
                          {user.isBanned ? "Unban" : "Ban"}
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}