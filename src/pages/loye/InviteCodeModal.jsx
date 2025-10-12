import React, { useState } from "react";
import axios from "../../utils/axiosInstance";

export default function InviteCodeModal({ onClose, onSuccess }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "/api/loye/invite",
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = { ...user, loye: { role: res.data.role } };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("loyeRole", res.data.role);

      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.message || "Code invalide ou expiré.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Entrer votre code d’invitation</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            placeholder="Ex: MNG-A5B8C"
            required
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              style={{ ...styles.button, ...styles.cancel }}
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.disabled : styles.primary),
              }}
            >
              {loading ? "Validation..." : "Valider"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: 14,
    width: "90%",
    maxWidth: 420,
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    animation: "fadeIn 0.2s ease-in-out",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: 800,
    textAlign: "center",
    marginBottom: "1rem",
    color: "#0f172a",
  },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  input: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "0.75rem 1rem",
    fontSize: 15,
    outline: "none",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: "0.5rem",
  },
  button: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  primary: {
    background: "linear-gradient(90deg,#f97316,#f59e0b)",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(249,115,22,0.25)",
  },
  cancel: {
    backgroundColor: "#f3f4f6",
    color: "#111827",
  },
  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  error: {
    color: "#dc2626",
    fontWeight: 600,
    textAlign: "center",
    margin: 0,
  },
};
