export default function HowItWorks() {
  const steps = [
    "Upload image or video.",
    "AI model analyzes facial and pixel inconsistencies.",
    "System generates authenticity result.",
    "Confidence percentage is displayed."
  ];

  return (
    <section className="container">
      <h1 style={{ textAlign: "center", marginBottom: "60px" }}>
        How DeepShield Works
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          alignItems: "center"
        }}
      >
        {steps.map((text, index) => (
          <div key={index} className="example-card" style={{ width: "600px", maxWidth: "100%" }}>
            <h2 style={{ color: "#00bfff", marginBottom: "10px" }}>
              Step {index + 1}
            </h2>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}