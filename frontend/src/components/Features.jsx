export default function Features() {
  const features = [
    "Advanced CNN model trained on manipulated datasets.",
    "Frame-by-frame scanning ensures high accuracy.",
    "Provides percentage-based authenticity scoring.",
    "Fast backend prediction system.",
    "Uploaded files are not stored permanently."
  ];

  return (
    <section className="container">
      <h1 style={{ textAlign: "center", marginBottom: "60px" }}>
        DeepShield Features
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          justifyContent: "center"
        }}
      >
        {features.map((text, index) => (
          <div key={index} className="example-card">
            <h3 style={{ marginBottom: "15px" }}>
              Feature {index + 1}
            </h3>
            <p style={{ opacity: 0.8 }}>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}