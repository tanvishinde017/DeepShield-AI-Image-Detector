import { useState } from "react";
import axios from "axios";

export default function AnalyzeImage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please upload an image first.");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setProgress(20);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/predict-image`,
        formData
      );

      setProgress(100);
      setResult(response.data);
    } catch (err) {
      alert("Error analyzing image.");
    }

    setLoading(false);
  };

  const isAI = result?.label === "AI Generated";

  return (
    <section
      style={{
        textAlign: "center",
        padding: "60px 20px",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "#1e293b",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 0 40px rgba(0,0,0,0.6)",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "15px" }}>
          🔍 DeepShield AI Image Detector
        </h1>

        <p style={{ opacity: 0.7, marginBottom: "30px" }}>
          Upload an image to analyze synthetic artifacts, GAN patterns,
          pixel distributions and authenticity signals.
        </p>

        {/* Upload Button */}
        <label
          style={{
            background: "#2563eb",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          📤 Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        {/* Image Preview */}
        {preview && (
          <div style={{ marginTop: "30px" }}>
            <img
              src={preview}
              alt="preview"
              style={{
                maxWidth: "100%",
                borderRadius: "12px",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "30px",
            padding: "12px 30px",
            borderRadius: "8px",
            border: "none",
            background: "#14b8a6",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🚀 Analyze Image
        </button>

        {/* Progress Bar */}
        {loading && (
          <div
            style={{
              marginTop: "25px",
              height: "8px",
              background: "#334155",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#22d3ee",
                transition: "width 0.6s ease",
              }}
            />
          </div>
        )}

        {/* RESULT BOX */}
        {result && (
          <div
            style={{
              marginTop: "40px",
              padding: "25px",
              borderRadius: "14px",
              background: isAI ? "#3f1d1d" : "#0f3d2e",
              boxShadow: isAI
                ? "0 0 25px rgba(255,0,0,0.4)"
                : "0 0 25px rgba(0,255,0,0.3)",
            }}
          >
            <h2
              style={{
                color: isAI ? "#ff4d4f" : "#00e676",
                fontSize: "26px",
                marginBottom: "10px",
              }}
            >
              {result.label}
            </h2>

            {/* Confidence Bar */}
            <div
              style={{
                height: "10px",
                background: "#1e293b",
                borderRadius: "6px",
                marginBottom: "15px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${result.confidence_percent}%`,
                  height: "100%",
                  background: isAI ? "#ff4d4f" : "#00e676",
                  transition: "width 0.8s ease",
                }}
              />
            </div>

            <p><strong>Confidence:</strong> {result.confidence_percent}%</p>
            <p><strong>Raw Score:</strong> {result.raw_score}</p>
            <p><strong>Threshold Used:</strong> {result.threshold_used}</p>
            <p><strong>Inference Time:</strong> {result.inference_time_ms} ms</p>

            <hr style={{ margin: "20px 0", opacity: 0.2 }} />

            <p style={{ fontStyle: "italic", opacity: 0.9 }}>
              {result.reason}
            </p>

            {isAI ? (
              <p style={{ marginTop: "10px", color: "#ff8a80" }}>
                ⚠️ Synthetic generation patterns detected. Image likely created by AI model.
              </p>
            ) : (
              <p style={{ marginTop: "10px", color: "#69f0ae" }}>
                ✅ Natural texture consistency and organic pixel transitions confirmed.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}