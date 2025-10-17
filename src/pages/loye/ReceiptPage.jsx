import React, { useEffect, useState } from "react";
import { Download, Home, CheckCircle2 } from "lucide-react";
import api from "../../utils/axiosInstance";

const diomandeLogo = "/favicon.ico";

export default function ReceiptPage() {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestPayment() {
      try {
        const res = await api.get("/api/loye/payments/renter/payments/latest");
        setPayment(res.data);
      } catch (err) {
        console.error("Erreur de récupération du dernier paiement :", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestPayment();
  }, []);

  const downloadPDF = () => {
    window.print(); // simpler version until html2canvas/jsPDF integrated
  };

  if (loading)
    return (
      <div style={styles.center}>
        Chargement du reçu...
      </div>
    );

  if (!payment)
    return (
      <div style={styles.center}>
        <h3>Aucun reçu trouvé</h3>
        <button onClick={() => (window.location.href = "/loye/dashboard")} style={styles.orangeBtn}>
          Retour au tableau de bord
        </button>
      </div>
    );

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        {/* Watermark */}
        <img src={diomandeLogo} alt="" style={styles.watermark} />

        {/* Header */}
        <h1 style={styles.title}>Reçu de Paiement</h1>
        <div style={styles.statusRow}>
          <CheckCircle2 size={18} color="#16a34a" />
          <span style={styles.status}>Payé</span>
        </div>

        <hr style={styles.divider} />

        {/* Receipt Info */}
        <div style={styles.infoGrid}>
          <div>
            <p style={styles.label}>NUMÉRO DE REÇU</p>
            <p style={styles.value}>{payment._id || payment.transactionId}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={styles.label}>DATE DU PAIEMENT</p>
            <p style={styles.value}>
              {new Date(payment.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        <hr style={styles.divider} />

        {/* Amount */}
        <div style={styles.amountBox}>
          <p style={styles.amountLabel}>MONTANT PAYÉ</p>
          <p style={styles.amountValue}>
            {Number(payment.netAmount || payment.amount).toLocaleString("fr-FR")} FCFA
          </p>
          <p style={styles.periodText}>
            {payment.period?.month && payment.period?.year
              ? `${payment.period.month}/${payment.period.year}`
              : ""}
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Transaction details */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>💳 DÉTAILS DE TRANSACTION</h3>
          <p><strong>Méthode :</strong> {payment.provider}</p>
          <p><strong>ID transaction :</strong> {payment.transactionId}</p>
          <p><strong>Code logement :</strong> {payment.unitCode}</p>
        </div>

        <p style={styles.footer}>Merci pour votre paiement et votre confiance 💙</p>
      </div>

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button onClick={downloadPDF} style={styles.btnBlack}>
          <Download size={16} style={{ marginRight: 8 }} />
          Télécharger le PDF
        </button>
        <button
          onClick={() => (window.location.href = "/loye/dashboard")}
          style={styles.orangeBtn}
        >
          <Home size={16} style={{ marginRight: 8 }} />
          Retour au tableau de bord
        </button>
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    background: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    padding: "2rem",
    maxWidth: "550px",
    width: "100%",
    position: "relative",
  },
  watermark: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    width: "80px",
    opacity: 0.05,
  },
  title: {
    textAlign: "center",
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  statusRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
    color: "#16a34a",
    marginBottom: "1rem",
  },
  status: { fontWeight: 600 },
  divider: { border: "none", borderTop: "1px solid #e5e7eb", margin: "1rem 0" },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    alignItems: "center",
  },
  label: {
    fontSize: "0.75rem",
    color: "#6b7280",
    letterSpacing: "0.05em",
  },
  value: { fontWeight: 600, color: "#111827" },
  amountBox: { textAlign: "center", margin: "1.5rem 0" },
  amountLabel: { color: "#6b7280", fontSize: "0.9rem", marginBottom: "4px" },
  amountValue: { fontSize: "2.4rem", color: "#f97316", fontWeight: "bold" },
  periodText: { color: "#6b7280", fontSize: "0.9rem" },
  section: { marginTop: "1.2rem" },
  sectionTitle: {
    fontSize: "0.85rem",
    textTransform: "uppercase",
    color: "#6b7280",
    marginBottom: "0.5rem",
  },
  footer: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#6b7280",
    marginTop: "1.5rem",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  btnBlack: {
    background: "#111827",
    color: "#fff",
    border: "2px solid #111827",
    borderRadius: "8px",
    padding: "0.7rem 1.2rem",
    display: "flex",
    alignItems: "center",
    fontWeight: 600,
    cursor: "pointer",
  },
  orangeBtn: {
    background: "#f97316",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.7rem 1.2rem",
    display: "flex",
    alignItems: "center",
    fontWeight: 600,
    cursor: "pointer",
  },
  center: {
    textAlign: "center",
    padding: "2rem",
  },
};
