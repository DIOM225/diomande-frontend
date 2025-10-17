import EmptyState from "./EmptyState";

function PaymentHistory({ history, historyLoading, formatFCFA }) {
  const viewReceipt = (id) => {
    window.location.href = `/loye/receipt/${id}`;
  };

  return (
    <div style={styles.card}>
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
            const color = statusColor(displayStatus);

            return (
              <div
                key={p._id || p.transactionId}
                style={styles.item}
                onClick={() => viewReceipt(p._id)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#fff7ed")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#f9fafb")
                }
              >
                <div style={styles.left}>
                  <div style={styles.period}>
                    {p.period?.month}/{p.period?.year} —{" "}
                    <strong>{p.unitCode}</strong>
                  </div>
                  <div style={styles.sub}>{p.transactionId}</div>
                </div>

                <div style={styles.right}>
                  <span style={styles.amount}>
                    {formatFCFA(
                      typeof p.netAmount === "number" && p.netAmount > 0
                        ? p.netAmount
                        : p.amount
                    )}
                  </span>
                  <span style={{ ...styles.status, color }}>
                    {formatStatusLabel(displayStatus)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 🔍 Normalize status
function normalizeStatus(status) {
  const s = (status || "").toUpperCase();
  if (["ACCEPTED", "PAID", "COMPLETE"].includes(s)) return "ACCEPTED";
  if (["REFUSED", "FAILED", "ERROR"].includes(s)) return "REFUSED";
  if (["PENDING", "CREATED", "NEW"].includes(s)) return "PENDING";
  return s || "CREATED";
}

// 🎨 Color palette
function statusColor(status) {
  if (status === "ACCEPTED") return "#15803d"; // green
  if (status === "REFUSED") return "#dc2626"; // red
  return "#ff6a00"; // orange
}

// 🏷️ Label
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
    background: "#fff",
    padding: "1.5rem",
    borderRadius: 14,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9",
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    background: "#f9fafb",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "1px solid #f1f5f9",
  },
  left: {
    display: "flex",
    flexDirection: "column",
  },
  period: {
    fontWeight: 700,
    color: "#0f172a",
    fontSize: 15,
  },
  sub: {
    fontSize: 12,
    color: "#64748b",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  amount: {
    fontWeight: 800,
    color: "#111827",
  },
  status: {
    fontWeight: 700,
    fontSize: 14,
  },
};

export default PaymentHistory;
