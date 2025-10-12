import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function PropertyHeader({ property, onBack }) {
  return (
    <div style={styles.headerBand}>
      <div style={styles.inner}>
        <button onClick={onBack} style={styles.backBtn}>
          <FaArrowLeft /> &nbsp; Retour
        </button>

        <div style={styles.infoBox}>
          <h1 style={styles.title}>{property.name}</h1>
          <p style={styles.address}>{property.address}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  headerBand: {
    background: "linear-gradient(90deg,#f97316,#f59e0b)",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },
  inner: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: 500,
    width: "fit-content",
  },
  infoBox: {
    marginTop: 4,
  },
  title: {
    margin: "8px 0 4px",
    fontSize: 30,
    fontWeight: 800,
    letterSpacing: "-0.5px",
  },
  address: {
    margin: 0,
    opacity: 0.9,
    fontSize: 15,
  },
};
