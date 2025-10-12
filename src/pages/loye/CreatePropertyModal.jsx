import React, { useState } from "react";
import axios from "../../utils/axiosInstance";

export default function CreatePropertyModal({ onClose }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [unitsByType, setUnitsByType] = useState({
    studio: { count: 0, rent: 0 },
    "1chambre": { count: 0, rent: 0 },
    "2chambres": { count: 0, rent: 0 },
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateUnit = (type, field, value) => {
    setUnitsByType((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: parseInt(value) || 0,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    setSubmitting(true);
    setMessage("");

    try {
      const res = await axios.post("/api/loye/properties", {
        name,
        address,
        unitsByType,
      });
      setMessage(res.data?.message || "Propriété créée avec succès !");
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1200);
    } catch (err) {
      setMessage("Erreur lors de la création. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Créer une propriété</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du bâtiment"
            required
            style={styles.input}
          />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Adresse"
            required
            style={styles.input}
          />

          <h4 style={styles.subtitle}>Unités</h4>

          {Object.entries(unitsByType).map(([type, info]) => (
            <div key={type} style={styles.unitRow}>
              <label style={styles.unitLabel}>{type.toUpperCase()}</label>
              <input
                type="number"
                value={info.count}
                onChange={(e) => updateUnit(type, "count", e.target.value)}
                placeholder="Nb"
                min="0"
                style={{ ...styles.input, width: 70 }}
              />
              <input
                type="number"
                value={info.rent}
                onChange={(e) => updateUnit(type, "rent", e.target.value)}
                placeholder="Loyer"
                min="0"
                style={{ ...styles.input, width: 100 }}
              />
            </div>
          ))}

          <div style={styles.actions}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.button,
                ...(submitting ? styles.disabled : styles.primary),
              }}
            >
              {submitting ? "Création…" : "Créer"}
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{ ...styles.button, ...styles.cancel }}
            >
              Annuler
            </button>
          </div>

          {message && <p style={styles.message}>{message}</p>}
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
    backgroundColor: "rgba(0,0,0,0.5)",
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
    maxWidth: 460,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    animation: "fadeIn 0.2s ease-in-out",
  },
  title: {
    fontSize: "1.4rem",
    fontWeight: 800,
    marginBottom: "1rem",
    textAlign: "center",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: "1rem",
    marginTop: "1rem",
    fontWeight: 700,
    color: "#334155",
  },
  form: { display: "flex", flexDirection: "column", gap: "0.7rem" },
  input: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
    transition: "border 0.2s",
  },
  unitRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  unitLabel: {
    width: 80,
    fontSize: 13,
    fontWeight: 700,
    color: "#475569",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: "1rem",
  },
  button: {
    padding: "10px 16px",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    transition: "opacity 0.2s",
  },
  primary: {
    background: "linear-gradient(90deg,#f97316,#f59e0b)",
    color: "#fff",
    boxShadow: "0 4px 10px rgba(249,115,22,0.3)",
  },
  cancel: {
    backgroundColor: "#f3f4f6",
    color: "#111",
  },
  disabled: { opacity: 0.6, cursor: "not-allowed" },
  message: {
    marginTop: "0.75rem",
    fontWeight: 600,
    textAlign: "center",
    color: "#0f172a",
  },
};
