import EmptyState from "./EmptyState";

function PaymentHistory({ history, historyLoading, formatFCFA }) {
  return (
    <div className="loye-card" style={styles.card}>
      <h3 style={styles.cardTitle}>🧾 Historique des paiements</h3>

      {historyLoading ? (
        <div style={{ ...styles.skel, height: 60 }} />
      ) : history.length === 0 ? (
        <EmptyState
          title="Aucun paiement pour le moment"
          helper="Votre historique apparaîtra ici après votre premier paiement."
        />
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {history.map((p) => {
            const rawStatus = p.providerStatus || p.status;
            const displayStatus = normalizeStatus(rawStatus);

            return (
              <div key={p._id || p.transactionId} style={styles.item}>
                <div style={styles.colLeft}>
                  {p.period?.month}/{p.period?.year} — {p.unitCode}
                  <div style={styles.sub}>{p.transactionId}</div>
                </div>

                <div style={styles.colAmount}>
                  {formatFCFA(
                    typeof p.netAmount === "number" && p.netAmount > 0
                      ? p.netAmount
                      : p.amount
                  )}
                </div>

                <div
                  style={{
                    ...styles.colStatus,
                    color: statusColor(displayStatus),
                  }}
                >
                  {formatStatusLabel(displayStatus)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 🔍 Normalize status to consistent values
function normalizeStatus(status) {
  const s = (status || "").toUpperCase();

  if (["ACCEPTED", "PAID", "COMPLETE"].includes(s)) return "ACCEPTED";
  if (["REFUSED", "FAILED", "ERROR"].includes(s)) return "REFUSED";
  if (["PENDING", "CREATED", "NEW"].includes(s)) return "PENDING";

  return s || "CREATED";
}

// 🎨 Orange-theme color palette
function statusColor(status) {
  if (status === "ACCEPTED") return "#15803d"; // success green
  if (status === "REFUSED") return "#dc2626"; // red
  return "#ff6a00"; // orange pending
}

// 🏷️ Label formatting
function formatStatusLabel(status) {
  const labels = {
    ACCEPTED: "✅ Payé",
    REFUSED: "❌ Échoué",
    PENDING: "⏳ En attente",
    CREATED: "🆕 Créé",
  };
  return labels[status] || status;
}

const styles = {
  card: {
    backgroundColor: "#ffffff",
    padding: "1.5rem",
    borderRadius: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9",
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    transition: "all 0.2s ease-in-out",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: 800,
    marginBottom: "1rem",
    color: "#111827",
  },
  skel: {
    background:
      "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%)",
    backgroundSize: "400% 100%",
    borderRadius: 8,
    animation: "skel 1.4s ease infinite",
  },
  item: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: 10,
    alignItems: "center",
    padding: "12px 14px",
    background: "#f9fafb",
    border: "1px solid #f1f5f9",
    borderRadius: 10,
    transition: "all 0.2s ease-in-out",
  },
  itemHover: {
    background: "#fff7ed",
    borderColor: "#ffedd5",
  },
  colLeft: {
    fontWeight: 600,
    color: "#1e293b",
  },
  sub: { fontSize: 12, color: "#64748b" },
  colAmount: { fontWeight: 700, color: "#0f172a" },
  colStatus: { fontWeight: 700 },
};

export default PaymentHistory;
