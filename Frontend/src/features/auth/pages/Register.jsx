import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../style/auth.scss";

export default function Register() {
  const { handleRegister, loading, error, handleClearError } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email:    "",
    password: "",
    confirm:  "",
  });
  const [localError, setLocalError] = useState("");

  useEffect(() => { handleClearError(); }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirm) {
      setLocalError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    handleRegister({
      username: formData.username,
      email:    formData.email,
      password: formData.password,
    });
  }

  const displayError = localError || error;

  return (
    <div className="auth-page">

      {/* Left — poster */}
      <div className="auth-poster">
        <div className="auth-poster__overlay" />
        <div className="auth-poster__content">
          <h1>🎬 MovieVerse</h1>
          <p>Join millions of movie lovers. Track, discover, and enjoy cinema like never before.</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="auth-form-side">
        <div className="auth-form-box">

          <h2 className="auth-form-box__title">Create Account</h2>
          <p className="auth-form-box__subtitle">Start your movie journey today</p>

          {displayError && <div className="auth-error">⚠️ {displayError}</div>}

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="cooluser123"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirm"
                placeholder="Re-enter password"
                value={formData.confirm}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="auth-btn__loader" /> : "Create Account"}
            </button>

          </form>

          <p className="auth-form-box__footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

        </div>
      </div>

    </div>
  );
}