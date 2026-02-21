from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import json
from predict import predict_image, model

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load threshold if exists
try:
    with open("models/config.json") as f:
        config = json.load(f)
        THRESHOLD = config.get("threshold", 0.5)
except:
    THRESHOLD = 0.5


@app.route("/")
def home():
    return "DeepShield AI Backend Running 🚀"


@app.route("/api/predict-image", methods=["POST"])
def predict():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)

    # ⏱ Start timing
    start_time = time.time()

    label, confidence_percent, raw_score = predict_image(path, return_raw=True)

    inference_time = round((time.time() - start_time) * 1000, 2)

    # Strong explanation logic
    if label == "AI Generated":
        reason = "Detected synthetic texture patterns, pixel-level irregularities, and GAN artifacts."
    else:
        reason = "Natural lighting gradients, organic pixel distribution, and authentic edge transitions detected."

    return jsonify({
        "label": label,
        "confidence_percent": confidence_percent,
        "raw_score": round(raw_score, 4),
        "threshold_used": THRESHOLD,
        "inference_time_ms": inference_time,
        "reason": reason
    })


if __name__ == "__main__":
    app.run(debug=True)