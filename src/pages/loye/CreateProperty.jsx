import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";

// ---------- Sub-component for each unit type ----------
function UnitCard({ label, typeKey, units, onUnitChange, styles }) {
  const idPrefix = typeKey.replace(/[^a-z0-9]/gi, "");
  const isDigits = (val) => val === "" || /^\d+$/.test(val);

  return (
    <div style={styles.unitCard}>
      <div style={styles.unitHeader}>
        <span style={styles.unitDot} />
        <h4 style={styles.unitTitle}>{label}</h4>
      </div>

      <div style={styles.unitGrid}>
        <div style={styles.field}>
          <label htmlFor={`${idPrefix}-count`} style={styles.label}>
            Nombre d’unités
          </label>
          <input
            id={`${idPrefix}-count`}
            type="text"
            value={units[typeKey].count}
            autoComplete="off"
            onChange={(e) => {
              const v = e.target.value;
              if (isDigits(v)) onUnitChange(typeKey, "count", v);
            }}
            style={styles.input}
            placeholder="0"
          />
        </div>

        <div style={styles.field}>
          <label htmlFor={`${idPrefix}-rent`} style={styles.label}>
            Loyer par unité (FCFA)
          </label>
          <div style={styles.inputPrefixWrap}>
            <span style={styles.prefix}>₣</span>
            <input
              id={`${idPrefix}-rent`}
              type="text"
              value={units[typeKey].rent}
              autoComplete="off"
              onChange={(e) => {
                const v = e.target.value;
                if (isDigits(v)) onUnitChange(typeKey, "rent", v);
              }}
              style={{ ...styles.input, ...styles.inputWithPrefix }}
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateProperty() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [units, setUnits] = useState({
    studio: { count: "", rent: "" },
    "1chambre": { count: "", rent: "" },
    "2chambres": { count: "", rent: "" },
    "3chambres": { count: "", rent: "" },
    "4chambres": { count: "", rent: "" },
    duplex: { count: "", rent: "" },
  });
  const [message, setMessage] = useState("");
  const [inviteCodes, setInviteCodes] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleUnitChange = (type, field, value) => {
    setUnits((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const hasAtLeastOneValidUnit = Object.values(units).some(
    ({ count, rent }) => Number(count) > 0 && Number(rent) > 0
  );

  const canSubmit =
    name.trim() && address.trim() && hasAtLeastOneValidUnit && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setMessage("");
    setError("");
    setInviteCodes(null);
    setSubmitting(true);

    try {
      const payload = { name: name.trim(), address: address.trim(), unitsByType: {} };

      for (const type of Object.keys(units)) {
        const count = parseInt(units[type].count || "0", 10);
        const rent = parseInt(units[type].rent || "0", 10);
        if (count > 0 && rent > 0) payload.unitsByType[type] = { count, rent };
      }

      const res = await axios.post("/api/loye/properties", payload);
      setMessage(res.data?.message || "Propriété créée avec succès !");
      if (res.data?.inviteCodes) setInviteCodes(res.data.inviteCodes);

      setTimeout(() => navigate("/loye/properties"), 1600);
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de la création.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Page title */}
        <div style={styles.pageHeader}>
          <h1 style={styles.title}>Créer une Propriété</h1>
          <p style={styles.subtitle}>
            Ajoutez une nouvelle propriété et définissez ses unités locatives.
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.headerIcon}>🏡</div>
            <h2 style={styles.cardTitle}>Informations de la propriété</h2>
          </div>

          <div style={styles.gridAutoFit}>
            <div style={styles.field}>
              <label htmlFor="prop-name" style={styles.label}>
                Nom de la propriété <span style={styles.req}>*</span>
              </label>
              <div style={styles.inputPrefixWrap}>
                <span style={styles.prefix}>🏠</span>
                <input
                  id="prop-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ ...styles.input, ...styles.inputWithPrefix }}
                  placeholder="Ex: Résidence Abidjan"
                  autoComplete="off"
                />
              </div>
            </div>

            <div style={styles.field}>
              <label htmlFor="prop-address" style={styles.label}>
                Adresse <span style={styles.req}>*</span>
              </label>
              <div style={styles.inputPrefixWrap}>
                <span style={styles.prefix}>📍</span>
                <input
                  id="prop-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ ...styles.input, ...styles.inputWithPrefix }}
                  placeholder="Ex: Cocody, Abidjan"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <div style={styles.sectionDivider} />

          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Types d’unités</h3>
            <p style={styles.sectionHint}>
              Indiquez au moins un type avec un nombre et un loyer.
            </p>
          </div>

          {[
            ["Studio", "studio"],
            ["1 chambre", "1chambre"],
            ["2 chambres", "2chambres"],
            ["3 chambres", "3chambres"],
            ["4+ chambres", "4chambres"],
            ["Duplex", "duplex"],
          ].map(([label, key]) => (
            <UnitCard
              key={key}
              label={label}
              typeKey={key}
              units={units}
              onUnitChange={handleUnitChange}
              styles={styles}
            />
          ))}

          {/* Footer */}
          <div style={styles.formFooter}>
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                ...(canSubmit ? {} : styles.submitBtnDisabled),
              }}
              disabled={!canSubmit}
            >
              {submitting ? "Création…" : "Créer"}
            </button>

            {message && <p style={styles.success}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}

            {inviteCodes && (
              <div style={styles.inviteBox}>
                {inviteCodes.ownerInviteCode && (
                  <p>
                    <strong>Code propriétaire :</strong>{" "}
                    {inviteCodes.ownerInviteCode}
                  </p>
                )}
                {inviteCodes.managerInviteCode && (
                  <p>
                    <strong>Code gestionnaire :</strong>{" "}
                    {inviteCodes.managerInviteCode}
                  </p>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- Styles ----------
const styles = {
  page: {
    background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
    minHeight: "100vh",
    padding: "2rem 1rem",
  },
  container: { maxWidth: 980, margin: "0 auto" },
  pageHeader: { textAlign: "center", marginBottom: "1.25rem" },
  title: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 800,
    background: "linear-gradient(90deg,#f97316,#f59e0b)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  subtitle: { color: "#64748b", marginTop: 6 },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: "1.25rem",
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    padding: "0.9rem 1rem",
    marginBottom: "1rem",
    background: "linear-gradient(90deg,#fff7ed,#fffbeb)",
  },
  headerIcon: {
    width: 28,
    height: 28,
    display: "grid",
    placeItems: "center",
    borderRadius: 8,
    background: "#ffedd5",
  },
  cardTitle: { margin: 0, fontWeight: 800, fontSize: "1.05rem", color: "#0f172a" },

  gridAutoFit: {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  },

  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 700, color: "#334155" },
  req: { color: "#ef4444" },

  input: {
    width: "100%",
    height: 44,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#fff",
    padding: "0 12px",
    fontSize: 15,
    outline: "none",
  },
  inputPrefixWrap: { position: "relative" },
  prefix: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    opacity: 0.6,
  },
  inputWithPrefix: { paddingLeft: 36 },

  sectionDivider: { height: 1, background: "#f1f5f9", margin: "1.25rem 0" },
  sectionHeader: { textAlign: "center", marginBottom: "0.75rem" },
  sectionTitle: { fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" },
  sectionHint: { color: "#64748b", fontSize: 14 },

  unitCard: {
    border: "1px solid #f1f5f9",
    background: "#fff",
    borderRadius: 12,
    padding: "1rem",
    marginTop: "0.8rem",
  },
  unitHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  unitDot: { width: 14, height: 14, borderRadius: 4, background: "#f97316" },
  unitTitle: { margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" },

  unitGrid: {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  },

  formFooter: { marginTop: "1.25rem", display: "grid", gap: 10 },
  submitBtn: {
    height: 48,
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    fontWeight: 800,
    color: "#fff",
    cursor: "pointer",
    background: "linear-gradient(90deg,#f97316,#f59e0b)",
    boxShadow: "0 8px 18px rgba(249,115,22,0.25)",
  },
  submitBtnDisabled: { opacity: 0.6, cursor: "not-allowed" },

  success: { color: "#16a34a", fontWeight: 700 },
  error: { color: "#dc2626", fontWeight: 700 },

  inviteBox: {
    marginTop: "0.5rem",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    color: "#78350f",
    borderRadius: 10,
    padding: "0.8rem",
  },
};
