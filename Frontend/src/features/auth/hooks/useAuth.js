import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  logoutUser,
  guestLogin,
  clearError,
} from "../authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  // ── Login ─────────────────────────────────
  async function handleLogin(formData) {
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  }

  // ── Register ──────────────────────────────
  async function handleRegister(formData) {
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      navigate("/");
    }
  }

  // ── Guest Login ───────────────────────────
  async function handleGuestLogin() {
    const result = await dispatch(guestLogin());
    if (guestLogin.fulfilled.match(result)) {
      navigate("/");
    }
  }

  // ── Logout ────────────────────────────────
  async function handleLogout() {
    await dispatch(logoutUser());
    navigate("/login");
  }

  // ── Clear error ───────────────────────────
  function handleClearError() {
    dispatch(clearError());
  }

  return {
    user,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGuestLogin, // ✅ add kiya
    handleClearError,
    isAdmin: user?.isAdmin || false,
    isGuest: user?.isGuest || false, // ✅ guest check ke liye
  };
}