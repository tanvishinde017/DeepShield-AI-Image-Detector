import { useState, useRef } from "react";
import axios from "axios";

export default function AnalyzeImage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef();

  // ================= FILE SELECT =================
  const handleFile = (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleFileChange = (e) => handleFile(e.target.files[0]);

  // ================= DRAG =================
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = () => setDragActive(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ================= ANALYZE =================
  const handleSubmit = async () => {
    if (!file) return alert("Upload an image first.");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setProgress(0);
    setResult(null);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 5 : prev));
    }, 300);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/predict-image`,
        formData
      );

      clearInterval(interval);
      setProgress(100);
      setResult(response.data);
    } catch (err) {
      clearInterval(interval);
      alert("Error analyzing image.");
    }

    setLoading(false);
  };

  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setProgress(0);
  };

  const downloadReport = () => {
    if (!result) return;

    const content = `
DeepShield AI Analysis Report
---------------------------------------
File Name: ${file.name}
Result: ${result.label}
Confidence: ${result.confidence_percent}%
Raw Score: ${result.raw_score}
Threshold Used: ${result.threshold_used}
Inference Time: ${result.inference_time_ms} ms

Reason:
${result.reason}

Generated at: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "DeepShield_Report.txt";
    link.click();
  };

  const isAI = result?.label === "AI Generated";

  // Circular meter calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset =
    result ? circumference - (result.confidence_percent / 100) * circumference : 0;

  return (
    <section className="analyze-section">
      <div className="analyze-card">

        <h1 className="analyze-title">🔍 DeepShield Image Analysis</h1>

        {/* Drag Area */}
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: dragActive
              ? "2px solid #00ff88"
              : "2px dashed rgba(255,255,255,0.3)",
            borderRadius: "15px",
            padding: "40px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          <p>{file ? "Change Image" : "Drag & Drop Image or Click"}</p>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </div>

        {/* Preview with Scan Animation */}
        {preview && (
          <div style={{ position: "relative", textAlign: "center" }}>
            <img src={preview} alt="preview" className="preview-img" />

            {loading && <div className="scan-line"></div>}
          </div>
        )}

        {/* Analyze Button */}
        {file && !loading && (
          <button className="primary-btn" onClick={handleSubmit}>
            🚀 Start AI Analysis
          </button>
        )}

        {/* Loading */}
        {loading && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div className="result-box">

            <h2 style={{ color: isAI ? "#ff003c" : "#00ff88" }}>
              {result.label}
            </h2>

            {/* Circular Confidence Meter */}
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
              <svg width="180" height="180">
                <circle
                  stroke="rgba(255,255,255,0.1)"
                  fill="transparent"
                  strokeWidth="10"
                  r={radius}
                  cx="90"
                  cy="90"
                />
                <circle
                  stroke={isAI ? "#ff003c" : "#00ff88"}
                  fill="transparent"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  r={radius}
                  cx="90"
                  cy="90"
                  style={{ transition: "0.8s ease" }}
                />
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="white"
                  fontSize="22"
                  fontWeight="bold"
                >
                  {result.confidence_percent}%
                </text>
              </svg>
            </div>

            <p><strong>Inference Time:</strong> {result.inference_time_ms} ms</p>
            <p style={{ opacity: 0.8 }}>{result.reason}</p>

            <button
              onClick={downloadReport}
              className="secondary-btn"
              style={{ marginTop: "15px" }}
            >
              📄 Download Report
            </button>

            <button
              onClick={resetAll}
              className="secondary-btn"
              style={{ marginTop: "10px" }}
            >
              Analyze Another Image
            </button>

          </div>
        )}

      </div>
    </section>
  );
}