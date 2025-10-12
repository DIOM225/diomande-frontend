import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { FaHome, FaBuilding, FaUsers } from "react-icons/fa";

export default function LoyeOnboarding() {
  const [step, setStep] = useState(null);
  const [role, setRole] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Auto-detect user status or redirect
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    const localRole = localUser?.loye?.role || localStorage.getItem("loyeRole");

    if (localRole === "renter") {
      navigate("/loye/dashboard");
      return;
    } else if (localRole === "owner" || localRole === "manager") {
      navigate("/loye/properties");
      return;
    }

    const checkUserRole = async () => {
      try {
        const res = await axios.get(`/api/loye/auth/check-role`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { role } = res.data;
        if (role) {
          localStorage.setItem("loyeRole", role);
          const user = JSON.parse(localStorage.getItem("user"));
          localStorage.setItem(
            "user",
            JSON.stringify({ ...user, loye: { role, onboarded: true } })
          );

          if (role === "renter") navigate("/loye/dashboard");
          else navigate("/loye/properties");
        } else setStep(1);
      } catch {
        setStep(1);
      }
    };

    if (token) checkUserRole();
    else navigate("/auth");
  }, [navigate, token]);

  // ✅ Handle invite code
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `/api/loye/invite`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const onboardedRole = res.data.role;
      localStorage.setItem("loyeRole", onboardedRole);
      const user = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, loye: { role: onboardedRole, onboarded: true } })
      );

      navigate(onboardedRole === "renter" ? "/loye/dashboard" : "/loye/properties");
    } catch (err) {
      setError(err.response?.data?.message || "Code invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Skip invite flow (owner/manager only)
  const handleSkip = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `/api/loye/auth/register-role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("loyeRole", role);
      navigate("/loye/properties");
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // 🧭 Step 1: Choose role
  if (step === 1) {
    const roles = [
      {
        id: "renter",
        title: "Locataire",
        desc: "Je souhaite me connecter à mon propriétaire et payer mon loyer en ligne.",
        icon: <FaHome size={32} color="#f97316" />,
      },
      {
        id: "owner",
        title: "Propriétaire",
        desc: "Je possède des biens et souhaite encaisser les loyers en ligne.",
        icon: <FaBuilding size={32} color="#f59e0b" />,
      },
      {
        id: "manager",
        title: "Gestionnaire",
        desc: "Je gère des biens pour plusieurs propriétaires et locataires.",
        icon: <FaUsers size={32} color="#fb923c" />,
      },
    ];

    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Bienvenue sur Loye</h1>
        <p style={styles.subtitle}>Choisissez votre rôle pour commencer</p>

        <div style={styles.roleGrid}>
          {roles.map((r) => (
            <div key={r.id} style={styles.card}>
              <div style={styles.iconBox}>{r.icon}</div>
              <h3 style={styles.cardTitle}>{r.title}</h3>
              <p style={styles.cardDesc}>{r.desc}</p>
              <button
                style={styles.btnPrimary}
                onClick={() => {
                  setRole(r.id);
                  setStep(r.id === "renter" ? 2 : 3);
                }}
              >
                Choisir ce rôle
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🧭 Step 2: Renter — enter invite code
  if (step === 2) {
    return (
      <div style={styles.page}>
        <h2 style={styles.stepTitle}>Accès à Loye</h2>
        <p>Entrez votre code d’accès :</p>
        <form onSubmit={handleInviteSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Ex: REN-123ABC"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.btnPrimary}>
            {loading ? "Vérification..." : "Valider"}
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    );
  }

  // 🧭 Step 3: Owner/Manager — choose with or without invite
  if (step === 3) {
    return (
      <div style={styles.page}>
        <h2 style={styles.stepTitle}>Connexion à Loye</h2>
        <p>Souhaitez-vous utiliser un code d’invitation ?</p>

        <div style={styles.optionGrid}>
          <button
            onClick={() => setStep(2)}
            style={{ ...styles.btnPrimary, background: "#f97316" }}
          >
            J’ai un code
          </button>

          <button
            onClick={handleSkip}
            disabled={loading}
            style={styles.btnSecondary}
          >
            {loading ? "Traitement..." : "Continuer sans code"}
          </button>
        </div>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    );
  }

  return null;
}

const styles = {
  page: {
    maxWidth: "1000px",
    margin: "3rem auto",
    padding: "2rem",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#64748b",
    marginBottom: "2rem",
  },
  roleGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "2rem",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "2rem 1.5rem",
    width: 300,
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    transition: "transform 0.2s",
  },
  iconBox: {
    background: "#fff7ed",
    width: 60,
    height: 60,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
  },
  cardDesc: {
    color: "#475569",
    fontSize: "0.95rem",
    marginBottom: "1.5rem",
  },
  btnPrimary: {
    background: "linear-gradient(90deg,#f97316,#f59e0b)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "0.6rem 1.4rem",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(249,115,22,0.25)",
  },
  btnSecondary: {
    background: "#f3f4f6",
    color: "#111827",
    border: "none",
    borderRadius: 8,
    padding: "0.6rem 1.4rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  stepTitle: { fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" },
  form: { display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" },
  input: {
    width: "280px",
    padding: "0.7rem",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 15,
  },
  optionGrid: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  error: {
    color: "#dc2626",
    marginTop: "1rem",
    fontWeight: 600,
  },
};
