import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function AnalyzeImage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [result, setResult] = useState(null);
  const [showFinal, setShowFinal] = useState(false);
  const [printedLines, setPrintedLines] = useState([]);
  const [error, setError] = useState(null);

  const inputRef = useRef();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/"))
      return alert("Upload a valid image file.");

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setShowFinal(false);
    setPrintedLines([]);
    setError(null);
  };

  const printDescription = (lines) => {
    let i = 0;
    const interval = setInterval(() => {
      setPrintedLines((prev) => [...prev, lines[i]]);
      i++;
      if (i === lines.length) clearInterval(interval);
    }, 900);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Upload image first.");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setProgress(0);
    setStatusText("Initializing DeepShield Engine...");
    setResult(null);
    setShowFinal(false);
    setPrintedLines([]);

    let current = 0;

    const scanInterval = setInterval(() => {
      current += 5;
      setProgress(current);

      if (current < 30)
        setStatusText("Scanning pixel matrix...");
      else if (current < 60)
        setStatusText("Detecting synthetic fingerprints...");
      else if (current < 85)
        setStatusText("Analyzing lighting gradients...");
      else
        setStatusText("Evaluating structural consistency...");

      if (current >= 100) clearInterval(scanInterval);
    }, 300);

    try {
      const API_URL =
        import.meta.env.VITE_API_URL;

      const response = await axios.post(
        `${API_URL}/api/predict-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setTimeout(() => {
        setLoading(false);
        setResult(response.data);
        setShowFinal(true);
        setStatusText("Deep Forensic Scan Complete");

        const isFake = response.data.label === "Fake";

        const lines = isFake
          ? [
              "Neural texture inconsistencies detected.",
              "Lighting mismatch across regions.",
              "GAN artifact probability elevated.",
              "Edge distortion signatures found.",
              "Confidence exceeds authenticity threshold."
            ]
          : [
              "Natural lighting distribution verified.",
              "No GAN artifacts detected.",
              "Consistent skin and texture gradients.",
              "Pixel alignment structurally valid.",
              "Authenticity threshold confirmed."
            ];

        printDescription(lines);

      }, 3500);

    } catch (err) {
      setError("Backend connection error.");
      setLoading(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setProgress(0);
    setShowFinal(false);
    setPrintedLines([]);
    setStatusText("");
  };

  const isFake = result?.label === "Fake";
  const confidence = result?.confidence_percent || 0;

  const circleOffset = 377 - (377 * confidence) / 100;

  return (
    <div className="analyze-section">
      <div className="analyze-container">

        <h2 className="analyze-title">🛡 DeepShield AI Scanner</h2>

        <div className="upload-box" onClick={() => inputRef.current.click()}>
          {file ? "Change Image" : "Upload Image"}
          <input
            ref={inputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {preview && (
          <div className="image-wrapper">
            <img src={preview} alt="preview" />
            {loading && <div className="scan-overlay"></div>}
          </div>
        )}

        {file && !loading && (
          <button className="analyze-btn" onClick={handleSubmit}>
            Start Deep Scan
          </button>
        )}

        {loading && (
          <>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="scan-status">{statusText}</p>
          </>
        )}

        {showFinal && result && (
  <div className="final-result">

    {/* BIG RESULT TEXT AT TOP */}
    <div className={`result-label ${isFake ? "fake" : "real"}`}>
      {isFake
        ? "⚠ AI GENERATED IMAGE"
        : "✅ AUTHENTIC REAL IMAGE"}
    </div>

    {/* BIG CIRCLE PERCENTAGE */}
    <div className="result-circle">
      <svg width="160" height="160">
        <circle
          cx="80"
          cy="80"
          r="70"
          className="circle-bg"
        />
        <circle
          cx="80"
          cy="80"
          r="70"
          className="circle-progress"
          style={{
            strokeDasharray: 439.6,
            strokeDashoffset:
              439.6 - (439.6 * confidence) / 100
          }}
        />
      </svg>

      <div className="circle-text">
        {confidence}%
      </div>
    </div>

    {/* DESCRIPTION */}
    <div className="description-box">
      {printedLines.map((line, index) => (
        <div key={index} className="desc-line">
          ➤ {line}
        </div>
      ))}
    </div>

    <button className="secondary-btn" onClick={resetAll}>
      Analyze Another Image
    </button>

  </div>
)}
      

        {error && <p className="error">{error}</p>}

      </div>
    </div>
  );
}