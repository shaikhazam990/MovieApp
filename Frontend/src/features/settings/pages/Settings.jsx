import { useState, useEffect } from "react";
import { useDispatch }         from "react-redux";
import { useNavigate }         from "react-router-dom";
import { logoutUser }          from "../../auth/authSlice";
import Navbar                  from "../../movies/components/Navbar";
import axios                   from "axios";
import "./Settings.scss";

const api = axios.create({
  baseURL:         import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh", label: "Chinese" },
];

const REGIONS = [
  { code: "US", label: "United States" },
  { code: "IN", label: "India" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "JP", label: "Japan" },
  { code: "KR", label: "South Korea" },
];

// ── Tabs ──────────────────────────────────
const TABS = [
  { id: "profile",  label: "👤 Profile",         },
  { id: "password", label: "🔒 Password",        },
  { id: "region",   label: "🌍 Language & Region"},
  { id: "danger",   label: "⚠️ Danger Zone",     },
];

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [profile,   setProfile]   = useState(null);

  // ── Messages ──────────────────────────
  const [success, setSuccess] = useState("");
  const [error,   setError]   = useState("");

  // ── Profile form ──────────────────────
  const [username, setUsername] = useState("");
  const [avatar,   setAvatar]   = useState("");

  // ── Password form ─────────────────────
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // ── Region form ───────────────────────
  const [language, setLanguage] = useState("en");
  const [region,   setRegion]   = useState("US");

  // ── Delete form ───────────────────────
  const [deletePw,      setDeletePw]      = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await api.get("/api/settings/profile");
      const u   = res.data.user;
      setProfile(u);
      setUsername(u.username || "");
      setAvatar(u.avatar     || "");
      setLanguage(u.language || "en");
      setRegion(u.region     || "US");
    } catch (err) {
      setError("Failed to load profile");
    }
  }

  function showSuccess(msg) {
    setSuccess(msg);
    setError("");
    setTimeout(() => setSuccess(""), 3000);
  }

  function showError(msg) {
    setError(msg);
    setSuccess("");
  }

  // ── Update Profile ────────────────────
  async function handleProfileUpdate(e) {
    e.preventDefault();
    try {
      await api.put("/api/settings/profile", { username, avatar });
      showSuccess("Profile updated successfully! ✅");
    } catch (err) {
      showError(err.response?.data?.message || "Update failed");
    }
  }

  // ── Change Password ───────────────────
  async function handlePasswordChange(e) {
    e.preventDefault();
    if (newPw !== confirmPw) return showError("New passwords do not match");
    if (newPw.length < 6)    return showError("Password must be at least 6 characters");

    try {
      await api.put("/api/settings/password", {
        currentPassword: currentPw,
        newPassword:     newPw,
      });
      showSuccess("Password changed successfully! ✅");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err) {
      showError(err.response?.data?.message || "Password change failed");
    }
  }

  // ── Update Region ─────────────────────
  async function handleRegionUpdate(e) {
    e.preventDefault();
    try {
      await api.put("/api/settings/profile", { language, region });
      showSuccess("Language & Region updated! ✅");
    } catch (err) {
      showError("Update failed");
    }
  }

  // ── Delete Account ────────────────────
  async function handleDeleteAccount(e) {
    e.preventDefault();
    if (deleteConfirm !== "DELETE") return showError('Type "DELETE" to confirm');

    try {
      await api.delete("/api/settings/account", { data: { password: deletePw } });
      dispatch(logoutUser());
      navigate("/login");
    } catch (err) {
      showError(err.response?.data?.message || "Delete failed");
    }
  }

  return (
    <div className="settings">
      <Navbar />

      <div className="settings__inner">
        <h1 className="settings__title">⚙️ Settings</h1>

        <div className="settings__layout">

          {/* Sidebar tabs */}
          <aside className="settings__sidebar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`settings__tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => { setActiveTab(tab.id); setSuccess(""); setError(""); }}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="settings__content">

            {/* Success / Error messages */}
            {success && <div className="settings__msg settings__msg--success">✅ {success}</div>}
            {error   && <div className="settings__msg settings__msg--error">⚠️ {error}</div>}

            {/* ── Profile Tab ─────────────────── */}
            {activeTab === "profile" && (
              <div className="settings__panel">
                <h2>👤 Profile</h2>
                <p className="settings__desc">Update your display name and avatar</p>

                {/* Avatar preview */}
                <div className="settings__avatar-preview">
                  {avatar
                    ? <img src={avatar} alt="avatar" onError={(e) => { e.target.style.display = "none"; }} />
                    : <div className="settings__avatar-placeholder">
                        {username?.[0]?.toUpperCase() || "U"}
                      </div>
                  }
                </div>

                <form onSubmit={handleProfileUpdate} className="settings__form">
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Avatar URL</label>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <span className="form-hint">Paste any image URL as your avatar</span>
                  </div>

                  <button type="submit" className="settings__save-btn">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* ── Password Tab ─────────────────── */}
            {activeTab === "password" && (
              <div className="settings__panel">
                <h2>🔒 Change Password</h2>
                <p className="settings__desc">Keep your account secure with a strong password</p>

                <form onSubmit={handlePasswordChange} className="settings__form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                    />
                  </div>

                  <button type="submit" className="settings__save-btn">
                    Change Password
                  </button>
                </form>
              </div>
            )}

            {/* ── Language & Region Tab ─────────── */}
            {activeTab === "region" && (
              <div className="settings__panel">
                <h2>🌍 Language & Region</h2>
                <p className="settings__desc">Set your preferred language and region for content</p>

                <form onSubmit={handleRegionUpdate} className="settings__form">
                  <div className="form-group">
                    <label>Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>{l.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Region</label>
                    <select value={region} onChange={(e) => setRegion(e.target.value)}>
                      {REGIONS.map((r) => (
                        <option key={r.code} value={r.code}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="settings__save-btn">
                    Save Preferences
                  </button>
                </form>
              </div>
            )}

            {/* ── Danger Zone Tab ──────────────── */}
            {activeTab === "danger" && (
              <div className="settings__panel settings__panel--danger">
                <h2>⚠️ Danger Zone</h2>
                <p className="settings__desc">These actions are permanent and cannot be undone</p>

                <div className="danger-card">
                  <div className="danger-card__info">
                    <h3>Delete Account</h3>
                    <p>Permanently delete your account and all associated data including favorites, watchlist, and history.</p>
                  </div>

                  <form onSubmit={handleDeleteAccount} className="settings__form">
                    <div className="form-group">
                      <label>Enter your password</label>
                      <input
                        type="password"
                        value={deletePw}
                        onChange={(e) => setDeletePw(e.target.value)}
                        placeholder="Your current password"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Type <strong>DELETE</strong> to confirm</label>
                      <input
                        type="text"
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        placeholder="DELETE"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="settings__delete-btn"
                      disabled={deleteConfirm !== "DELETE"}
                    >
                      🗑️ Delete My Account
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}