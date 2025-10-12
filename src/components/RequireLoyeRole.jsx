// src/components/RequireLoyeRole.jsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "../utils/axiosInstance";

function getUserSafe() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

export default function RequireLoyeRole({ role, children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    let mounted = true;

    const loadRole = async () => {
      // 1️⃣ Try localStorage first
      const cached = localStorage.getItem("loyeRole");
      if (cached) {
        if (mounted) {
          setUserRole(cached);
          setLoading(false);
        }
        return;
      }

      // 2️⃣ Try user object
      const user = getUserSafe();
      const localRole = user?.loye?.role;
      if (localRole) {
        localStorage.setItem("loyeRole", localRole);
        if (mounted) {
          setUserRole(localRole);
          setLoading(false);
        }
        return;
      }

      // 3️⃣ Fallback: backend check
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/loye/auth/check-role", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const apiRole = res.data?.role || null;
        if (apiRole) localStorage.setItem("loyeRole", apiRole);
        if (mounted) setUserRole(apiRole);
      } catch {
        if (mounted) setUserRole(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadRole();
    return () => {
      mounted = false;
    };
  }, [token]);

  if (loading)
    return <div style={{ padding: "2rem", textAlign: "center" }}>Chargement…</div>;

  // ❌ No role found → redirect to onboarding
  if (!userRole)
    return <Navigate to="/loye/onboarding" state={{ from: location }} replace />;

  // ✅ Normalize required roles
  const requiredRoles = Array.isArray(role) ? role : [role];

  // ❌ Wrong role → redirect accordingly
  if (!requiredRoles.includes(userRole)) {
    if (userRole === "renter") {
      return <Navigate to="/loye/dashboard" replace />;
    }
    if (userRole === "owner" || userRole === "manager") {
      return <Navigate to="/loye/properties" replace />;
    }
    // 🚫 Anything else → show Not Authorized page
    return <Navigate to="/not-authorized" replace />;
  }

  // ✅ Access granted
  return children;
}
