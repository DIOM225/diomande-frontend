// 📄 src/components/ContactDetails.jsx
function ContactDetails({ unitData, field }) {
    const hasManager =
      Boolean(unitData?.mgmtEmail) ||
      Boolean(unitData?.mgmtPhone) ||
      Boolean(unitData?.hours);
  
    return (
      <div className="loye-card" style={styles.card}>
        <h3 style={styles.cardTitle}>📞 Informations de contact</h3>
  
        <div style={styles.infoRow}>
          {/* 👤 Left column: renter */}
          <div style={{ flex: 1, minWidth: "250px" }}>
            <h4 style={styles.infoHeader}>Vos informations</h4>
            <p style={styles.infoText}>
              📧 <strong>Email:</strong> {field(unitData.email, "email")}
              <br />
              📞 <strong>Téléphone:</strong> {field(unitData.phone, "phone")}
            </p>
          </div>
  
          {/* 🧑‍💼 Right column: manager or owner */}
          <div style={{ flex: 1, minWidth: "250px" }}>
            <h4 style={styles.infoHeader}>
              {hasManager ? "Gestionnaire" : "Propriétaire"}
            </h4>
            <p style={styles.infoText}>
              📧 <strong>Email:</strong>{" "}
              {field(
                unitData.mgmtEmail,
                hasManager ? "mgmtEmail" : "ownerEmail"
              )}
              <br />
              📞 <strong>Téléphone:</strong>{" "}
              {field(
                unitData.mgmtPhone,
                hasManager ? "mgmtPhone" : "ownerPhone"
              )}
              <br />
              ⏰ <strong>Heures:</strong>{" "}
              {field(unitData.hours, hasManager ? "hours" : "ownerHours")}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  const styles = {
    card: {
      backgroundColor: "#ffffff",
      padding: "1.6rem",
      borderRadius: "14px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      border: "1px solid #f1f5f9",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      transition: "all 0.2s ease-in-out",
    },
    cardTitle: {
      fontSize: "1.2rem",
      fontWeight: 800,
      marginBottom: "1rem",
      color: "#111827",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "2rem",
      flexWrap: "wrap",
    },
    infoHeader: {
      fontSize: "1rem",
      fontWeight: 800,
      color: "#ff6a00", // 🔸 orange accent
      marginBottom: "0.6rem",
    },
    infoText: {
      margin: 0,
      lineHeight: 1.8,
      color: "#334155",
      fontSize: "0.95rem",
    },
  };
  
  export default ContactDetails;
  