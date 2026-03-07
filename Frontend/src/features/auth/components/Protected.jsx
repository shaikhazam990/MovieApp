import { useSelector } from "react-redux";
import { Navigate }    from "react-router-dom";

export default function Protected({ children }) {
  const { user, initializing } = useSelector((state) => state.auth);

  // getMe complete hone tak wait karo — loader dikhao
  if (initializing) {
    return (
      <div style={{
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        height:          "100vh",
        background:      "#0d0d0d",
        color:           "#888",
        fontSize:        "1.2rem",
        flexDirection:   "column",
        gap:             "16px",
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

  // initializing complete — user nahi hai toh login pe bhejo
  if (!user) return <Navigate to="/login" replace />;

  return children;
}