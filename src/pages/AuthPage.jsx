import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import {
  FaLock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function AuthPage() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const redirect = searchParams.get("redirect") || "/";
      navigate(redirect);
    }
  }, [navigate, searchParams]);

  const validateForm = () => {
    const newErrors = {};
    if (mode === "signup") {
      if (!formData.name.trim()) newErrors.name = "Le nom est requis.";
      if (!formData.phone.trim())
        newErrors.phone = "Le téléphone est requis.";
      else if (!/^\d{8}$|^\d{10}$/.test(formData.phone))
        newErrors.phone = "Le téléphone doit contenir 8 ou 10 chiffres.";
      if (!formData.password)
        newErrors.password = "Le mot de passe est requis.";
      else if (formData.password.length < 6)
        newErrors.password =
          "Le mot de passe doit contenir au moins 6 caractères.";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    } else {
      if (!formData.phone && !formData.email)
        newErrors.identifier = "Téléphone ou email requis.";
      if (!formData.password)
        newErrors.password = "Le mot de passe est requis.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";

      const payload =
        mode === "login"
          ? {
              identifier: formData.email || formData.phone,
              password: formData.password,
            }
          : {
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              password: formData.password,
            };

      const res = await axios.post(endpoint, payload);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const redirect = searchParams.get("redirect") || "/";
      navigate(redirect);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Une erreur est survenue. Veuillez réessayer.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setMode(mode === "login" ? "signup" : "login");
    setErrors({});
    setFormData({
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>
          <FaLock size={36} color="#ff6a00" />
        </div>

        <h2 style={styles.title}>
          {mode === "login" ? "Connexion" : "Inscription"}
        </h2>
        <p style={styles.subtitle}>
          {mode === "login"
            ? "Accédez à votre espace personnel"
            : "Créez votre compte en quelques secondes"}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === "signup" && (
            <>
              <div style={styles.inputGroup}>
                <FaUser style={styles.icon} />
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Nom complet"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              {errors.name && <p style={styles.error}>{errors.name}</p>}

              <div style={styles.inputGroup}>
                <FaPhone style={styles.icon} />
                <input
                  style={styles.input}
                  type="tel"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              {errors.phone && <p style={styles.error}>{errors.phone}</p>}

              <div style={styles.inputGroup}>
                <FaEnvelope style={styles.icon} />
                <input
                  style={styles.input}
                  type="email"
                  placeholder="Email (optionnel)"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {mode === "login" && (
            <div style={styles.inputGroup}>
              <FaPhone style={styles.icon} />
              <input
                style={styles.input}
                type="text"
                placeholder="Téléphone ou Email"
                value={formData.phone || formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              style={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {errors.password && <p style={styles.error}>{errors.password}</p>}

          {mode === "signup" && (
            <>
              <div style={styles.inputGroup}>
                <FaLock style={styles.icon} />
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Confirmez le mot de passe"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              {errors.confirmPassword && (
                <p style={styles.error}>{errors.confirmPassword}</p>
              )}
            </>
          )}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading
              ? "Chargement..."
              : mode === "login"
              ? "Se connecter"
              : "S’inscrire"}
          </button>

          <p style={styles.switchText}>
            {mode === "login" ? "Pas de compte ?" : "Déjà un compte ?"}{" "}
            <span onClick={handleModeSwitch} style={styles.switchLink}>
              {mode === "login" ? "Inscription" : "Connexion"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: "1rem",
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
    padding: "2.5rem 2rem",
    textAlign: "center",
    boxSizing: "border-box",
  },
  iconWrap: {
    background: "#fff4eb",
    width: 70,
    height: 70,
    borderRadius: "50%",
    margin: "0 auto 1.3rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: "1.7rem",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "0.4rem",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "0.95rem",
    marginBottom: "1.8rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "0.85rem 2.8rem 0.85rem 2.8rem",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    outline: "none",
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: "0.9rem",
    transform: "translateY(-50%)",
    color: "#9ca3af",
    fontSize: "1rem",
  },
  eyeIcon: {
    position: "absolute",
    top: "50%",
    right: "0.9rem",
    transform: "translateY(-50%)",
    color: "#9ca3af",
    cursor: "pointer",
    fontSize: "1rem",
  },
  button: {
    background: "#ff6a00",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "0.9rem",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  error: {
    color: "red",
    fontSize: "0.83rem",
    textAlign: "left",
    margin: "-0.3rem 0 0.3rem 0.2rem",
  },
  switchText: {
    marginTop: "1.5rem",
    fontSize: "0.9rem",
    color: "#374151",
  },
  switchLink: {
    color: "#ff6a00",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default AuthPage;
