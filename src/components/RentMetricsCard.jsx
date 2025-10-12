// 📄 src/components/RentMetricsCard.jsx
import React from "react";
import { FaMoneyBillWave, FaCalendarAlt, FaClock, FaHome } from "react-icons/fa";
import MetricCard from "./MetricCard";
import { formatFCFA, fmtDate, dueDate10 } from "../utils/formatting";

function RentMetricsCard({ unitData }) {
  if (!unitData) return null;

  const rentAmount = Number.isFinite(unitData?.rentAmount)
    ? formatFCFA(unitData.rentAmount)
    : "—";
  const nextDue = fmtDate(dueDate10(unitData?.dueDate || new Date()));
  const leaseEnd = unitData?.leaseEnd || "—";
  const unitType = unitData?.unitType || "—";

  return (
    <div style={styles.metricsRow}>
      <MetricCard
        label="Loyer mensuel"
        value={rentAmount}
        icon={<FaMoneyBillWave size={18} color="#F97316" />}
        dot="#F97316"
      />
      <MetricCard
        label="Prochaine échéance"
        value={nextDue}
        icon={<FaCalendarAlt size={18} color="#F97316" />}
        dot="#F97316"
      />
      <MetricCard
        label="Fin du bail"
        value={leaseEnd}
        icon={<FaClock size={18} color="#F97316" />}
        dot="#F97316"
      />
      <MetricCard
        label="Type"
        value={unitType}
        icon={<FaHome size={18} color="#F97316" />}
        dot="#F97316"
      />
    </div>
  );
}

const styles = {
  metricsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "1rem",
    marginBottom: "1.4rem",
  },
};

export default RentMetricsCard;
