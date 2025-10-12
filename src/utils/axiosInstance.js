// 📄 src/utils/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://rental-backend-uqo8.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Always attach token (if it exists)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ❌ No auto logout — user stays signed in until they manually log out
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn("API error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default instance;
