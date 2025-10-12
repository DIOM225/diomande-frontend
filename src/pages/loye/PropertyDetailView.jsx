import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import {
  FaArrowLeft,
  FaHome,
  FaUsers,
  FaChartLine,
  FaEdit,
} from "react-icons/fa";
import PropertyUnitCard from "./PropertyUnitCard";

export default function PropertyDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});

  const fetchProperty = useCallback(async () => {
    try {
      const res = await axios.get(`/api/loye/properties/${id}`);
      setProperty(res.data);
    } catch (err) {
      console.error("❌ Failed to load property:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const stats = useMemo(() => {
    const total = property?.units?.length || 0;
    const occupied =
      property?.units?.filter((u) => u.renterId || u.renter).length || 0;
    const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return { total, occupied, rate };
  }, [property]);

  const handleChange = (unitId, changes) => {
    setPendingChanges((prev) => ({
      ...prev,
      [unitId]: {
        ...(prev[unitId] || {}),
        ...changes,
      },
    }));
  };

  const handleUnitUpdate = (unitId, updates) => {
    setProperty((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        units: prev.units.map((u) =>
          u._id === unitId ? { ...u, ...updates } : u
        ),
      };
    });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(pendingChanges);
      for (const [unitId, changes] of updates) {
        await axios.patch(`/api/loye/units/${unitId}`, {
          ...(changes.rent !== undefined && { rent: Number(changes.rent) }),
          ...(changes.rentDueDate !== undefined && {
            rentDueDate: Number(changes.rentDueDate),
          }),
        });
      }
      await fetchProperty();
      setPendingChanges({});
      setEditMode(false);
      setShowConfirm(false);
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  if (!property)
    return (
      <div style={styles.loading}>
        <p>Chargement des informations...</p>
      </div>
    );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <FaArrowLeft /> &nbsp; Retour
        </button>

        <div style={styles.headerInfo}>
          <div>
            <h1 style={styles.propertyName}>{property.name}</h1>
            <p style={styles.address}>{property.address}</p>
          </div>
          <div style={styles.actions}>
            <button
              onClick={() => setEditMode(!editMode)}
              style={styles.editBtn}
            >
              <FaEdit /> &nbsp; {editMode ? "Quitter" : "Modifier"}
            </button>

            {editMode && (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={Object.keys(pendingChanges).length === 0}
                style={{
                  ...styles.saveBtn,
                  ...(Object.keys(pendingChanges).length === 0 && {
                    opacity: 0.6,
                    cursor: "not-allowed",
                  }),
                }}
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        <KPI icon={<FaHome />} label="Unités totales" value={stats.total} />
        <KPI
          icon={<FaUsers />}
          label="Occupées"
          value={stats.occupied}
          bg="#fff7ed"
          color="#f97316"
        />
        <KPI
          icon={<FaChartLine />}
          label="Taux d’occupation"
          value={`${stats.rate}%`}
          bg="#f0f9ff"
          color="#0284c7"
        />
      </div>

      {/* Units */}
      <div style={styles.unitSection}>
        <h2 style={styles.sectionTitle}>Unités de la propriété</h2>
        <div style={{ display: "grid", gap: 16 }}>
          {property.units.map((unit) => (
            <PropertyUnitCard
              key={unit._id}
              unit={unit}
              editable={editMode}
              onChange={handleChange}
              onUnitUpdate={handleUnitUpdate}
            />
          ))}
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div style={overlay.overlay}>
          <div style={overlay.modal}>
            <h3>Confirmer les modifications</h3>
            <p>
              Les changements de loyer ou date d’échéance seront visibles par le
              locataire. Confirmer ?
            </p>
            <div style={overlay.actions}>
              <button onClick={() => setShowConfirm(false)} style={overlay.cancel}>
                Annuler
              </button>
              <button onClick={handleSaveAll} disabled={saving} style={overlay.confirm}>
                {saving ? "Enregistrement..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🧩 KPI Card Component */
function KPI({ icon, label, value, bg = "#f8fafc", color = "#0f172a" }) {
  return (
    <div style={{ ...styles.kpiCard, background: bg }}>
      <div style={{ fontSize: 32, fontWeight: 800, color }}>{value}</div>
      <div style={{ color, marginTop: 4, fontWeight: 600 }}>{label}</div>
      <div style={{ position: "absolute", top: 16, right: 16, opacity: 0.2 }}>
        {icon}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f8fafc",
    minHeight: "100vh",
    paddingBottom: 60,
  },
  header: {
    background: "linear-gradient(90deg,#f97316,#f59e0b)",
    color: "#fff",
    padding: 24,
  },
  backBtn: {
    background: "rgba(255,255,255,0.15)",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: 500,
  },
  headerInfo: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
  },
  propertyName: { margin: 0, fontSize: 28, fontWeight: 800 },
  address: { marginTop: 4, opacity: 0.9 },
  actions: { display: "flex", gap: 10 },
  editBtn: {
    background: "#fff",
    color: "#0f172a",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: 600,
  },
  saveBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: 600,
  },
  kpiGrid: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    margin: "24px auto",
    maxWidth: 960,
  },
  kpiCard: {
    flex: 1,
    minWidth: 200,
    borderRadius: 12,
    padding: 16,
    position: "relative",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  unitSection: { maxWidth: 960, margin: "0 auto", padding: "0 16px" },
  sectionTitle: { fontSize: 20, fontWeight: 800, marginBottom: 16 },
  loading: {
    display: "grid",
    placeItems: "center",
    height: "80vh",
    color: "#475569",
  },
};

const overlay = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "grid",
    placeItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    maxWidth: 420,
    width: "90%",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },
  actions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 },
  cancel: {
    background: "#e5e7eb",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },
  confirm: {
    background: "linear-gradient(90deg,#f97316,#f59e0b)",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
};
