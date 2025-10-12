import React, { useState, useEffect } from "react";
import {
  FaPhone,
  FaCheckCircle,
  FaMinusCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import axios from "../../utils/axiosInstance";

function formatFCFA(n) {
  if (n === null || n === undefined || isNaN(n)) return "0";
  return Number(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function avatarInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
}

export default function PropertyUnitCard({
  unit,
  editable = false,
  onChange = () => {},
  onUnitUpdate = () => {},
}) {
  const [rent, setRent] = useState(unit.rent ?? "");
  const [dueDate, setDueDate] = useState(unit.rentDueDate ?? 10);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    birthday: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setRent(unit.rent ?? "");
    setDueDate(unit.rentDueDate ?? 10);
  }, [unit.rent, unit.rentDueDate]);

  const handleRentChange = (e) => {
    const val = e.target.value;
    setRent(val);
    const num = Number(val);
    if (!isNaN(num)) onChange(unit._id, { rent: num });
  };

  const handleDueDateChange = (e) => {
    const val = Number(e.target.value);
    setDueDate(val);
    onChange(unit._id, { rentDueDate: val });
  };

  const isOccupied = !!unit.renterId || !!unit.renter;

  const handleCreateAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("❌ Vous devez être connecté.");

      const res = await axios.post(
        `/api/loye/units/${unit._id}/create-renter`,
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUnitUpdate(unit._id, {
        renter: res.data.renter,
        renterId: res.data.renter._id,
      });
      setShowModal(false);
      setForm({ name: "", phone: "", birthday: "", password: "" });
      setShowPassword(false);
      alert("✅ Locataire créé avec succès !");
    } catch (err) {
      console.error("❌ Erreur:", err);
      alert(err.response?.data?.message || "Erreur de création du compte.");
    }
  };

  return (
    <div style={styles.card}>
      {/* ---- Header Row ---- */}
      <div style={styles.topRow}>
        <div>
          <div style={styles.typeLine}>
            <span style={styles.unitType}>{unit.type?.toLowerCase()}</span>
            <span style={styles.code}>Code : {unit.code}</span>
          </div>

          <div style={styles.rentLine}>
            <span style={styles.fcfa}>₣</span>
            {editable ? (
              <input
                type="number"
                value={rent}
                onChange={handleRentChange}
                style={styles.input}
              />
            ) : (
              <span style={styles.rentText}>{formatFCFA(rent)} FCFA</span>
            )}
            <span style={styles.perMonth}>/ mois</span>
          </div>

          {editable && (
            <div style={{ marginTop: 10 }}>
              <label style={{ marginRight: 8 }}>Échéance :</label>
              <select
                value={dueDate}
                onChange={handleDueDateChange}
                style={styles.select}
              >
                {[...Array(28)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {isOccupied ? (
          unit.latestPayment ? (
            <span style={styles.badgePaid}>
              <FaCheckCircle /> Payé
            </span>
          ) : (
            <span style={styles.badgeOccupied}>
              <FaCheckCircle /> Occupé
            </span>
          )
        ) : (
          <span style={styles.badgeVacant}>
            <FaMinusCircle /> Libre
          </span>
        )}
      </div>

      <div style={styles.divider} />

      {/* ---- Tenant Info ---- */}
      {isOccupied ? (
        <div style={styles.tenantBox}>
          {unit.renter?.profilePic ? (
            <img
              src={unit.renter.profilePic}
              alt="Profil"
              style={styles.avatarImg}
            />
          ) : (
            <div style={styles.avatar}>
              {avatarInitials(unit.renter?.name)}
            </div>
          )}
          <div>
            <strong>{unit.renter?.name || "—"}</strong>
            <div style={styles.phoneRow}>
              <FaPhone /> {unit.renter?.phone || "—"}
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.noTenant}>
          <span>Aucun locataire</span>
          <button style={styles.addBtn} onClick={() => setShowModal(true)}>
            + Créer locataire
          </button>
        </div>
      )}

      {/* ---- Rent Status ---- */}
      <div style={styles.footer}>
        <span style={{ color: "#94a3b8" }}>•</span>&nbsp;Statut du loyer :&nbsp;
        {unit.latestPayment ? (
          <span style={{ color: "#15803d", fontWeight: 700 }}>
            Payé le{" "}
            {new Date(unit.latestPayment.date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        ) : (
          <span style={{ color: "#f97316", fontWeight: 700 }}>En attente</span>
        )}
      </div>

      {/* ---- Create Tenant Modal ---- */}
      {showModal && (
        <div style={modal.overlay}>
          <div style={modal.box}>
            <h3>Créer un compte locataire</h3>

            <input
              type="text"
              placeholder="Nom complet"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={modal.input}
            />

            <input
              type="tel"
              placeholder="Téléphone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={modal.input}
            />

            <input
              type="date"
              value={form.birthday}
              onChange={(e) => setForm({ ...form, birthday: e.target.value })}
              style={modal.input}
            />

            <div style={modal.passwordRow}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ ...modal.input, paddingRight: 40 }}
              />
              <button
                onClick={() => setShowPassword((s) => !s)}
                style={modal.eyeBtn}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div style={modal.actions}>
              <button
                style={modal.cancel}
                onClick={() => {
                  setShowModal(false);
                  setShowPassword(false);
                }}
              >
                Annuler
              </button>
              <button style={modal.confirm} onClick={handleCreateAccount}>
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------- Styles ---------------------------- */
const styles = {
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 18,
    border: "1px solid #e5eaf1",
    boxShadow: "0 6px 16px rgba(15,23,42,0.05)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  typeLine: { display: "flex", alignItems: "center", gap: 8 },
  unitType: { fontWeight: 800, fontSize: 18, color: "#0f172a" },
  code: { color: "#64748b", fontWeight: 600, fontSize: 14 },
  rentLine: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  fcfa: {
    background: "#fff7ed",
    color: "#f97316",
    fontWeight: 900,
    borderRadius: 6,
    width: 22,
    height: 22,
    display: "grid",
    placeItems: "center",
  },
  input: {
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "4px 8px",
    width: 100,
  },
  rentText: { fontWeight: 900, fontSize: 18, color: "#0f172a" },
  perMonth: { color: "#94a3b8", fontSize: 14 },
  select: { padding: 6, borderRadius: 6, border: "1px solid #ccc" },
  badgePaid: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#dcfce7",
    color: "#15803d",
    borderRadius: 999,
    padding: "6px 12px",
    fontWeight: 700,
  },
  badgeOccupied: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#fef3c7",
    color: "#92400e",
    borderRadius: 999,
    padding: "6px 12px",
    fontWeight: 700,
  },
  badgeVacant: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#f3f4f6",
    color: "#475569",
    borderRadius: 999,
    padding: "6px 12px",
    fontWeight: 700,
  },
  divider: { height: 1, background: "#f1f5f9", margin: "14px 0" },
  tenantBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#e2e8f0",
    color: "#0f172a",
    fontWeight: 800,
    display: "grid",
    placeItems: "center",
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    objectFit: "cover",
  },
  phoneRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#475569",
    fontSize: 14,
  },
  noTenant: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#334155",
    fontSize: 15,
    fontWeight: 500,
  },
  addBtn: {
    background: "linear-gradient(90deg,#f97316,#f59e0b)",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
    fontWeight: 600,
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px dashed #e5e7eb",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
  },
};

/* ---------------------------- Modal ---------------------------- */
const modal = {
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
  box: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    maxWidth: 420,
    width: "90%",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  input: {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
    width: "100%",
  },
  passwordRow: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#475569",
    fontSize: 16,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },
  cancel: {
    background: "#e5e7eb",
    border: "none",
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
  },
  confirm: {
    background: "linear-gradient(90deg,#f97316,#f59e0b)",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
};
