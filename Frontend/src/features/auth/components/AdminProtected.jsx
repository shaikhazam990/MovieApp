import { useSelector } from "react-redux";
import { Navigate }    from "react-router-dom";

export default function AdminProtected({ children }) {
  const { user, initializing } = useSelector((state) => state.auth);

  // getMe complete hone tak wait karo
  if (initializing) {
    return (
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        height:         "100vh",
        background:     "#0d0d0d",
        color:          "#888",
        flexDirection:  "column",
        gap:            "16px",
      }}>
        <div style={{
          width:        "40px",
          height:       "40px",
          border:       "3px solid #333",
          borderTop:    "3px solid #e50914",
          borderRadius: "50%",
          animation:    "spin 0.7s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user)         return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/"      replace />;

  return children;
}