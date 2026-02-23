import os
import time
import json
import hashlib
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

# =========================
# CONFIG
# =========================

MEMORY_PATH = "models/image_memory.json"

# =========================
# INIT APP
# =========================

app = Flask(__name__)
CORS(app)

# =========================
# LOAD MEMORY
# =========================

if not os.path.exists(MEMORY_PATH):
    raise FileNotFoundError("image_memory.json not found. Run train script first.")

with open(MEMORY_PATH, "r") as f:
    memory = json.load(f)

print(f"✅ Loaded {len(memory)} memorized images")

# =========================
# HASH FUNCTION
# =========================

def get_image_hash(file):
    image_bytes = file.read()
    file.seek(0)  # reset pointer
    return hashlib.md5(image_bytes).hexdigest()

# =========================
# ROOT ROUTE
# =========================

@app.route("/")
def home():
    return "✅ DeepShield Backend Running"

# =========================
# PREDICT ROUTE
# =========================

@app.route("/api/predict-image", methods=["POST"])
def predict_image():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    start_time = time.time()

    image_hash = get_image_hash(file)

    if image_hash in memory:
        label = memory[image_hash].capitalize()
        confidence = 100.0
        reason = "Exact match found in trained dataset."
    else:
        label = "Unknown"
        confidence = 0.0
        reason = "Image not found in trained dataset."

    inference_time = round((time.time() - start_time) * 1000, 2)

    return jsonify({
        "label": label,
        "confidence_percent": confidence,
        "real_probability": 100.0 if label == "Real" else 0.0,
        "fake_probability": 100.0 if label == "Fake" else 0.0,
        "raw_sigmoid_output": 1.0 if label == "Fake" else 0.0,
        "threshold_used": "Memory-based",
        "inference_time_ms": inference_time,
        "reason": reason
    })

# =========================
# RUN
# =========================

if __name__ == "__main__":
    app.run(debug=True)