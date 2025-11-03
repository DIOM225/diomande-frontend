import React, { useMemo } from "react";
import { FaHome, FaUsers, FaChartLine } from "react-icons/fa";

export default function PropertyStats({ units = [] }) {
  // ✅ Compute occupancy stats directly from units
  const stats = useMemo(() => {
    const total = units.length;
    const occupied = units.filter((u) => u.renterId || u.renter).length;
    const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return { total, occupied, rate };
  }, [units]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Total Units */}
          <div
            style={{ ...styles.card, background: "#fff7ed", borderColor: "#fde68a" }}
          >
            <div style={styles.iconBox("#f97316")}>
              <FaHome color="#fff" />
            </div>
            <div>
              <div style={styles.value}>{stats.total}</div>
              <div style={styles.label}>Unités totales</div>
            </div>
          </div>

          {/* Occupied Units */}
          <div
            style={{ ...styles.card, background: "#f0fdf4", borderColor: "#bbf7d0" }}
          >
            <div style={styles.iconBox("#10b981")}>
              <FaUsers color="#fff" />
            </div>
            <div>
              <div style={styles.value}>{stats.occupied}</div>
              <div style={{ ...styles.label, color: "#047857" }}>Occupées</div>
            </div>
          </div>

          {/* Occupancy Rate */}
          <div
            style={{ ...styles.card, background: "#fef3c7", borderColor: "#fde68a" }}
          >
            <div style={styles.iconBox("#f59e0b")}>
              <FaChartLine color="#fff" />
            </div>
            <div>
              <div style={styles.value}>{stats.rate}%</div>
              <div style={{ ...styles.label, color: "#92400e" }}>
                Taux d’occupation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#fff",
    borderBottom: "1px solid #f1f5f9",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  },
  container: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "24px 16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 14,
    border: "1px solid",
    boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
    transition: "transform 0.2s ease",
  },
  iconBox: (bg) => ({
    width: 48,
    height: 48,
    borderRadius: 12,
    background: bg,
    display: "grid",
    placeItems: "center",
    boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
  }),
  value: { fontSize: 26, fontWeight: 900, color: "#0f172a" },
  label: {
    fontSize: 13,
    fontWeight: 700,
    color: "#78350f",
    marginTop: 2,
  },
};
