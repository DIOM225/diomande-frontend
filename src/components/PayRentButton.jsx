import React, { useState } from "react";

export default function PayRentButton({
  unitCode,
  amountXof,
  period,
  renterName,
  renterEmail,
  renterPhone,
  label = "Payer le loyer",
  className = "",
  onAccepted,
  onRefused,
  onClosed,
}) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!unitCode || !amountXof) {
      alert("Code du logement ou montant manquant.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        unitCode,
        amount: amountXof,
        renterPhone,
      };

      console.log("📤 Envoi du paiement Wave:", payload);

      // ✅ Vite-compatible environment variable
      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "https://rental-backend-uqo8.onrender.com";

      const res = await fetch(`${apiUrl}/api/loye/payments/wave/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl; // redirect to Wave
      } else {
        throw new Error(
          data.error?.message || "Échec de la génération du paiement Wave."
        );
      }
    } catch (err) {
      console.error("Erreur de paiement Wave:", err);
      alert(err.message || "Erreur inconnue lors du paiement.");
      if (onRefused) onRefused();
    } finally {
      setLoading(false);
      if (onClosed) onClosed();
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`payrent-btn ${className}`}
      style={{
        width: "100%",
        padding: "0.85rem",
        backgroundColor: loading ? "#22c55e" : "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        fontWeight: 700,
        fontSize: "1rem",
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = "#22c55e";
      }}
      onMouseLeave={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = "#16a34a";
      }}
    >
      {loading ? "Redirection vers Wave..." : label}
    </button>
  );
}
