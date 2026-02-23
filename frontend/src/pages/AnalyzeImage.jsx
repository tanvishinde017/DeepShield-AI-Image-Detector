import { useState, useRef, useEffect } from "react";
import axios from "axios";


export default function AnalyzeImage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef();

  // Clean preview memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Handle file select
  const handleFile = (selected) => {
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };

  // Submit to backend
  const handleSubmit = async () => {
    if (!file) {
      alert("Upload image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setProgress(0);
    setResult(null);
    setError(null);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 5 : prev));
    }, 200);

    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

      const response = await axios.post(
        `${API_URL}/api/predict-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      clearInterval(interval);
      setProgress(100);
      setResult(response.data);
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setError("❌ Backend not running or server error.");
    } finally {
      setLoading(false);
    }
  };

  // Reset
  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setProgress(0);
    setError(null);
  };

  // Download Report
  const downloadReport = () => {
    if (!result) return;

    const content = `
DeepShield AI Report
-----------------------------
File Name: ${file.name}
Prediction: ${result.label}
Confidence: ${result.confidence_percent}%
Real Probability: ${result.real_probability}%
Fake Probability: ${result.fake_probability}%
Inference Time: ${result.inference_time_ms} ms
Reason: ${result.reason}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "DeepShield_Report.txt";
    link.click();
  };

  const isFake = result?.label === "Fake";
  const confidence = result?.confidence_percent || 0;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <div className="container">
      <div className="card">
        <h1>🔍 DeepShield AI Image Analysis</h1>

        {/* Upload Area */}
        <div
          className={`upload-box ${dragActive ? "active" : ""}`}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFile(e.dataTransfer.files[0]);
          }}
        >
          {file
            ? "Click or Drop to Change Image"
            : "Drag & Drop Image or Click to Upload"}

          <input
            ref={inputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="preview-container">
            <img src={preview} alt="preview" />
            {loading && <div className="scan-line"></div>}
          </div>
        )}

        {/* Analyze Button */}
        {file && !loading && (
          <button className="primary-btn" onClick={handleSubmit}>
            🚀 Start AI Analysis
          </button>
        )}

        {/* Progress */}
        {loading && (
          <div className="progress">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Error */}
        {error && <p className="error">{error}</p>}

        {/* Result */}
        {result && (
          <div className="result">
            <h2 className={isFake ? "fake" : "real"}>
              {result.label === "Unknown"
                ? "⚠️ Unknown Image"
                : isFake
                ? "⚠️ AI Generated"
                : "✅ Real Image"}
            </h2>

            <div className="circle-wrapper">
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
                  stroke={
                    result.label === "Unknown"
                      ? "#ffaa00"
                      : isFake
                      ? "#ff003c"
                      : "#00ff88"
                  }
                  fill="transparent"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  r={radius}
                  cx="90"
                  cy="90"
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
                  {confidence}%
                </text>
              </svg>
            </div>

            <p>Inference: {result.inference_time_ms} ms</p>
            <p>{result.reason}</p>

            <button className="secondary-btn" onClick={downloadReport}>
              📄 Download Report
            </button>

            <button className="secondary-btn" onClick={resetAll}>
              Analyze Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}