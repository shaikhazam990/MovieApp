import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Login nahi hai toh /login pe bhejo
export default function Protected({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}