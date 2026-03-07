import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  logoutUser,
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
    handleClearError,
    isAdmin: user?.isAdmin || false,
  };
}