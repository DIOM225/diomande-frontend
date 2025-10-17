import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ReceiptPage() {
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch latest confirmed payment (correct path)
  useEffect(() => {
    async function fetchLatestPayment() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

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

  // ✅ Download as PDF
  const downloadPDF = async () => {
    const element = document.getElementById("receipt-container");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Recu-${payment?._id || "Paiement"}.pdf`);
  };

  if (loading) return <div style={styles.center}>Chargement du reçu...</div>;

  if (!payment)
    return (
      <div style={styles.center}>
        <h3>Aucun reçu trouvé</h3>
        <button onClick={() => navigate("/loye/dashboard")} style={styles.btnDark}>
          Retour au tableau de bord
        </button>
      </div>
    );

  const { renter, owner, property } = payment;

  return (
    <div style={styles.wrapper}>
      <div id="receipt-container" style={styles.card}>
        <h2 style={styles.title}>🧾 Reçu de paiement</h2>

        <div style={styles.headerRow}>
          <div><strong>Numéro de reçu :</strong> {payment._id}</div>
          <div><strong>Date :</strong> {new Date(payment.createdAt).toLocaleDateString("fr-FR")}</div>
        </div>

        <hr style={styles.divider} />

        <div style={styles.section}>
          <h3 style={styles.subTitle}>📍 Logement</h3>
          <p><strong>Nom de la propriété :</strong> {property?.name || "—"}</p>
          <p><strong>Adresse :</strong> {property?.address || "—"}</p>
          <p><strong>Code logement :</strong> {payment.unitCode}</p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subTitle}>👤 Locataire</h3>
          <p><strong>Nom :</strong> {renter?.name || "—"}</p>
          <p><strong>Téléphone :</strong> {renter?.phone || "—"}</p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subTitle}>🏠 Propriétaire / Gestionnaire</h3>
          <p><strong>Nom :</strong> {owner?.name || "—"}</p>
          <p><strong>Téléphone :</strong> {owner?.phone || "—"}</p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subTitle}>💰 Détails du paiement</h3>
          <p><strong>Montant payé :</strong> {Number(payment.netAmount || payment.amount).toLocaleString("fr-FR")} FCFA</p>
          <p><strong>Méthode :</strong> {payment.provider}</p>
          <p><strong>ID Transaction :</strong> {payment.transactionId || "—"}</p>
          <p><strong>Période :</strong> {payment.period ? `${payment.period.month}/${payment.period.year}` : "—"}</p>
          <p><strong>Statut :</strong> <span style={{ color: "#059669", fontWeight: 600 }}>Payé ✅</span></p>
        </div>

        <div style={styles.footerNote}>
          Merci pour votre paiement et votre confiance 💙
        </div>
      </div>

      <div style={styles.actions}>
        <button onClick={downloadPDF} style={styles.btnDark}>
          Télécharger le PDF
        </button>
        <button onClick={() => navigate("/loye/dashboard")} style={styles.btnOrange}>
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );
}

// ✅ Clean professional style
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
    padding: "clamp(1rem, 5vw, 2rem)",
  },
  card: {
    background: "#fff",
    padding: "clamp(2rem, 5vw, 3rem)",
    borderRadius: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "650px",
    lineHeight: 1.6,
  },
  title: {
    textAlign: "center",
    fontSize: "1.8rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
  },
  subTitle: {
    fontSize: "1.1rem",
    marginBottom: "0.5rem",
    color: "#111827",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "0.8rem",
    marginBottom: "0.5rem",
  },
  section: {
    margin: "1rem 0",
    background: "#f9fafb",
    padding: "1rem 1.2rem",
    borderRadius: "10px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "1rem 0",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  btnDark: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "0.9rem 1.4rem",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1rem",
    minWidth: "180px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  btnOrange: {
    background: "#f97316",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "0.9rem 1.4rem",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1rem",
    minWidth: "180px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  footerNote: {
    textAlign: "center",
    marginTop: "1.5rem",
    fontStyle: "italic",
    color: "#6b7280",
  },
  center: {
    textAlign: "center",
    padding: "2rem",
    fontSize: "1.1rem",
  },
};
