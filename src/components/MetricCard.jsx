// 📄 src/components/MetricCard.jsx
import React from "react";

function MetricCard({ label, value, icon, dot }) {
  return (
    <div style={styles.card}>
      <div style={styles.left}>
        {/* ✅ Defensive: only uppercase strings */}
        <p style={styles.label}>
          {typeof label === "string" ? label.toUpperCase() : label}
        </p>
        <p style={styles.value}>{value}</p>
      </div>

      <div style={styles.iconBox}>
        {icon}
        {dot && <span style={{ ...styles.dot, backgroundColor: dot }} />}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    border: "1px solid #eef2f7",
    padding: "1rem 1.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "transform 0.2s ease",
  },
  left: {
    flex: 1,
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#64748b",
    marginBottom: "0.25rem",
    letterSpacing: "0.3px",
  },
  value: {
    fontSize: "1.1rem",
    fontWeight: 800,
    color: "#0f172a",
  },
  iconBox: {
    backgroundColor: "#f9fafb",
    padding: "0.6rem 0.7rem",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxShadow: "inset 0 0 4px rgba(0,0,0,0.05)",
  },
  dot: {
    position: "absolute",
    top: "5px",
    right: "5px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },
};

export default MetricCard;
