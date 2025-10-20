// ✅ src/components/RequireAdmin.jsx
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // 🔒 Check authentication
    if (!user || !token) {
      return <Navigate to="/auth" replace />;
    }

    // 🔒 Ensure admin role
    if (user.role !== "admin") {
      return <Navigate to="/not-authorized" replace />;
    }

    return children;
  } catch (err) {
    console.error("❌ Error verifying admin:", err);
    return <Navigate to="/auth" replace />;
  }
}
