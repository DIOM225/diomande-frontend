// diomande-frontend/src/pages/Profile.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "../utils/axiosInstance";
import { FaCamera } from "react-icons/fa";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dgpzat6o4/image/upload";
const CLOUDINARY_PRESET = "diom_unsigned";

/* ────────────────────────────────
   ✅ Helpers
──────────────────────────────── */
function normalizeCIPhone(raw) {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+225${digits}`;
  if (digits.startsWith("225") && digits.length === 12) return `+${digits}`;
  return raw;
}

function normalizeWaveNumber(raw) {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 10) return null;
  return `+225${digits}`;
}

/* ────────────────────────────────
   ✅ Component
──────────────────────────────── */
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    profilePic: "",
    idImage: "",
  });

  const [verif, setVerif] = useState({
    fullName: "",
    phone: "",
    waveNumber: "",
    bankName: "",
    accountNumber: "",
    idCardImage: "",
    proofOfOwnership: "",
  });
  const [verifStatus, setVerifStatus] = useState(null);
  const [verifLoading, setVerifLoading] = useState(false);
  const [verifMessage, setVerifMessage] = useState("");

  /* ────────────────────────────────
     🔹 Load profile + verification
  ──────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          bio: data.bio || "",
          profilePic: data.profilePic || "",
          idImage: data.idImage || "",
        });

        try {
          const { data: ver } = await axios.get(`/api/loye/verification/${data._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (ver) {
            setVerifStatus(ver.status || null);
            setVerif({
              fullName: ver.fullName || data.name || "",
              phone: ver.phone || data.phone || "",
              waveNumber: ver.waveNumber || "",
              bankName: ver.bankName || "",
              accountNumber: ver.accountNumber || "",
              idCardImage: ver.idCardImage || "",
              proofOfOwnership: ver.proofOfOwnership || "",
            });
          }
        } catch {}
      } catch (err) {
        console.error("❌ Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onChangeVerif = (e) => setVerif((v) => ({ ...v, [e.target.name]: e.target.value }));

  /* ────────────────────────────────
     🔹 Cloudinary upload
  ──────────────────────────────── */
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CLOUDINARY_PRESET);
    const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: fd });
    const out = await res.json();
    if (!out.secure_url) throw new Error("Upload failed");
    return out.secure_url;
  };

  const handleUpload = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, [target]: url }));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Échec du téléversement. Réessayez.");
    }
  };

  /* ────────────────────────────────
     🔹 Save profile
  ──────────────────────────────── */
  const saveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const cleanPhone = normalizeCIPhone(form.phone);
      const { data } = await axios.put(
        "/api/profile/me",
        { ...form, phone: cleanPhone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(data);
      alert("✅ Profil mis à jour");
    } catch (err) {
      console.error("❌ MAJ profil:", err);
      alert("Erreur: mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  /* ────────────────────────────────
     🔹 Submit payout verification
  ──────────────────────────────── */
  const submitVerification = async () => {
    if (!profile?._id) return;
    if (!verif.idCardImage) {
      alert("La carte d'identité est obligatoire.");
      return;
    }

    const cleanWave = normalizeWaveNumber(verif.waveNumber);
    if (!cleanWave) {
      alert("Le numéro Wave doit contenir exactement 10 chiffres (ex: 0759917862).");
      return;
    }

    try {
      setVerifLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/loye/verification",
        { ...verif, waveNumber: cleanWave, userId: profile._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVerifStatus("PENDING");
      setVerifMessage("✅ Documents soumis. En attente d'approbation.");
    } catch (err) {
      console.error("❌ Submission error:", err);
      setVerifMessage("❌ Envoi échoué. Réessayez.");
    } finally {
      setVerifLoading(false);
    }
  };

  if (loading) return <p style={sx.center}>Chargement…</p>;

  /* ────────────────────────────────
     🔸 RENDER
  ──────────────────────────────── */
  return (
    <div style={sx.page}>
      <div style={sx.header}>
        <h1 style={sx.headerTitle}>Mon Profil</h1>
        <p style={sx.headerSubtitle}>
          Gérez vos informations et vos documents afin de recevoir vos paiements
          en toute sécurité sur Diomande.com.
        </p>
      </div>

      {/* 🔸 Full Profile Section */}
      <div style={sx.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <div style={{ position: "relative", width: 100, height: 100 }}>
            <img
              src={
                form.profilePic ||
                "https://res.cloudinary.com/dgpzat6o4/image/upload/v1691688941/default_user.jpg"
              }
              alt="Profil"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ddd",
              }}
            />
            <label
              htmlFor="profile-upload"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "#FF6A00",
                borderRadius: "50%",
                padding: 6,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 6px rgba(0,0,0,0.2)",
              }}
            >
              <FaCamera color="#fff" size={14} />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, "profilePic")}
              style={{ display: "none" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Nom complet">
              <input name="name" value={form.name} onChange={onChange} style={inputStyle(false)} />
            </Field>
            <Field label="Téléphone">
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                style={inputStyle(false)}
                placeholder="07XXXXXXXX"
              />
            </Field>
          </div>
        </div>

        <Field label="Biographie (optionnelle)">
          <textarea
            name="bio"
            value={form.bio}
            onChange={onChange}
            rows={3}
            style={{ ...inputStyle(false), resize: "none" }}
            placeholder="Décrivez brièvement votre rôle ou expérience..."
          />
        </Field>

        <Field label="Carte d'identité (image)">
          {form.idImage && (
            <img
              src={form.idImage}
              alt="Carte d'identité"
              style={{ width: 160, borderRadius: 8, marginBottom: 8 }}
            />
          )}
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "idImage")} />
        </Field>

        <button onClick={saveProfile} style={sx.btn} disabled={saving}>
          {saving ? "Enregistrement..." : "💾 Enregistrer les informations"}
        </button>
      </div>

      {/* 🔸 Verification Section (unchanged) */}
      <div style={sx.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            Vérification du compte (payout)
          </h2>
          <StatusBadge status={verifStatus} />
        </div>

        <p style={sx.muted}>
          Entrez votre numéro Wave (10 chiffres, sans indicatif). Le système ajoutera
          automatiquement +225.
        </p>

        <Field label="Numéro Wave (10 chiffres)">
          <input
            name="waveNumber"
            value={verif.waveNumber}
            onChange={onChangeVerif}
            disabled={verifStatus === "APPROVED"}
            maxLength={10}
            style={inputStyle(verifStatus === "APPROVED")}
            placeholder="0759917862"
          />
        </Field>

        <Field label="Carte d'identité (obligatoire)">
          {verif.idCardImage && (
            <img
              src={verif.idCardImage}
              alt="ID"
              style={{ width: 120, borderRadius: 8, display: "block", marginBottom: 8 }}
            />
          )}
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "idCardImage")} />
        </Field>

        <Field label="Preuve de propriété (optionnelle)">
          {verif.proofOfOwnership && (
            <img
              src={verif.proofOfOwnership}
              alt="Proof"
              style={{ width: 120, borderRadius: 8, display: "block", marginBottom: 8 }}
            />
          )}
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "proofOfOwnership")} />
        </Field>

        <button
          onClick={submitVerification}
          style={{ ...sx.btn, opacity: verifLoading ? 0.7 : 1 }}
          disabled={verifLoading}
        >
          {verifLoading ? "Envoi..." : "Soumettre la vérification"}
        </button>
        {verifMessage && <p style={{ marginTop: 12 }}>{verifMessage}</p>}
      </div>
    </div>
  );
}

