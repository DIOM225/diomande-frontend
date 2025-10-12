import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import {
  FaBuilding,
  FaMoneyBillWave,
  FaHome,
  FaChartLine,
  FaEye,
} from "react-icons/fa";

export default function OwnerProperties() {
  const [properties, setProperties] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const formatNumberCI = (value) => {
    const n = Number(value) || 0;
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const fetchProperties = useCallback(async () => {
    try {
      const res = await axios.get("/api/loye/properties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(
        "/api/loye/onboarding",
        { code: inviteCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccess("Code accepté ! Redirection...");
      setTimeout(() => {
        const role = res.data.user.role;
        navigate(role === "renter" ? "/loye/dashboard" : "/loye/properties");
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || "Code invalide.";
      setError(msg);
    }
  };

  const { totalConfirmed, totalExpected } = properties.reduce(
    (acc, p) => {
      acc.totalConfirmed += p.revenue?.confirmed || 0;
      acc.totalExpected += p.revenue?.expected || 0;
      return acc;
    },
    { totalConfirmed: 0, totalExpected: 0 }
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Mes Propriétés</h1>
          <p style={styles.subtitle}>
            Gérez vos biens locatifs et suivez vos revenus
          </p>
        </div>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={styles.primaryBtn}
          >
            + Ajouter une propriété
          </button>

          {dropdownOpen && (
            <div style={styles.dropdown}>
              <button
                style={styles.dropdownItem}
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/loye/create");
                }}
              >
                Créer une propriété
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => setShowCodeInput(!showCodeInput)}
              >
                Entrer un code d'invitation
              </button>

              {showCodeInput && (
                <form onSubmit={handleInviteSubmit} style={styles.codeBox}>
                  <input
                    type="text"
                    placeholder="Code d'invitation"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                    style={styles.codeInput}
                  />
                  <button type="submit" style={styles.codeSubmit}>
                    Valider
                  </button>
                  {error && <p style={styles.error}>{error}</p>}
                  {success && <p style={styles.success}>{success}</p>}
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div style={styles.metricsGrid}>
        <MetricCard
          label="Propriétés totales"
          value={properties.length}
          icon={<FaBuilding size={30} color="#f97316" />}
        />
        <MetricCard
          label="Revenu mensuel"
          value={`${formatNumberCI(totalConfirmed)} FCFA`}
          sub={`/ ${formatNumberCI(totalExpected)} FCFA`}
          icon={<FaMoneyBillWave size={30} color="#10b981" />}
        />
        <MetricCard
          label="Unités totales"
          value={properties.reduce((sum, p) => sum + (p.units?.length || 0), 0)}
          icon={<FaHome size={30} color="#f59e0b" />}
        />
        <MetricCard
          label="Taux d’occupation"
          value="0%"
          icon={<FaChartLine size={30} color="#fb923c" />}
        />
      </div>

      {/* Property Cards */}
      <div style={styles.propertyGrid}>
        {properties.length === 0 ? (
          <div style={styles.emptyCard}>
            <h3 style={styles.emptyTitle}>Aucune propriété trouvée</h3>
            <p>Commencez par ajouter votre première propriété.</p>
            <button
              onClick={() => navigate("/loye/create")}
              style={styles.primaryBtn}
            >
              + Ajouter une propriété
            </button>
          </div>
        ) : (
          properties.map((property) => {
            const confirmed = property.revenue?.confirmed || 0;
            const expected = property.revenue?.expected || 0;
            return (
              <div key={property._id} style={styles.propertyCard}>
                <div style={styles.propertyTop}>
                  <h4 style={styles.propertyName}>{property.name}</h4>
                  <span style={styles.badge}>Actif</span>
                </div>
                <p style={styles.address}>{property.address}</p>

                <div style={styles.infoRow}>
                  <span>
                    Unités :{" "}
                    <strong>{property.units?.length || 0}</strong>
                  </span>
                  <span>Occupation : <strong>0%</strong></span>
                </div>

                <div style={styles.infoRow}>
                  <span>
                    Revenu :{" "}
                    <strong>
                      {formatNumberCI(confirmed)} / {formatNumberCI(expected)} FCFA
                    </strong>
                  </span>
                  <span>
                    Créé par : <strong>{property.createdByRole}</strong>
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/loye/property/${property._id}`)}
                  style={styles.viewBtn}
                >
                  <FaEye /> Voir détails
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* 🧩 Reusable metric card component */
function MetricCard({ label, value, sub, icon }) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricHeader}>
        <div>
          <p style={styles.metricLabel}>{label}</p>
          <h3 style={styles.metricValue}>{value}</h3>
          {sub && <p style={styles.metricSub}>{sub}</p>}
        </div>
        {icon}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f8fafc",
    minHeight: "100vh",
    padding: "2rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "2rem",
    gap: "1rem",
  },
  title: { fontSize: "2rem", fontWeight: 800, margin: 0 },
  subtitle: { color: "#64748b", fontSize: "1rem" },
  primaryBtn: {
    background: "linear-gradient(90deg,#f97316,#f59e0b)",
    color: "#fff",
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(249,115,22,0.25)",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "110%",
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    padding: "0.5rem",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    width: 230,
    gap: "0.5rem",
  },
  dropdownItem: {
    background: "#f9fafb",
    border: "none",
    borderRadius: 6,
    padding: "0.6rem 1rem",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: 500,
    fontSize: 14,
  },
  codeBox: {
    marginTop: "0.5rem",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "0.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  codeInput: {
    padding: "0.5rem",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  codeSubmit: {
    background: "linear-gradient(90deg,#f97316,#f59e0b)",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "0.5rem",
    cursor: "pointer",
    fontWeight: 600,
  },
  error: { color: "#dc2626", fontSize: 13 },
  success: { color: "#16a34a", fontSize: 13 },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  metricCard: {
    background: "#fff",
    borderRadius: 12,
    padding: "1.5rem",
    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
  },
  metricHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricLabel: { color: "#475569", fontWeight: 600, fontSize: 14 },
  metricValue: { fontSize: "1.7rem", fontWeight: 800, color: "#0f172a" },
  metricSub: { color: "#64748b", fontSize: 13 },
  propertyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
    gap: "1.5rem",
  },
  propertyCard: {
    background: "#fff",
    borderRadius: 12,
    padding: "1.5rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  propertyTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  badge: {
    background: "#dcfce7",
    color: "#15803d",
    borderRadius: "999px",
    padding: "0.25rem 0.6rem",
    fontSize: 12,
    fontWeight: 600,
  },
  propertyName: { margin: 0, fontWeight: 700, color: "#0f172a" },
  address: { color: "#475569", fontSize: 14, marginBottom: "0.5rem" },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    marginTop: "0.4rem",
  },
  viewBtn: {
    marginTop: "1rem",
    width: "100%",
    border: "1px solid #e5e7eb",
    background: "#fff",
    borderRadius: 8,
    padding: "0.6rem",
    cursor: "pointer",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  emptyCard: {
    background: "#f1f5f9",
    borderRadius: 10,
    padding: "2rem",
    textAlign: "center",
  },
  emptyTitle: { fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" },
};
