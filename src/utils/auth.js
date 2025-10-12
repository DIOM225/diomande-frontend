// 📄 src/utils/auth.js

// ✅ Get stored token
export const getToken = () => localStorage.getItem("token") || null;

// ✅ Get stored user safely
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

// ✅ Get Loye role (priority: cached → user.loye.role)
export const getLoyeRole = () => {
  const user = getUser();
  return localStorage.getItem("loyeRole") || user?.loye?.role || null;
};

// ✅ Check if user is authenticated
export const isAuthenticated = () => !!getToken();

// 🔒 Clear all authentication and Loye session data
export const clearAuthStorage = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loyeRole");
  } catch (err) {
    console.warn("⚠️ Failed to clear auth storage:", err);
  }
};

// ⚙️ Reset auth (useful if token expired or invalid)
export const resetSession = () => {
  clearAuthStorage();
  window.location.href = "/auth"; // full reload for clean state
};

// ✅ Utility to save updated auth data safely
export const saveAuthData = (token, user, role) => {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
  if (role) localStorage.setItem("loyeRole", role);
};
