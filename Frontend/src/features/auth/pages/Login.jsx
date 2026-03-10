import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../style/auth.scss";

export default function Login() {
  const { handleLogin, handleGuestLogin, loading, error, handleClearError } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => { handleClearError(); }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleLogin(formData);
  }

  return (
    <div className="auth-page">

      {/* Left — cinematic poster */}
      <div className="auth-poster">
        <div className="auth-poster__overlay" />
        <div className="auth-poster__content">
          <h1>🎬 MovieVerse</h1>
          <p>Discover movies, track your watchlist, and explore the world of cinema.</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="auth-form-side">
        <div className="auth-form-box">

          <h2 className="auth-form-box__title">Welcome Back</h2>
          <p className="auth-form-box__subtitle">Sign in to your account</p>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="auth-btn__loader" /> : "Sign In"}
            </button>

          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Guest Login Button */}
          <button
            className="auth-btn auth-btn--guest"
            onClick={handleGuestLogin}
            disabled={loading}
          >
            {loading ? <span className="auth-btn__loader" /> : "🎬 Continue as Guest"}
          </button>

          <p className="auth-form-box__footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>

        </div>
      </div>

    </div>
  );
}