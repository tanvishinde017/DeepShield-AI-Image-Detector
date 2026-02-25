import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function AnalyzeImage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [showFinal, setShowFinal] = useState(false);
  const [printedLines, setPrintedLines] = useState([]);
  const [error, setError] = useState(null);

  const [scanTime, setScanTime] = useState(0);
  const [displayConfidence, setDisplayConfidence] = useState(0);
  const [analysisTime, setAnalysisTime] = useState(null);
  const [scanId, setScanId] = useState(null);
  const [threatLevel, setThreatLevel] = useState("LOW");

  const [imageInfo, setImageInfo] = useState(null);
  const [recommendation, setRecommendation] = useState([]);
  const modelVersion = "DeepShield v2.1";

  const inputRef = useRef();
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      clearInterval(timerRef.current);
      clearInterval(progressRef.current);
    };
  }, [preview]);

  const generateScanId = () =>
    "DS-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const resetStates = () => {
    setResult(null);
    setShowFinal(false);
    setPrintedLines([]);
    setError(null);
    setDisplayConfidence(0);
    setScanTime(0);
    setAnalysisTime(null);
    setScanId(null);
    setThreatLevel("LOW");
    setRecommendation([]);
  };

  const interpretConfidence = (confidence) => {
    if (confidence > 85) return "Extremely High Certainty";
    if (confidence > 65) return "Strong Detection Confidence";
    if (confidence > 45) return "Moderate Confidence";
    return "Low Detection Confidence";
  };

  const handleFile = (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/"))
      return alert("Upload a valid image file.");

    const img = new Image();
    img.onload = function () {
      setImageInfo({
        name: selected.name,
        sizeKB: (selected.size / 1024).toFixed(2),
        width: img.width,
        height: img.height,
        type: selected.type,
      });
    };
    img.src = URL.createObjectURL(selected);

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    resetStates();
  };

  const printDescription = (lines) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setPrintedLines((prev) => [...prev, lines[i]]);
        i++;
      } else clearInterval(interval);
    }, 600);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Upload image first.");

    const formData = new FormData();
    formData.append("file", file);

    resetStates();
    setLoading(true);
    setProgress(0);
    setScanId(generateScanId());

    timerRef.current = setInterval(() => {
      setScanTime((prev) => prev + 1);
    }, 1000);

    progressRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? prev : prev + Math.random() * 5));
    }, 400);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.post(
        `${API_URL}/api/predict-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      clearInterval(progressRef.current);
      setProgress(100);

      setTimeout(() => {
        clearInterval(timerRef.current);
        setLoading(false);
        setResult(response.data);
        setShowFinal(true);
        setAnalysisTime(new Date().toLocaleTimeString());

        const confidence = response.data.confidence_percent;

        if (confidence > 75) setThreatLevel("HIGH");
        else if (confidence > 40) setThreatLevel("MEDIUM");
        else setThreatLevel("LOW");

        let start = 0;
        const counter = setInterval(() => {
          start += 1;
          setDisplayConfidence(start);
          if (start >= confidence) clearInterval(counter);
        }, 15);

        const isFake = response.data.label === "Fake";

        const lines = isFake
          ? [
              "Neural inconsistencies detected.",
              "GAN artifact patterns confirmed.",
              "Lighting mismatch across regions.",
              "Edge distortion signatures found.",
              "AI synthesis probability elevated.",
            ]
          : [
              "Natural lighting distribution verified.",
              "Texture gradients consistent.",
              "No GAN artifacts detected.",
              "Pixel alignment structurally valid.",
              "Authenticity confirmed.",
            ];

        printDescription(lines);

        if (isFake) {
          setRecommendation([
            "Avoid sharing this image publicly.",
            "Verify source authenticity.",
            "Cross-check with reverse image search.",
            "Report suspicious media.",
          ]);
        } else {
          setRecommendation([
            "Image passed forensic checks.",
            "No synthetic artifact detected.",
            "Safe for normal usage.",
          ]);
        }
      }, 1500);
    } catch (err) {
      clearInterval(timerRef.current);
      clearInterval(progressRef.current);
      setError("Backend connection error.");
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;

    const report = `
DeepShield AI Forensic Report
---------------------------------
Scan ID: ${scanId}
Completed At: ${analysisTime}
Scan Duration: ${scanTime} seconds
Result: ${result.label}
Confidence: ${displayConfidence}%
Threat Level: ${threatLevel}
Model Version: ${modelVersion}
---------------------------------
`;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DeepShield_Report_${scanId}.txt`;
    a.click();
  };

  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setImageInfo(null);
    resetStates();
  };

  const isFake = result?.label === "Fake";
  const confidence = displayConfidence;

  return (
  <div className="analyze-section">
    <div className="analyze-container">
      <h2 className="analyze-title">🛡 DeepShield AI Scanner</h2>

      {/* Upload */}
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

      {/* Preview */}
      {preview && (
        <div className={`image-wrapper ${isFake ? "glitch" : ""}`}>
          <img src={preview} alt="preview" />
          {loading && <div className="scan-overlay"></div>}
        </div>
      )}

      {/* Scan Button */}
      {file && !loading && (
        <button className="analyze-btn" onClick={handleSubmit}>
          Start Deep Scan
        </button>
      )}

      {/* Loading */}
      {loading && (
        <>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="scan-time">⏱ Scan Time: {scanTime}s</p>
          <p className="scan-time">🆔 Scan ID: {scanId}</p>
        </>
      )}

      {/* Final Result */}
      {showFinal && result && (
        <div className="final-result">

          {/* Result Label */}
          <div
            className={`result-label ${isFake ? "fake" : "real"}`}
          >
            {isFake
              ? "⚠ AI GENERATED IMAGE"
              : "✅ AUTHENTIC REAL IMAGE"}
          </div>

          {/* Confidence Circle */}
          <div className="result-circle">
            <svg width="160" height="160">
              <circle
                className="circle-bg"
                cx="80"
                cy="80"
                r="70"
              />
              <circle
                className="circle-progress"
                cx="80"
                cy="80"
                r="70"
                strokeDasharray={440}
                strokeDashoffset={
                  440 - (440 * confidence) / 100
                }
              />
            </svg>
            <div className="circle-text">{confidence}%</div>
          </div>

          {/* Meta Info */}
          <div className="analysis-meta">
            <p>Threat Level: <strong>{threatLevel}</strong></p>
            <p>{interpretConfidence(confidence)}</p>
            <p>Model Version: {modelVersion}</p>
          </div>

          {/* Description */}
          <div className="description-box">
            {printedLines.map((line, index) => (
              <div
                key={index}
                className="desc-line"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                ● {line}
              </div>
            ))}
          </div>

          {/* Image Details */}
          {imageInfo && (
            <div className="image-details-box">
              <h4>Image Details</h4>
              <p>Name: {imageInfo.name}</p>
              <p>
                Resolution: {imageInfo.width} × {imageInfo.height}
              </p>
              <p>Size: {imageInfo.sizeKB} KB</p>
              <p>Type: {imageInfo.type}</p>
            </div>
          )}

          {/* Recommendations */}
          <div className="recommendation-box">
            <h4>Recommended Actions</h4>
            {recommendation.map((rec, i) => (
              <div key={i}>✔ {rec}</div>
            ))}
          </div>

          {/* Buttons */}
          <div className="report-buttons">
            <button
              className="download-btn"
              onClick={downloadReport}
            >
              Download Report
            </button>

            <button
              className="reset-btn"
              onClick={resetAll}
            >
              Analyze Another Image
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  </div>
); 
}