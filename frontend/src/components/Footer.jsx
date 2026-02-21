export default function Footer() {
  return (
    <footer style={{
      marginTop: "80px",
      padding: "50px 20px",
      background: "rgba(15, 23, 42, 0.95)",
      borderTop: "1px solid rgba(255,255,255,0.1)"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "40px"
      }}>

        {/* Logo Section */}
        <div>
          <h2 style={{ color: "#6366f1", marginBottom: "10px" }}>
            DeepShield
          </h2>
          <p style={{ maxWidth: "250px", opacity: 0.7 }}>
            AI-powered deepfake detection system built with 
            React, Flask & TensorFlow.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ marginBottom: "15px" }}>Quick Links</h4>
          <p>Home</p>
          <p>Features</p>
          <p>How It Works</p>
          <p>FAQ</p>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 style={{ marginBottom: "15px" }}>Tech Stack</h4>
          <p>React</p>
          <p>Flask</p>
          <p>TensorFlow</p>
          <p>OpenCV</p>
        </div>

      </div>

      {/* Bottom Line */}
      <div style={{
        textAlign: "center",
        marginTop: "40px",
        opacity: 0.6,
        fontSize: "14px"
      }}>
        © {new Date().getFullYear()} DeepShield. Built with ❤️ by Tanavi.
      </div>
    </footer>
  );
}
