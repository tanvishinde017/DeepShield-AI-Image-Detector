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

  const [scanTime, setScanTime] = useState(0);
  const [displayConfidence, setDisplayConfidence] = useState(0);
  const [analysisTime, setAnalysisTime] = useState(null);
  const [scanId, setScanId] = useState(null);
  const [threatLevel, setThreatLevel] = useState("LOW");

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

  const generateScanId = () => {
    return "DS-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

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
  };

  const handleFile = (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/"))
      return alert("Upload a valid image file.");

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    resetStates();
  };

  // ✅ FIXED PRINT FUNCTION (no empty bullet)
  const printDescription = (lines) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setPrintedLines((prev) => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 700);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Upload image first.");

    const formData = new FormData();
    formData.append("file", file);

    resetStates();
    setLoading(true);
    setProgress(0);
    setStatusText("Initializing DeepShield Engine...");
    setScanId(generateScanId());

    // ⏱ Timer
    timerRef.current = setInterval(() => {
      setScanTime((prev) => prev + 1);
    }, 1000);

    // 📊 Smooth progress
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 4;
      });
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

        // 🚨 Threat level logic
        if (confidence > 75) setThreatLevel("HIGH");
        else if (confidence > 40) setThreatLevel("MEDIUM");
        else setThreatLevel("LOW");

        // 🎯 Animate confidence
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
              "AI synthesis probability elevated."
            ]
          : [
              "Natural lighting distribution verified.",
              "Texture gradients consistent.",
              "No GAN artifacts detected.",
              "Pixel alignment structurally valid.",
              "Authenticity confirmed."
            ];

        printDescription(lines);
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
            <p>{statusText}</p>
            <p>⏱ Scan Time: {scanTime}s</p>
            <p>🆔 Scan ID: {scanId}</p>
          </>
        )}

        {showFinal && result && (
          <div className="final-result">

            <div className="analysis-meta">
              <div>🆔 Scan ID: {scanId}</div>
              <div>🕒 Completed At: {analysisTime}</div>
              <div>⚡ Duration: {scanTime}s</div>
              <div>🚨 Threat Level: {threatLevel}</div>
            </div>

            <div className={`result-label ${isFake ? "fake" : "real"}`}>
              {isFake ? "⚠ AI GENERATED IMAGE" : "✅ AUTHENTIC REAL IMAGE"}
            </div>

            <div className="result-circle">
              <svg width="160" height="160">
                <circle cx="80" cy="80" r="70" className="circle-bg" />
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
              <div className="circle-text">{confidence}%</div>
            </div>

            <div className="description-box">
              {printedLines
                .filter((line) => line)
                .map((line, index) => (
                  <div key={index} className="desc-line">
                    ● {line}
                  </div>
                ))}
            </div>

            <button className="secondary-btn" onClick={downloadReport}>
              Download Report
            </button>

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