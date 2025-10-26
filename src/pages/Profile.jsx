import { useEffect, useMemo, useState } from "react";
import axios from "../utils/axiosInstance";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dgpzat6o4/image/upload";
const CLOUDINARY_PRESET = "diom_unsigned";

/* ────────────────────────────────
   ✅ Helper to normalize phone/Wave number
   Always adds +225 if 10 digits are detected
──────────────────────────────── */
function normalizeCIPhone(raw) {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, ""); // keep digits only
  if (digits.length === 10) return `+225${digits}`; // always add +225
  if (digits.startsWith("225") && digits.length === 12) return `+${digits}`; // already has +225
  return null; // invalid
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
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
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          profilePic: data.profilePic || "https://i.pravatar.cc/150?img=12",
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
          } else {
            setVerif((prev) => ({
              ...prev,
              fullName: data.name || "",
              phone: data.phone || "",
            }));
          }
        } catch {}
      } catch (err) {
        console.error("❌ Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isOwnerOrManager = useMemo(
    () => ["owner", "manager"].includes(profile?.role),
    [profile]
  );

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onChangeVerif = (e) =>
    setVerif((v) => ({ ...v, [e.target.name]: e.target.value }));

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
      if (target === "profilePic" || target === "idImage") {
        setForm((f) => ({ ...f, [target]: url }));
      } else {
        setVerif((v) => ({ ...v, [target]: url }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Échec du téléversement. Réessayez.");
    }
  };

  /* ────────────────────────────────
     ✅ Save profile (auto +225 normalization)
  ──────────────────────────────── */
  const saveProfile = async () => {
    try {
      setSaving(true);
      const normalizedPhone = normalizeCIPhone(form.phone);
      if (!normalizedPhone) {
        alert("Le numéro de téléphone doit contenir exactement 10 chiffres (ex: 0707402609).");
        setSaving(false);
        return;
      }

      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        "/api/profile/me",
        { ...form, phone: normalizedPhone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(data);
      setEditing(false);
      alert("✅ Profil mis à jour");
    } catch (err) {
      console.error("❌ MAJ profil:", err);
      alert("Erreur: mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  /* ────────────────────────────────
     ✅ Submit verification (auto +225)
  ──────────────────────────────── */
  const submitVerification = async () => {
    if (!profile?._id) return;
    if (!verif.idCardImage) {
      alert("La carte d'identité est obligatoire.");
      return;
    }

    const cleanWave = normalizeCIPhone(verif.waveNumber);
    if (!cleanWave) {
      alert("Le numéro Wave doit contenir exactement 10 chiffres (ex: 0759917862).");
      return;
    }

    try {
      setVerifLoading(true);
      setVerifMessage("");
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

  const handleModify = (field) => {
    setVerif((v) => ({ ...v, [field]: "" }));
    setVerifStatus(null);
    setVerifMessage("✏️ Vous pouvez maintenant mettre à jour vos informations.");
  };

  if (loading) return <p style={sx.center}>Chargement…</p>;
  if (!profile) return <p style={sx.center}>Impossible de charger le profil.</p>;

  return (
    <div style={sx.page}>
      <div style={sx.header}>
        <h1 style={sx.headerTitle}>Mon Profil</h1>
        <p style={sx.headerSubtitle}>
          Gérez vos informations et, si vous êtes propriétaire / gestionnaire,
          soumettez vos documents pour recevoir vos paiements automatiquement.
        </p>
      </div>

      {/* Verification section */}
      <div style={sx.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Vérification du compte (payout)</h2>
          <StatusBadge status={verifStatus} />
        </div>
        <p style={sx.muted}>
          Entrez votre numéro Wave (10 chiffres). Le système ajoutera automatiquement +225 avant l’envoi.
        </p>

        <Field label="Numéro Wave (10 chiffres)">
          {verif.waveNumber.includes("*") ? (
            <div style={sx.maskBox}>
              <span>{verif.waveNumber} (masqué)</span>
              <button style={sx.btnGhostSmall} onClick={() => handleModify("waveNumber")}>
                Modifier
              </button>
            </div>
          ) : (
            <input
              name="waveNumber"
              value={verif.waveNumber}
              onChange={onChangeVerif}
              disabled={verifStatus === "APPROVED"}
              maxLength={10}
              style={inputStyle(verifStatus === "APPROVED")}
              placeholder="0759917862"
            />
          )}
        </Field>

        {/* Rest of your file unchanged */}
      </div>
    </div>
  );
}

/* Helper components and styles unchanged */
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
    letterSpacing: 0.3,
  };
  const map = {
    owner: { background: "#ECFDF5", color: "#065F46" },
    manager: { background: "#EFF6FF", color: "#1E40AF" },
    APPROVED: { background: "#ECFDF5", color: "#065F46" },
    PENDING: { background: "#FEF3C7", color: "#92400E" },
    REJECTED: { background: "#FEE2E2", color: "#991B1B" },
    UNKNOWN: { background: "#F3F4F6", color: "#374151" },
    user: { background: "#F3F4F6", color: "#374151" },
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
  btnGhostSmall: {
    marginLeft: 8,
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    background: "#fff",
    color: "#111827",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  maskBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    padding: "12px 14px",
  },
  muted: { color: "#6b7280", marginTop: 6 },
  center: { textAlign: "center", padding: 40 },
};
