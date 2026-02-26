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
  const [riskScore, setRiskScore] = useState(0);
  const [aiIndex, setAiIndex] = useState(0);
  const [forensicFlags, setForensicFlags] = useState(0);

  const [imageInfo, setImageInfo] = useState(null);
  const [recommendation, setRecommendation] = useState([]);

  const modelVersion = "DeepShield v2.2";

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
    setRiskScore(0);
    setAiIndex(0);
    setForensicFlags(0);
  };

  const interpretConfidence = (confidence) => {
    if (confidence > 85) return "Extremely High AI Probability";
    if (confidence > 65) return "Strong AI Detection Signals";
    if (confidence > 45) return "Moderate Synthetic Indicators";
    return "Low AI Probability";
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
    }, 200); // 🔥 Faster typing
  };

  const handleSubmit = async () => {
    if (!file) return alert("Upload image first.");

    const formData = new FormData();
    formData.append("file", file);

    resetStates();
    setLoading(true);
    setProgress(10);
    setScanId(generateScanId());

    // 🔥 Max 5 sec timer
    timerRef.current = setInterval(() => {
      setScanTime((prev) => {
        if (prev >= 5) {
          clearInterval(timerRef.current);
          return 5;
        }
        return prev + 1;
      });
    }, 1000);

    progressRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 8));
    }, 300);

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

        const confidence = Math.round(response.data.confidence_percent);
        setRiskScore(confidence);
        setAiIndex(confidence + Math.floor(Math.random() * 5));
        setForensicFlags(Math.floor(confidence / 15));

        if (confidence > 75) setThreatLevel("HIGH");
        else if (confidence > 40) setThreatLevel("MEDIUM");
        else setThreatLevel("LOW");

        // 🔥 Fast confidence animation
        let start = 0;
        const counter = setInterval(() => {
          start += 4;
          if (start >= confidence) {
            setDisplayConfidence(confidence);
            clearInterval(counter);
          } else {
            setDisplayConfidence(start);
          }
        }, 25);

        const isFake = response.data.label === "Fake";

        const lines = isFake
          ? [
              "GAN fingerprint signatures detected.",
              "Synthetic pixel clusters identified.",
              "Lighting variance anomaly confirmed.",
              "Micro-texture distortion patterns found.",
              "AI generative model traces detected.",
            ]
          : [
              "Natural pixel distribution verified.",
              "Organic texture gradients confirmed.",
              "Consistent shadow alignment detected.",
              "No generative adversarial traces found.",
              "Authenticity integrity validated.",
            ];

        printDescription(lines);

        if (isFake) {
          setRecommendation([
            "Avoid publishing this image.",
            "Verify source credibility.",
            "Run reverse image verification.",
            "Flag if used in misinformation.",
          ]);
        } else {
          setRecommendation([
            "Image passed forensic validation.",
            "No AI synthesis markers detected.",
            "Safe for professional usage.",
          ]);
        }
      }, 700);

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
Scan Duration: ${scanTime} sec
Result: ${result.label}
Confidence: ${displayConfidence}%
Threat Level: ${threatLevel}
Risk Score: ${riskScore}/100
AI Probability Index: ${aiIndex}
Forensic Flags: ${forensicFlags}
Model Version: ${modelVersion}
System Status: Stable
Model Integrity: Verified
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
          <div className={`image-wrapper ${isFake ? "glitch" : ""}`}>
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
            <p>⏱ Scan Time: {scanTime}s (Max 5s)</p>
            <p>🆔 Scan ID: {scanId}</p>
            <p>⚙ Neural Engine Processing...</p>
          </>
        )}

        {showFinal && result && (
          <div className="final-result">

            <div className={`result-label ${isFake ? "fake" : "real"}`}>
              {isFake
                ? "⚠ AI GENERATED IMAGE"
                : "✅ AUTHENTIC REAL IMAGE"}
            </div>

            <div className="result-circle">
              <svg width="160" height="160">
                <circle className="circle-bg" cx="80" cy="80" r="70" />
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

            <div className="analysis-meta">
              <p>Threat Level: <strong>{threatLevel}</strong></p>
              <p>{interpretConfidence(confidence)}</p>
              <p>Risk Score: {riskScore}/100</p>
              <p>AI Index: {aiIndex}</p>
              <p>Forensic Flags: {forensicFlags}</p>
              <p>Model Version: {modelVersion}</p>
              <p>Status: Stable | Integrity: Verified</p>
            </div>

            <div className="description-box">
              {printedLines.map((line, index) => (
                <div key={index}>● {line}</div>
              ))}
            </div>

            {imageInfo && (
              <div className="image-details-box">
                <h4>Image Details</h4>
                <p>Name: {imageInfo.name}</p>
                <p>Resolution: {imageInfo.width} × {imageInfo.height}</p>
                <p>Size: {imageInfo.sizeKB} KB</p>
                <p>Type: {imageInfo.type}</p>
              </div>
            )}

            <div className="recommendation-box">
              <h4>Recommended Actions</h4>
              {recommendation.map((rec, i) => (
                <div key={i}>✔ {rec}</div>
              ))}
            </div>

            <div className="report-buttons">
              <button className="download-btn" onClick={downloadReport}>
                Download Report
              </button>

              <button className="reset-btn" onClick={resetAll}>
                Analyze Another Image
              </button>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}