export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "60px",
        padding: "25px 20px",
        background: "rgba(15, 23, 42, 0.95)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        {/* Brand */}
        <h3 style={{ color: "#6366f1", fontSize: "18px", margin: 0 }}>
          DeepShield
        </h3>

        {/* Links */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            fontSize: "14px",
            opacity: 0.8,
          }}
        >
          <span style={{ cursor: "pointer" }}>Home</span>
          <span style={{ cursor: "pointer" }}>Features</span>
          <span style={{ cursor: "pointer" }}>FAQ</span>
        </div>

        {/* Copyright */}
        <div
          style={{
            fontSize: "13px",
            opacity: 0.6,
          }}
        >
          © {new Date().getFullYear()} DeepShield · Built by Tanavi ❤️
        </div>
      </div>
    </footer>
  );
}