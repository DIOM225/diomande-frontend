import { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FaLock, FaPhone, FaEnvelope } from "react-icons/fa";

function ResetPassword() {
  const [identifier, setIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        { identifier, newPassword }
      );
      setMessage(res.data.message || "Mot de passe réinitialisé avec succès !");
      setTimeout(() => navigate("/auth"), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Une erreur est survenue. Veuillez réessayer.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>
          <FaLock color="#ff6a00" size={26} />
        </div>

        <h2 style={styles.title}>Réinitialiser le mot de passe</h2>
        <p style={styles.subtitle}>
          Entrez votre téléphone ou email pour changer votre mot de passe
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <FaPhone style={styles.icon} />
            <input
              type="text"
              placeholder="Téléphone ou Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type="password"
              placeholder="Confirmez le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}
          {message && <p style={styles.success}>{message}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "En cours..." : "Réinitialiser"}
          </button>

          <p style={styles.backLink} onClick={() => navigate("/auth")}>
            ⬅ Retour à la connexion
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
  },
  card: {
    background: "#fff",
    padding: "2.5rem 2rem",
    borderRadius: "16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  iconCircle: {
    width: "64px",
    height: "64px",
    backgroundColor: "#fff4eb",
    borderRadius: "50%",
    margin: "0 auto 1.2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "0.3rem",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "0.95rem",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: "10px",
    padding: "0.6rem 1rem",
  },
  icon: {
    marginRight: "0.6rem",
    color: "#9ca3af",
    fontSize: "1rem",
  },
  input: {
    border: "none",
    background: "transparent",
    outline: "none",
    width: "100%",
    fontSize: "1rem",
    color: "#111827",
  },
  button: {
    backgroundColor: "#ff6a00",
    color: "#fff",
    padding: "0.9rem",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "0.5rem",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
  },
  success: {
    color: "green",
    fontSize: "0.9rem",
  },
  backLink: {
    marginTop: "1rem",
    color: "#6b7280",
    fontSize: "0.9rem",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default ResetPassword;
