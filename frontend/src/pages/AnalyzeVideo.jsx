import { useState } from "react";
import axios from "axios";

function AnalyzeVideo() {
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const res = await axios.post(
      "http://127.0.0.1:5000/api/predict-video",
      formData
    );

    setResult(res.data);
  };

  return (
    <div className="center">
      <h2>Analyze Video</h2>
      <input type="file" onChange={handleUpload} />

      {result && (
        <div className="result">
          <h3>{result.label}</h3>
          <h2>{result.confidence}%</h2>
        </div>
      )}
    </div>
  );
}

export default AnalyzeVideo;
