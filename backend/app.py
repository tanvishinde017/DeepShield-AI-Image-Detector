from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch
import io
import time

# ==========================
# INIT
# ==========================
app = Flask(__name__)
CORS(app)

MODEL_NAME = "Wvolf/ViT_Deepfake_Detection"

print("🔄 Loading DeepShield Model...")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)

model.to(device)
model.eval()

print("✅ Model Loaded on", device)
print("Labels:", model.config.id2label)


# ==========================
# ROOT
# ==========================
@app.route("/")
def home():
    return "DeepShield Backend Running 🚀"


# ==========================
# PREDICT
# ==========================
@app.route("/api/predict-image", methods=["POST"])
def predict_image():

    if "file" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    try:
        start_time = time.time()

        file = request.files["file"]
        image = Image.open(io.BytesIO(file.read())).convert("RGB")

        inputs = processor(images=image, return_tensors="pt")
        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)[0]

        probs = probs.cpu().numpy()
        labels = model.config.id2label

        results = {labels[i]: float(probs[i]) for i in range(len(probs))}

        # Get highest probability
        top_index = probs.argmax()
        top_label = labels[top_index]
        top_confidence = float(probs[top_index])

        # Strong threshold logic
        threshold = 0.75

        if top_confidence < threshold:
            final_label = "Uncertain (Low Confidence)"
            reason = "Confidence below strict threshold."
        else:
            if "fake" in top_label.lower():
                final_label = "AI Generated"
                reason = "Detected synthetic AI image patterns."
            else:
                final_label = "Real Image"
                reason = "Detected natural real-world image features."

        inference_time = round((time.time() - start_time) * 1000, 2)

        return jsonify({
            "label": final_label,
            "confidence_percent": round(top_confidence * 100, 2),
            "raw_score": round(top_confidence, 4),
            "threshold_used": f"{threshold} strict threshold",
            "inference_time_ms": inference_time,
            "all_probabilities": results,
            "reason": reason
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================
# RUN
# ==========================
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)