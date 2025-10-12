import PayRentButton from "./PayRentButton";
import { formatFCFA } from "../utils/formatting";
import "./RentBanner.css";

function RentBanner({
  unitData,
  rentStatus,
  field,
  safeUnitCode,
  onAccepted,
  onRefused,
  onClosed,
  renterPhone,
  renterEmail,
}) {
  const dueDay = unitData?.rentDueDate || 10;

  const today = new Date();
  let nextDueDate = new Date(today.getFullYear(), today.getMonth(), dueDay);
  if (today > nextDueDate) {
    nextDueDate = new Date(today.getFullYear(), today.getMonth() + 1, dueDay);
  }

  const prettyDueDate = nextDueDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const dr = Math.ceil((nextDueDate - today) / (1000 * 60 * 60 * 24));

  let bannerVariant = dr > 3 ? "success" : dr >= 0 ? "warning" : "danger";
  let statusLine =
    dr > 1
      ? `Paiement dans ${dr} jours`
      : dr === 1
      ? "Paiement dans 1 jour"
      : dr === 0
      ? "Paiement aujourd’hui"
      : `En retard de ${Math.abs(dr)} jours`;

  if (rentStatus === "paid") {
    bannerVariant = "success";
    statusLine = "✅ Loyer payé pour ce mois";
  }

  // 🎨 Updated color palette (orange theme)
  const colors = {
    success: { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
    warning: { bg: "#fff7ed", border: "#ffedd5", text: "#ff6a00" }, // orange brand
    danger: { bg: "#fef2f2", border: "#fecaca", text: "#dc2626" },
  };

  const c = colors[bannerVariant];

  return (
    <div
      className="loye-banner"
      style={{
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: "14px",
        padding: "1.5rem",
        margin: "1.5rem 0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        transition: "all 0.2s ease",
      }}
    >
      <p
        style={{
          fontWeight: 700,
          fontSize: "1rem",
          color: c.text,
          marginBottom: "0.5rem",
        }}
      >
        🕒 {statusLine}
      </p>

      <p style={{ margin: "0.6rem 0", fontSize: "0.95rem", color: "#334155" }}>
        Prochain paiement de{" "}
        <strong style={{ color: "#111827" }}>
          {field(
            Number.isFinite(unitData?.rentAmount)
              ? formatFCFA(unitData.rentAmount)
              : "",
            "rentAmount"
          )}
        </strong>{" "}
        dû le {field(prettyDueDate, "rentDueDate")}
      </p>

      {unitData?.propertyAddress && (
        <p
          style={{
            marginTop: 4,
            color: "#64748b",
            fontSize: "0.9rem",
          }}
        >
          📍 {unitData.propertyAddress}
        </p>
      )}

      {/* ✅ Button section */}
      <div
        className="banner-btn-wrapper"
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <PayRentButton
          unitCode={safeUnitCode || undefined}
          period={{
            year: nextDueDate.getFullYear(),
            month: nextDueDate.getMonth() + 1,
          }}
          amountXof={unitData?.rentAmount}
          label="Payer le loyer"
          renterName={unitData?.name}
          renterEmail={renterEmail || unitData?.email}
          renterPhone={renterPhone || unitData?.phone}
          onAccepted={onAccepted}
          onRefused={onRefused}
          onClosed={onClosed}
        />
      </div>

      {!safeUnitCode && (
        <div
          style={{
            marginTop: 8,
            color: "#dc2626",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          ⚠️ Le code du logement est manquant — impossible d’initier le
          paiement.
        </div>
      )}
    </div>
  );
}

export default RentBanner;
