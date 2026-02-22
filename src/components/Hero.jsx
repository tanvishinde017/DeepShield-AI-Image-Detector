import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">

      <div className="hero-content container">

        {/* Headline */}
        <h1 className="hero-title">
          DeepShield AI
          <span className="hero-highlight">
            {" "}Image Authenticity Detector
          </span>
        </h1>

        {/* Description */}
        <p className="hero-desc">
          Detect AI-generated faces, GAN artifacts, and synthetic pixel
          anomalies using advanced convolutional neural networks and
          confidence-based deepfake analysis.
        </p>

        {/* Buttons */}
        <div className="hero-buttons">

          <button
            className="primary-btn"
            onClick={() => navigate("/analyze-image")}
          >
            🚀 Analyze Now
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/how-it-works")}
          >
            ⚡ Learn More
          </button>

        </div>

        {/* Optional trust badge */}
        <div className="hero-trust">
          <p>✔ CNN Powered &nbsp; ✔ Secure Processing &nbsp; ✔ Real-Time Analysis</p>
        </div>

      </div>

    </section>
  );
}