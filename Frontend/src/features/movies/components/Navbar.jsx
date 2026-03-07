import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth }  from "../../auth/hooks/useAuth";
import { useTheme } from "../../../shared/hooks/useTheme";
import "./Navbar.scss";

export default function Navbar() {
  const { user, handleLogout, isAdmin } = useAuth();
  const { isDark, toggleTheme }         = useTheme();
  const location   = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(path) {
    return location.pathname === path ? "active" : "";
  }

  return (
    <nav className="navbar">
      <div className="navbar__inner">

        {/* Logo */}
        <Link to="/" className="navbar__logo">
          🎬 <span>MovieVerse</span>
        </Link>

        {/* Desktop links */}
        <div className="navbar__links">
          <Link to="/"         className={isActive("/")}>Home</Link>
          <Link to="/tv-shows" className={isActive("/tv-shows")}>TV Shows</Link>
          <Link to="/search"   className={isActive("/search")}>Search</Link>
          {user && (
            <>
              <Link to="/favorites" className={isActive("/favorites")}>Favorites</Link>
              <Link to="/watchlist" className={isActive("/watchlist")}>Watchlist</Link>
              <Link to="/history"   className={isActive("/history")}>History</Link>
              <Link to="/mood"      className={isActive("/mood")}>🎭 Mood</Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className={`${isActive("/admin")} admin-link`}>
              Admin
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="navbar__right">

          {/* Theme toggle */}
          <button
            className="navbar__theme-btn"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {user ? (
            <div className="navbar__user">
              {/* <span className="navbar__username">👤 {user.username}</span> */}
              <button className="navbar__logout-btn" onClick={handleLogout}>
                Logout
              </button>
              <Link to="/settings">⚙️ Settings</Link>
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/login"    className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-solid">Sign Up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile" onClick={() => setMenuOpen(false)}>
          <Link to="/">Home</Link>
          <Link to="/tv-shows">TV Shows</Link>
          <Link to="/search">Search</Link>
          {user && (
            <>
              <Link to="/favorites">Favorites</Link>
              <Link to="/watchlist">Watchlist</Link>
              <Link to="/history">History</Link>
              <Link to="/mood">🎭 Mood</Link>
            </>
          )}
          {isAdmin && <Link to="/admin">Admin Panel</Link>}

          <div className="navbar__mobile-theme" onClick={(e) => e.stopPropagation()}>
            <span>{isDark ? "Dark Mode" : "Light Mode"}</span>
            <button onClick={toggleTheme}>{isDark ? "☀️ Light" : "🌙 Dark"}</button>
          </div>

          {user
            ? <button className="mobile-logout" onClick={handleLogout}>Logout</button>
            : <Link to="/login">Login</Link>
          }
        </div>
      )}
    </nav>
  );
}