/* ────────────────────────────────
   🔸 UI Helpers
──────────────────────────────── */
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#111827" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  if (!status) return <span style={chipColor("UNKNOWN")}>NON SOUMIS</span>;
  return <span style={chipColor(status)}>{status}</span>;
}

function chipColor(kind) {
  const base = {
    padding: "4px 10px",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 12,
  };
  const map = {
    APPROVED: { background: "#ECFDF5", color: "#065F46" },
    PENDING: { background: "#FEF3C7", color: "#92400E" },
    REJECTED: { background: "#FEE2E2", color: "#991B1B" },
    UNKNOWN: { background: "#F3F4F6", color: "#374151" },
  };
  return { ...base, ...(map[kind] || map.UNKNOWN) };
}

function inputStyle(disabled) {
  return {
    width: "100%",
    padding: "12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: disabled ? "#f3f4f6" : "#fff",
    color: disabled ? "#6b7280" : "#111827",
    fontSize: 15,
  };
}

const sx = {
  page: { background: "#F5F7FA", minHeight: "100vh", padding: "32px 16px" },
  header: { textAlign: "center", marginBottom: 24 },
  headerTitle: { margin: 0, fontSize: 28, fontWeight: 800, color: "#111827" },
  headerSubtitle: { margin: "6px 0 0", color: "#6b7280" },
  card: {
    maxWidth: 760,
    margin: "0 auto 20px",
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  },
  btn: {
    padding: "12px 16px",
    borderRadius: 10,
    border: "none",
    background: "#FF6A00",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  muted: { color: "#6b7280", marginTop: 6 },
  center: { textAlign: "center", padding: 40 },
};
