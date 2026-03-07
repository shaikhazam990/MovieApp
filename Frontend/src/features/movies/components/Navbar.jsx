import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import "./Navbar.scss";

export default function Navbar() {
  const { user, handleLogout, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
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
              <Link to="/history"   className={isActive("/history")}>History</Link>
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
          {user ? (
            <div className="navbar__user">
              <span className="navbar__username">👤 {user.username}</span>
              <button className="navbar__logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/login"    className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-solid">Sign Up</Link>
            </div>
          )}

          {/* Mobile hamburger */}
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
              <Link to="/history">History</Link>
            </>
          )}
          {isAdmin && <Link to="/admin">Admin Panel</Link>}
          {user
            ? <button onClick={handleLogout}>Logout</button>
            : <Link to="/login">Login</Link>
          }
        </div>
      )}
    </nav>
  );
}