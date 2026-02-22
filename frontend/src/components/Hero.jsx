import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="container">
      <h1 className="hero-title">
        AI Image Authenticity Detector
      </h1>

      <p className="hero-desc">
        DeepShield uses advanced convolutional neural networks trained on
        real and AI-generated datasets to detect synthetic image artifacts,
        GAN inconsistencies, and pixel-level anomalies.
      </p>

      <button 
        className="cta-btn"
        onClick={() => navigate("/analyze-image")}
      >
        🔍 Analyze Image Now
      </button>
    </section>
  );
};