import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Admin nahi hai toh home pe bhejo
export default function AdminProtected({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (!user)          return <Navigate to="/login"  replace />;
  if (!user.isAdmin)  return <Navigate to="/"       replace />;
  return children;
}