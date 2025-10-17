import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, Home, CheckCircle2 } from "lucide-react";
import api from "../../utils/axiosInstance";

const diomandeLogo = "/favicon.ico";

export default function ReceiptPage() {
  const { id } = useParams(); // ✅ Get receipt id from URL if present
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch the correct payment (specific or latest)
  useEffect(() => {
    async function fetchPayment() {
      try {
        const endpoint = id
          ? `/api/loye/payments/${id}` // fetch specific receipt
          : `/api/loye/payments/renter/payments/latest`; // fallback
        const res = await api.get(endpoint);
        setPayment(res.data);
      } catch (err) {
        console.error("Erreur de récupération du paiement :", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayment();
  }, [id]);

  if (loading)
    return (
      <div style={styles.center}>
        <p>Chargement du reçu...</p>
      </div>
    );

  if (!payment)
    return (
      <div style={styles.center}>
        <h3>Aucun reçu trouvé</h3>
        <button
          onClick={() => (window.location.href = "/loye/dashboard")}
          style={{ ...styles.button, background: "#f97316", color: "#fff" }}
        >
          <Home size={18} style={{ marginRight: 6 }} /> Retour au tableau de bord
        </button>
      </div>
    );

  const receiptData = {
    receiptNumber: payment._id || payment.transactionId,
    paymentDate: new Date(payment.createdAt).toLocaleDateString("fr-FR"),
    property: {
      name: payment.property?.name,
      address: payment.property?.address,
      code: payment.unitCode,
    },
    renter: {
      name: payment.renter?.name,
      phone: payment.renter?.phone,
    },
    owner: {
      name: payment.owner?.name,
      phone: payment.owner?.phone,
    },
    payment: {
      amount: `${Number(payment.netAmount || payment.amount).toLocaleString(
        "fr-FR"
      )} FCFA`,
      method: payment.provider,
      transactionId: payment.transactionId,
      period: `${payment.period?.month}/${payment.period?.year}`,
      status: "Payé",
    },
  };

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        {/* Receipt Card */}
        <div style={styles.card}>
          {/* Watermark */}
          <img src={diomandeLogo} alt="" style={styles.watermark} />

          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Reçu de Paiement</h1>
            <div style={styles.badge}>
              <CheckCircle2 size={16} style={{ marginRight: 6 }} />
              {receiptData.payment.status}
            </div>
          </div>

          <hr style={styles.hr} />

          {/* Basic Info */}
          <div style={styles.rowBetween}>
            <div>
              <p style={styles.label}>Numéro de reçu</p>
              <p style={styles.value}>{receiptData.receiptNumber}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={styles.label}>Date du paiement</p>
              <p style={styles.value}>{receiptData.paymentDate}</p>
            </div>
          </div>

          <hr style={styles.hr} />

          {/* Amount */}
          <div style={styles.amountSection}>
            <p style={styles.label}>Montant payé</p>
            <p style={styles.amount}>{receiptData.payment.amount}</p>
            <p style={styles.period}>{receiptData.payment.period}</p>
          </div>

          <hr style={styles.hr} />

          {/* Property Info */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📍 Informations du logement</h3>
            <Field label="Propriété" value={receiptData.property.name} />
            <Field label="Adresse" value={receiptData.property.address} />
            <Field label="Code" value={receiptData.property.code} />
          </div>

          <hr style={styles.hrLight} />

          {/* Renter */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>👤 Locataire</h3>
            <Field label="Nom" value={receiptData.renter.name} />
            <Field label="Téléphone" value={receiptData.renter.phone} />
          </div>

          <hr style={styles.hrLight} />

          {/* Owner */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🏠 Propriétaire / Gestionnaire</h3>
            <Field label="Nom" value={receiptData.owner.name} />
            <Field label="Téléphone" value={receiptData.owner.phone} />
          </div>

          <hr style={styles.hrLight} />

          {/* Payment Details */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💳 Détails de transaction</h3>
            <Field
              label="Méthode de paiement"
              value={receiptData.payment.method}
            />
            <Field
              label="ID transaction"
              value={receiptData.payment.transactionId}
            />
          </div>

          <hr style={styles.hr} />

          <p style={styles.footerText}>
            Merci pour votre paiement et votre confiance 💙
          </p>
        </div>

        {/* Buttons */}
        <div style={styles.buttons}>
          <button
            style={{
              ...styles.button,
              background: "#fff",
              color: "#111827",
              border: "2px solid #111827",
            }}
            onClick={() => window.print()}
          >
            <Download size={18} style={{ marginRight: 6 }} /> Télécharger le PDF
          </button>
          <button
            style={{
              ...styles.button,
              background: "#f97316",
              color: "#fff",
            }}
            onClick={() => (window.location.href = "/loye/dashboard")}
          >
            <Home size={18} style={{ marginRight: 6 }} /> Retour au tableau de
            bord
          </button>
        </div>
      </div>
    </main>
  );
}

// 🔹 Field Component
function Field({ label, value }) {
  if (!value) return null;
  return (
    <div style={styles.fieldRow}>
      <span style={styles.fieldLabel}>{label}</span>
      <span style={styles.fieldValue}>{value}</span>
    </div>
  );
}

// 🎨 Styles
const styles = {
  main: {
    background: "#f9fafb",
    minHeight: "100vh",
    padding: "40px 16px",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: 600,
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  card: {
    position: "relative",
    background: "#fff",
    borderRadius: 16,
    padding: "32px 24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  watermark: {
    position: "absolute",
    right: 20,
    bottom: 20,
    opacity: 0.05,
    width: 120,
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 8,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    background: "#dcfce7",
    color: "#15803d",
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 14,
  },
  hr: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "20px 0",
  },
  hrLight: {
    border: "none",
    borderTop: "1px solid #f3f4f6",
    margin: "18px 0",
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  value: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
  },
  amountSection: {
    textAlign: "center",
  },
  amount: {
    fontSize: 36,
    fontWeight: 800,
    color: "#f97316",
  },
  period: {
    color: "#6b7280",
    fontSize: 14,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 6,
    fontWeight: 600,
  },
  fieldRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    margin: "4px 0",
  },
  fieldLabel: {
    color: "#6b7280",
  },
  fieldValue: {
    fontWeight: 600,
    color: "#111827",
  },
  footerText: {
    textAlign: "center",
    color: "#6b7280",
    fontStyle: "italic",
    fontSize: 14,
  },
  buttons: {
    display: "flex",
    gap: 12,
  },
  button: {
    flex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 0",
    fontWeight: 600,
    borderRadius: 8,
    fontSize: 15,
    cursor: "pointer",
    transition: "0.3s",
  },
  center: {
    textAlign: "center",
    padding: "2rem",
  },
};
