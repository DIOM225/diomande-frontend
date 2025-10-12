// ✅ Diomande.com — RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function RequireAuth({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed._id) {
          setUser(parsed);
        }
      }
    } catch (err) {
      console.error("Error parsing stored user:", err);
      localStorage.removeItem("user"); // 🧹 corrupted data cleanup
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Chargement...
      </div>
    );
  }

  if (!user) {
    // 🚪 Not logged in → redirect to /auth
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // ✅ Logged in → render the protected content
  return children;
}

export default RequireAuth;
