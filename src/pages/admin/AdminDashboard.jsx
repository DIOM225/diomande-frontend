import { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaUsers, FaBuilding, FaClipboardList, FaSync } from "react-icons/fa";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [tab, setTab] = useState("verifications");
  const [loading, setLoading] = useState(false);

  const [verifications, setVerifications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [payouts, setPayouts] = useState([]);

  const token = localStorage.getItem("token");

  // 🔁 Fetch helpers
  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/loye/verification/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVerifications(data);
    } catch (err) {
      console.error("❌ Error fetching verifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/loye/admin/payments?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(data.items || []);
    } catch (err) {
      console.error("❌ Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/loye/admin/payouts?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayouts(data.items || []);
    } catch (err) {
      console.error("❌ Error fetching payouts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch when tab changes
  useEffect(() => {
    if (tab === "verifications") fetchVerifications();
    if (tab === "payments") fetchPayments();
    if (tab === "payouts") fetchPayouts();
  }, [tab]);

  // 🧱 Components for each section
  const renderVerifications = () => (
    <div className="admin-section">
      <h2>Vérifications des Propriétaires / Gérants</h2>
      <button onClick={fetchVerifications} className="refresh-btn">
        <FaSync /> Actualiser
      </button>
      <div className="admin-grid">
        {verifications.length === 0 ? (
          <p>Aucune vérification trouvée.</p>
        ) : (
          verifications.map((v) => (
            <div key={v._id} className="admin-card">
              <h3>{v.userName}</h3>
              <p><strong>Téléphone :</strong> {v.phone}</p>
              <p><strong>Rôle :</strong> {v.role}</p>
              <p><strong>Statut :</strong> {v.status}</p>
              {v.idImage && <img src={v.idImage} alt="ID" className="admin-img" />}
              {v.proof && <img src={v.proof} alt="Proof" className="admin-img" />}
              <div className="admin-btns">
                <button className="approve-btn" onClick={() => handleDecision(v._id, "approved")}>
                  <FaCheckCircle /> Approuver
                </button>
                <button className="reject-btn" onClick={() => handleDecision(v._id, "rejected")}>
                  <FaTimesCircle /> Rejeter
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const handleDecision = async (id, action) => {
    try {
      await axios.put(`/api/loye/verification/admin/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`✅ Vérification ${action === "approved" ? "approuvée" : "rejetée"}`);
      fetchVerifications();
    } catch (err) {
      console.error("❌ Decision error:", err);
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const renderPayments = () => (
    <div className="admin-section">
      <h2>Paiements des Locataires</h2>
      <button onClick={fetchPayments} className="refresh-btn">
        <FaSync /> Actualiser
      </button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Locataire</th>
            <th>Propriété</th>
            <th>Unité</th>
            <th>Montant</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.renter?.name || "—"}</td>
              <td>{p.property?.name || "—"}</td>
              <td>{p.unit?.code || "—"}</td>
              <td>{p.amount?.toLocaleString()} XOF</td>
              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPayouts = () => (
    <div className="admin-section">
      <h2>Payouts vers Propriétaires / Gérants</h2>
      <button onClick={fetchPayouts} className="refresh-btn">
        <FaSync /> Actualiser
      </button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Bénéficiaire</th>
            <th>Rôle</th>
            <th>Montant</th>
            <th>Statut</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((p) => (
            <tr key={p.id}>
              <td>{p.payoutReceiver?.name || "—"}</td>
              <td>{p.payoutRecipientType || "—"}</td>
              <td>{p.payoutAmount?.toLocaleString()} XOF</td>
              <td>{p.payoutStatus}</td>
              <td>{p.payoutTimestamp ? new Date(p.payoutTimestamp).toLocaleDateString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // 🧩 Render main layout
  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h1>🛠 Admin</h1>
        <ul>
          <li onClick={() => setTab("verifications")} className={tab === "verifications" ? "active" : ""}><FaClipboardList /> Vérifications</li>
          <li onClick={() => setTab("payments")} className={tab === "payments" ? "active" : ""}><FaMoneyBillWave /> Paiements</li>
          <li onClick={() => setTab("payouts")} className={tab === "payouts" ? "active" : ""}><FaMoneyBillWave /> Payouts</li>
          <li onClick={() => setTab("users")} className={tab === "users" ? "active" : ""}><FaUsers /> Utilisateurs</li>
          <li onClick={() => setTab("properties")} className={tab === "properties" ? "active" : ""}><FaBuilding /> Annonces</li>
        </ul>
      </aside>

      <main className="admin-content">
        {loading && <p>Chargement...</p>}
        {!loading && (
          <>
            {tab === "verifications" && renderVerifications()}
            {tab === "payments" && renderPayments()}
            {tab === "payouts" && renderPayouts()}
            {tab === "users" && <p>🧩 Gestion des utilisateurs (à venir)</p>}
            {tab === "properties" && <p>🏘 Gestion des annonces (à venir)</p>}
          </>
        )}
      </main>
    </div>
  );
}
