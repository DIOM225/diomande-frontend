// client/src/pages/NotAuthorized.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Accès non autorisé</h1>
        <p style={styles.text}>
          Vous n’avez pas la permission d’accéder à cette page.
          <br />
          Veuillez vous connecter avec le bon compte ou revenir à l’accueil.
        </p>
        <div style={styles.buttons}>
          <button style={styles.homeBtn} onClick={() => navigate("/")}>
            Retour à l’accueil
          </button>
          <button style={styles.loginBtn} onClick={() => navigate("/auth")}>
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: "2rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    padding: "2rem 3rem",
    maxWidth: "480px",
    textAlign: "center",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "1rem",
  },
  text: {
    color: "#475569",
    fontSize: "1rem",
    marginBottom: "1.5rem",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  homeBtn: {
    padding: "0.6rem 1.2rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: "600",
  },
  loginBtn: {
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#1e293b",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default NotAuthorized;
