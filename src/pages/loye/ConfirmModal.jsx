// 📄 src/pages/loye/ConfirmModal.jsx
import React from "react";

export default function ConfirmModal({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Confirmer les modifications</h3>
        <p style={styles.message}>
          Les changements apportés seront visibles par le locataire.
          Souhaitez-vous continuer ?
        </p>

        <div style={styles.actions}>
          <button style={styles.cancel} onClick={onCancel}>
            Annuler
          </button>
          <button style={styles.confirm} onClick={onConfirm}>
            Oui, enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#fff",
    borderRadius: 16,
    padding: "28px 24px",
    width: "90%",
    maxWidth: 420,
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    textAlign: "center",
    animation: "fadeIn 0.2s ease-in-out",
  },
  title: {
    fontSize: "1.15rem",
    fontWeight: 700,
    marginBottom: 10,
  },
  message: {
    fontSize: "0.95rem",
    color: "#374151",
    lineHeight: 1.5,
  },
  actions: {
    marginTop: 24,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancel: {
    background: "#f3f4f6",
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  confirm: {
    background: "#f97316",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
};
