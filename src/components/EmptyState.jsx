function EmptyState({ title, helper }) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem 1rem",
          backgroundColor: "#f9fafb",
          borderRadius: "10px",
          border: "1px dashed #e5e7eb",
        }}
      >
        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
          {title}
        </h4>
        <p style={{ color: "#6b7280", marginTop: "0.4rem", fontSize: "0.9rem" }}>
          {helper}
        </p>
      </div>
    );
  }
  export default EmptyState;
  